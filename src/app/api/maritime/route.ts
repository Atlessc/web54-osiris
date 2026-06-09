import { NextResponse } from 'next/server';
import WebSocket from 'ws';

import {
  MARITIME_AIS_BOUNDING_BOXES,
  MARITIME_CHOKEPOINT_WATCH_ZONES,
  MARITIME_PORT_WATCH_ZONES,
  MARITIME_WATCH_ZONES,
  type MaritimeWatchZone,
} from '@/lib/maritime/watch-zones';

/**
 * OSIRIS — Maritime Intelligence
 * Real-time AIS vessel tracking via AISStream + scoped global maritime watch zones.
 *
 * Scope:
 * - Top global ports
 * - Major chokepoints
 * - Major energy ports
 * - Major U.S. ports
 * - Tier 1 mega ports/chokepoints
 * - Tier 2 regional logistics hubs
 */

type OsirisShipType = 'cargo' | 'tanker' | 'military' | 'passenger' | 'fishing' | 'service' | 'unknown';

type CachedShip = {
  id: number;
  mmsi: number;
  name?: string;
  lat?: number;
  lng?: number;
  speed?: number;
  heading?: number;
  course?: number;
  destination?: string;
  flag?: string;
  type?: OsirisShipType;
  aisTypeCode?: number;
  timestamp: number;
  source: 'AISStream';
  nearestZoneId?: string;
  nearestZoneName?: string;
  nearestZoneDistanceKm?: number;
};

const globalForAis = globalThis as unknown as {
  shipsCache: Map<number, CachedShip>;
  isAisConnecting: boolean;
  aisSocket?: WebSocket;
};

if (!globalForAis.shipsCache) {
  globalForAis.shipsCache = new Map();
  globalForAis.isAisConnecting = false;
}

const shipsCache = globalForAis.shipsCache;

function getAisApiKey() {
  return process.env.AISSTREAM_API_KEY || process.env.AIS_API_KEY;
}

function getOsirisShipType(typeCode?: number): OsirisShipType {
  if (!typeCode) return 'unknown';
  if (typeCode === 30) return 'fishing';
  if (typeCode === 35) return 'military';
  if (typeCode >= 31 && typeCode <= 39) return 'service';
  if (typeCode >= 60 && typeCode <= 69) return 'passenger';
  if (typeCode >= 70 && typeCode <= 79) return 'cargo';
  if (typeCode >= 80 && typeCode <= 89) return 'tanker';
  return 'unknown';
}

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dx = (lng1 - lng2) * Math.cos(((lat1 + lat2) / 2) * Math.PI / 180);
  const dy = lat1 - lat2;
  return Math.sqrt(dx * dx + dy * dy) * 111.32;
}

function getNearestWatchZone(lat: number, lng: number) {
  let nearest: { zone: MaritimeWatchZone; distanceKm: number } | null = null;

  for (const zone of MARITIME_WATCH_ZONES) {
    const distanceKm = getDistanceKm(lat, lng, zone.lat, zone.lng);

    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = { zone, distanceKm };
    }
  }

  return nearest;
}

function connectAisStream() {
  if (globalForAis.isAisConnecting || globalForAis.aisSocket?.readyState === WebSocket.OPEN) {
    return;
  }

  const apiKey = getAisApiKey();

  if (!apiKey) {
    return;
  }

  globalForAis.isAisConnecting = true;

  let ws: WebSocket;

  try {
    ws = new WebSocket('wss://stream.aisstream.io/v0/stream');
    globalForAis.aisSocket = ws;
  } catch {
    globalForAis.isAisConnecting = false;
    return;
  }

  ws.on('open', () => {
    globalForAis.isAisConnecting = false;

    ws.send(
      JSON.stringify({
        APIKey: apiKey,
        BoundingBoxes: MARITIME_AIS_BOUNDING_BOXES,
        FilterMessageTypes: ['PositionReport', 'ShipStaticData'],
      }),
    );
  });

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      const mmsi = Number(parsed.MetaData?.MMSI);

      if (!mmsi) return;

      const existing: CachedShip = shipsCache.get(mmsi) || {
        id: mmsi,
        mmsi,
        timestamp: Date.now(),
        source: 'AISStream',
      };

      if (parsed.MetaData?.ShipName) {
        existing.name = String(parsed.MetaData.ShipName).trim();
      }

      if (parsed.MessageType === 'PositionReport' && parsed.Message?.PositionReport) {
        const report = parsed.Message.PositionReport;
        const lat = Number(report.Latitude);
        const lng = Number(report.Longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          existing.lat = lat;
          existing.lng = lng;
          existing.speed = Number.isFinite(Number(report.Sog)) ? Number(report.Sog) : existing.speed;
          existing.heading = Number.isFinite(Number(report.TrueHeading))
            ? Number(report.TrueHeading)
            : Number.isFinite(Number(report.Cog))
              ? Number(report.Cog)
              : existing.heading;
          existing.course = Number.isFinite(Number(report.Cog)) ? Number(report.Cog) : existing.course;
          existing.timestamp = Date.now();

          const nearest = getNearestWatchZone(lat, lng);

          if (nearest && nearest.distanceKm <= nearest.zone.radiusKm) {
            existing.nearestZoneId = nearest.zone.id;
            existing.nearestZoneName = nearest.zone.name;
            existing.nearestZoneDistanceKm = Number(nearest.distanceKm.toFixed(1));
          }
        }
      } else if (parsed.MessageType === 'ShipStaticData' && parsed.Message?.ShipStaticData) {
        const staticData = parsed.Message.ShipStaticData;
        const typeCode = Number(staticData.Type);

        existing.name = staticData.Name ? String(staticData.Name).trim() : existing.name;
        existing.destination = staticData.Destination
          ? String(staticData.Destination).trim()
          : existing.destination;
        existing.aisTypeCode = Number.isFinite(typeCode) ? typeCode : existing.aisTypeCode;
        existing.type = getOsirisShipType(existing.aisTypeCode);
      }

      if (typeof existing.lat === 'number' && typeof existing.lng === 'number') {
        shipsCache.set(mmsi, existing);
      }

      if (shipsCache.size > 20000) {
        const firstKey = shipsCache.keys().next().value;
        if (firstKey) shipsCache.delete(firstKey);
      }
    } catch {
      // Ignore bad AIS frames.
    }
  });

  ws.on('close', () => {
    globalForAis.isAisConnecting = false;
    globalForAis.aisSocket = undefined;
    setTimeout(connectAisStream, 5000);
  });

  ws.on('error', () => {
    globalForAis.isAisConnecting = false;
    ws.close();
  });
}

connectAisStream();

function getZoneTrafficSnapshot(zone: MaritimeWatchZone, ships: CachedShip[]) {
  let nearbyCount = 0;
  let waitingCount = 0;
  let tankerCount = 0;
  let cargoCount = 0;
  let militaryCount = 0;

  for (const ship of ships) {
    if (typeof ship.lat !== 'number' || typeof ship.lng !== 'number') continue;

    const distanceKm = getDistanceKm(zone.lat, zone.lng, ship.lat, ship.lng);

    if (distanceKm > zone.radiusKm) continue;

    nearbyCount++;

    if ((ship.speed ?? 0) < 0.5 && ship.type !== 'military') {
      waitingCount++;
    }

    if (ship.type === 'tanker') tankerCount++;
    if (ship.type === 'cargo') cargoCount++;
    if (ship.type === 'military') militaryCount++;
  }

  const congestionRatio = nearbyCount > 0 ? waitingCount / nearbyCount : 0;
  let congestion = 'NORMAL';
  let dwellTime = '1-2 Days';

  if (congestionRatio > 0.6 || waitingCount > 30) {
    congestion = 'SEVERE';
    dwellTime = '7+ Days';
  } else if (congestionRatio > 0.4 || waitingCount > 15) {
    congestion = 'CONGESTED';
    dwellTime = '3-5 Days';
  } else if (waitingCount > 8) {
    congestion = 'ELEVATED';
    dwellTime = '2-3 Days';
  }

  return {
    nearbyCount,
    waitingCount,
    tankerCount,
    cargoCount,
    militaryCount,
    congestion,
    dwellTime,
  };
}

export async function GET() {
  connectAisStream();

  const now = Date.now();

  for (const [mmsi, ship] of shipsCache.entries()) {
    if (now - ship.timestamp > 10 * 60 * 1000) {
      shipsCache.delete(mmsi);
    }
  }

  const ships = Array.from(shipsCache.values())
    .filter((ship) => typeof ship.lat === 'number' && typeof ship.lng === 'number')
    .map((ship) => ({
      ...ship,
      ageSeconds: Math.round((now - ship.timestamp) / 1000),
      status: (ship.speed ?? 0) < 0.5 ? 'anchored-or-stationary' : 'underway',
    }));

  const ports = MARITIME_PORT_WATCH_ZONES.map((port) => {
    const snapshot = getZoneTrafficSnapshot(port, ships);

    return {
      id: port.id,
      name: port.name,
      country: port.country,
      lat: port.lat,
      lng: port.lng,
      type: port.mapType,
      tier: port.tier,
      watchType: port.watchType,
      radiusKm: port.radiusKm,
      rank: port.rank,
      tags: port.tags,
      volume: `${port.volume || 'Maritime watch zone'} | LIVE: ${snapshot.nearbyCount} (WAITING: ${snapshot.waitingCount})`,
      live_count: snapshot.nearbyCount,
      waiting_count: snapshot.waitingCount,
      tanker_count: snapshot.tankerCount,
      cargo_count: snapshot.cargoCount,
      military_count: snapshot.militaryCount,
      congestion: snapshot.congestion,
      dwell_time: snapshot.dwellTime,
    };
  });

  const chokepoints = MARITIME_CHOKEPOINT_WATCH_ZONES.map((choke) => {
    const snapshot = getZoneTrafficSnapshot(choke, ships);
    let risk = choke.risk || 'LOW';

    if (snapshot.nearbyCount > 50) risk = 'CRITICAL';
    else if (snapshot.nearbyCount > 20 && risk !== 'CRITICAL') risk = 'HIGH';
    else if (snapshot.nearbyCount > 5 && risk === 'LOW') risk = 'ELEVATED';

    return {
      id: choke.id,
      name: choke.name,
      country: choke.country,
      lat: choke.lat,
      lng: choke.lng,
      tier: choke.tier,
      watchType: choke.watchType,
      radiusKm: choke.radiusKm,
      tags: choke.tags,
      traffic: `${choke.traffic || 'Maritime chokepoint'} | LIVE SHIPS: ${snapshot.nearbyCount}`,
      live_count: snapshot.nearbyCount,
      waiting_count: snapshot.waitingCount,
      tanker_count: snapshot.tankerCount,
      cargo_count: snapshot.cargoCount,
      military_count: snapshot.militaryCount,
      risk,
    };
  });

  return NextResponse.json(
    {
      ports,
      chokepoints,
      ships,
      total_ports: ports.length,
      total_chokepoints: chokepoints.length,
      total_ships: ships.length,
      ais_connected: globalForAis.aisSocket?.readyState === WebSocket.OPEN,
      ais_configured: Boolean(getAisApiKey()),
      bounding_boxes: MARITIME_AIS_BOUNDING_BOXES.length,
      source: 'AISStream + OSIRIS scoped maritime watch zones',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    },
  );
}
