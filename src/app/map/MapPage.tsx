'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  BarChart3,
  Newspaper,
  Search,
  X,
  Globe,
  MapPinned,
  Radar,
  Satellite,
  Moon,
  ExternalLink,
  AlertTriangle,
  Activity,
  Database,
  Wifi,
} from 'lucide-react';

import IntelFeed from '@/components/IntelFeed';
import MarketsPanel from '@/components/MarketsPanel';
import ScmPanel from '@/components/ScmPanel';
import SearchBar from '@/components/SearchBar';
import ScaleBar from '@/components/ScaleBar';
import ErrorBoundary from '@/components/ErrorBoundary';
import SharePanel from '@/components/SharePanel';
import ViewPresets from '@/components/ViewPresets';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import GlobalStatusBar from '@/components/GlobalStatusBar';
import LiveAlerts from '@/components/LiveAlerts';

import { getLocalConfig } from '@/lib/local-config/client';
import type { SettingsConfig } from '@/types/local-config';

const OsirisMap = dynamic(() => import('@/components/OsirisMap'), { ssr: false });
const LayerPanel = dynamic(() => import('@/components/LayerPanel'));
const CameraViewer = dynamic(() => import('@/components/CameraViewer'));
const OsintPanel = dynamic(() => import('@/components/OsintPanel'));

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsMobile(w < 768 || (h < 500 && w < 1024));
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  return isMobile;
}

const UptimeClock = () => {
  const [uptime, setUptime] = useState('00:00:00');
  const startTime = useRef(Date.now());

  useEffect(() => {
    let mounted = true;

    const tick = () => {
      const e = Math.floor((Date.now() - startTime.current) / 1000);

      const nextUptime = `${String(Math.floor(e / 3600)).padStart(2, '0')}:${String(
        Math.floor((e % 3600) / 60),
      ).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`;

      if (!mounted) return;

      setUptime((prev) => {
        if (prev === nextUptime) return prev;
        return nextUptime;
      });
    };

    tick();

    const iv = window.setInterval(tick, 1000);

    return () => {
      mounted = false;
      window.clearInterval(iv);
    };
  }, []);

  return (
    <span className="hidden lg:inline">
      UPTIME: <span className="text-[var(--gold-primary)]">{uptime}</span>
    </span>
  );
};

const getZuluTimeString = () => {
  const now = new Date();

  return `ZULU ${String(now.getUTCHours()).padStart(2, '0')}:${String(
    now.getUTCMinutes(),
  ).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}Z`;
};

const ZuluClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    let mounted = true;

    const tick = () => {
      const nextTime = getZuluTimeString();

      if (!mounted) return;

      setTime((prev) => {
        if (prev === nextTime) return prev;
        return nextTime;
      });
    };

    tick();

    const iv = window.setInterval(tick, 1000);

    return () => {
      mounted = false;
      window.clearInterval(iv);
    };
  }, []);

  return (
    <span className="text-[var(--cyan-primary)] font-bold tabular-nums">
      {time || 'ZULU --:--:--Z'}
    </span>
  );
};

/** Real entity count — no fake throughput metrics */
const ActiveEntityCount = ({ data }: { data: Record<string, unknown[]> }) => {
  const count = useMemo(() => {
    if (!data) return 0;

    return Object.values(data).reduce(
      (sum, v) => sum + (Array.isArray(v) ? v.length : 0),
      0,
    );
  }, [data]);

  return (
    <span className="text-[var(--alert-green)] font-bold tabular-nums">
      {count.toLocaleString()}
    </span>
  );
};

/** Extracts a watchable YouTube URL from embed/channel URLs */
function getYouTubeWatchUrl(url: string): string {
  if (url.includes('channel=')) {
    return `https://www.youtube.com/channel/${url.split('channel=')[1].split('&')[0]}/live`;
  }

  if (url.includes('/embed/')) {
    return `https://www.youtube.com/watch?v=${url.split('/embed/')[1].split('?')[0]}`;
  }

  return url;
}

const DEFAULT_ACTIVE_LAYERS = {
  flights: false,
  private: false,
  jets: false,
  military: false,
  maritime: true,
  satellites: false,
  balloons: false,
  cctv: true,
  live_news: true,
  news_intel: true,
  earthquakes: true,
  fires: false,
  weather: false,
  radiation: false,
  infrastructure: false,
  global_incidents: true,
  war_alerts: false,
  gps_jamming: false,
  day_night: true,
  sdk_stream: true,
};

type ActiveLayers = typeof DEFAULT_ACTIVE_LAYERS;
type ActiveLayerKey = keyof ActiveLayers;

const SETTINGS_LAYER_ALIASES: Record<string, ActiveLayerKey> = {
  flights: 'flights',
  private: 'private',
  jets: 'jets',
  military: 'military',
  maritime: 'maritime',
  satellites: 'satellites',
  balloons: 'balloons',
  cctv: 'cctv',

  'live-news': 'live_news',
  live_news: 'live_news',

  'news-intel': 'news_intel',
  news_intel: 'news_intel',

  earthquakes: 'earthquakes',
  fires: 'fires',
  weather: 'weather',
  radiation: 'radiation',
  infrastructure: 'infrastructure',

  'global-incidents': 'global_incidents',
  global_incidents: 'global_incidents',

  'war-alerts': 'war_alerts',
  war_alerts: 'war_alerts',

  'gps-jamming': 'gps_jamming',
  gps_jamming: 'gps_jamming',

  'day-night': 'day_night',
  day_night: 'day_night',

  'sdk-stream': 'sdk_stream',
  sdk_stream: 'sdk_stream',
};

function normalizeLayerKey(layer: string): ActiveLayerKey | null {
  return SETTINGS_LAYER_ALIASES[layer.trim()] ?? null;
}

function getActiveLayersFromSettings(settings: SettingsConfig): ActiveLayers {
  const enabledLayerKeys = new Set<ActiveLayerKey>();

  for (const layer of settings.enabledLayers) {
    const normalizedLayer = normalizeLayerKey(layer);

    if (normalizedLayer) {
      enabledLayerKeys.add(normalizedLayer);
    }
  }

  return Object.keys(DEFAULT_ACTIVE_LAYERS).reduce((nextLayers, layerKey) => {
    const typedLayerKey = layerKey as ActiveLayerKey;

    nextLayers[typedLayerKey] = enabledLayerKeys.has(typedLayerKey);

    return nextLayers;
  }, { ...DEFAULT_ACTIVE_LAYERS });
}

function getActiveLayersFromUrl(layers: string): ActiveLayers {
  const activeLayerKeys = new Set<ActiveLayerKey>();

  layers
    .split(',')
    .map((layer) => normalizeLayerKey(layer))
    .filter(Boolean)
    .forEach((layer) => activeLayerKeys.add(layer as ActiveLayerKey));

  return Object.keys(DEFAULT_ACTIVE_LAYERS).reduce((nextLayers, layerKey) => {
    const typedLayerKey = layerKey as ActiveLayerKey;

    nextLayers[typedLayerKey] = activeLayerKeys.has(typedLayerKey);

    return nextLayers;
  }, { ...DEFAULT_ACTIVE_LAYERS });
}

export default function MapPage() {
  const mapRuntimeRef = useRef<HTMLElement>(null);
  const dataRef = useRef<any>({});
  const [dataVersion, setDataVersion] = useState(0);

  /**
   * The dashboard uses a ref for high-frequency data updates.
   * This memo creates a render-safe snapshot whenever dataVersion changes.
   */
  const dashboardData = useMemo(() => dataRef.current, [dataVersion]);

  const [backendStatus, setBackendStatus] = useState<'connecting' | 'connected' | 'error'>(
    'connecting',
  );

  const [mapView, setMapView] = useState({ zoom: 2.5, latitude: 20 });

  const [flyToLocation, setFlyToLocation] = useState<{
    lat: number;
    lng: number;
    ts: number;
  } | null>(null);

  const [globalStats, setGlobalStats] = useState<any>(null);
  const mouseCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const coordsDisplayRef = useRef<HTMLDivElement>(null);

  const [locationLabel, setLocationLabel] = useState('');
  const [regionDossier, setRegionDossier] = useState<any>(null);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [activeCamera, setActiveCamera] = useState<any>(null);
  const [spaceWeather, setSpaceWeather] = useState<any>(null);

  const [showLayers, setShowLayers] = useState(true);
  const [showMarkets, setShowMarkets] = useState(true);
  const [showScmPanel, setShowScmPanel] = useState(true);
  const [showIntel, setShowIntel] = useState(true);

  const [mobilePanel, setMobilePanel] = useState<
    'layers' | 'markets' | 'intel' | 'search' | 'recon' | null
  >(null);

  const [mapProjection, setMapProjection] = useState<'globe' | 'mercator'>('globe');
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');
  const [sweepData, setSweepData] = useState<any>(null);
  const [scanTargets, setScanTargets] = useState<any[]>([]);

  const isMobile = useIsMobile();

  const geocodeCache = useRef<Map<string, string>>(new Map());
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGeocodedPos = useRef<{ lat: number; lng: number } | null>(null);

  const [activeLayers, setActiveLayers] = useState<ActiveLayers>(DEFAULT_ACTIVE_LAYERS);
  const hasUrlLayerOverrideRef = useRef(false);

  const [liveFeedUrl, setLiveFeedUrl] = useState<string | null>(null);
  const [liveFeedName, setLiveFeedName] = useState('');
  const [liveFeedEmbedAllowed, setLiveFeedEmbedAllowed] = useState(true);

  // URL state: parse on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const p = new URLSearchParams(window.location.search);
    const lat = parseFloat(p.get('lat') || '');
    const lon = parseFloat(p.get('lon') || '');
    const zoom = parseFloat(p.get('zoom') || '');

    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      setFlyToLocation({ lat, lng: lon, ts: Date.now() });

      if (!Number.isNaN(zoom)) {
        setMapView((v) => ({ ...v, zoom }));
      }
    }

    const layers = p.get('layers');

    if (layers) {
      hasUrlLayerOverrideRef.current = true;
      setActiveLayers(getActiveLayersFromUrl(layers));
    }
  }, []);

  // Local settings config: default active layers
  useEffect(() => {
    let cancelled = false;

    getLocalConfig('settings')
      .then((settings) => {
        if (cancelled) return;

        if (!hasUrlLayerOverrideRef.current) {
          setActiveLayers(getActiveLayersFromSettings(settings));
        }
      })
      .catch((error) => {
        console.warn(
          '[OSIRIS] Failed to load settings config:',
          error instanceof Error ? error.message : error,
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // URL state: update URL on view/layer change (debounced)
  const urlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (urlTimer.current) {
      clearTimeout(urlTimer.current);
    }

    urlTimer.current = setTimeout(() => {
      const p = new URLSearchParams(window.location.search);

      p.set('lat', (mapView.latitude ?? 20).toFixed(4));
      p.set('lon', '0');
      p.set('zoom', mapView.zoom.toFixed(2));

      const active = Object.entries(activeLayers)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(',');

      p.set('layers', active);

      const url = `${window.location.pathname}?${p.toString()}`;
      window.history.replaceState(null, '', url);
    }, 1500);

    return () => {
      if (urlTimer.current) {
        clearTimeout(urlTimer.current);
      }
    };
  }, [mapView, activeLayers]);

  // Global Stats Fetch
  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((d) => {
        if (d.stats) setGlobalStats(d.stats);
      })
      .catch(console.error);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)) return;

      if (e.key === 'f' && !e.ctrlKey) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          mapRuntimeRef.current?.requestFullscreen();
        }
      }

      if (e.key === 'l') setShowLayers((p) => !p);
      if (e.key === 'm') setShowMarkets((p) => !p);
      if (e.key === 'c') setShowScmPanel((p) => !p);
      if (e.key === 'i') setShowIntel((p) => !p);
      if (e.key === 'r') setFlyToLocation({ lat: 20, lng: 0, ts: Date.now() });
      if (e.key === 'g') setMapProjection((p) => (p === 'globe' ? 'mercator' : 'globe'));
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // Mouse coords + reverse geocode (Zero-Render)
  const handleMouseCoords = useCallback((coords: { lat: number; lng: number }) => {
    mouseCoordsRef.current = coords;

    if (coordsDisplayRef.current) {
      coordsDisplayRef.current.innerText = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    }

    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);

    geocodeTimer.current = setTimeout(async () => {
      if (lastGeocodedPos.current) {
        const d =
          Math.abs(coords.lat - lastGeocodedPos.current.lat) +
          Math.abs(coords.lng - lastGeocodedPos.current.lng);

        if (d < 0.5) return;
      }

      const gk = `${coords.lat.toFixed(1)},${coords.lng.toFixed(1)}`;

      if (geocodeCache.current.has(gk)) {
        setLocationLabel(geocodeCache.current.get(gk)!);
        lastGeocodedPos.current = coords;
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json&zoom=10&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          },
        );

        if (res.ok) {
          const d = await res.json();
          const a = d.address || {};

          const label =
            [a.city || a.town || a.village || a.county, a.state || a.region, a.country]
              .filter(Boolean)
              .join(', ') || 'Unknown';

          if (geocodeCache.current.size > 500) {
            const it = geocodeCache.current.keys();

            for (let i = 0; i < 100; i++) {
              const k = it.next().value;
              if (k) geocodeCache.current.delete(k);
            }
          }

          geocodeCache.current.set(gk, label);
          setLocationLabel(label);
          lastGeocodedPos.current = coords;
        }
      } catch (e) {
        console.warn('[OSIRIS] Suppressed error:', e instanceof Error ? e.message : e);
      }
    }, 3000);
  }, []);

  // Region dossier (right-click)
  const handleRightClick = useCallback(async (coords: { lat: number; lng: number }) => {
    setDossierLoading(true);
    setRegionDossier(null);

    try {
      const res = await fetch(`/api/region-dossier?lat=${coords.lat}&lng=${coords.lng}`);

      if (res.ok) {
        setRegionDossier(await res.json());
      }
    } catch (e) {
      console.warn('[OSIRIS] Suppressed error:', e instanceof Error ? e.message : e);
    } finally {
      setDossierLoading(false);
    }
  }, []);

  // Entity click handler
  const handleEntityClick = useCallback((entity: any) => {
    if (entity?.type === 'cctv') {
      setActiveCamera(entity);
    }

    if (entity?.type === 'live_news' && entity.url) {
      setLiveFeedUrl(entity.url);
      setLiveFeedName(entity.name);
      setLiveFeedEmbedAllowed(entity.embed_allowed !== false);
    }
  }, []);

  // ── SHARED FETCH UTILITY ──
  const fetchEndpoint = useCallback(
    async (url: string, transform?: (d: any) => any, options?: RequestInit) => {
      if (typeof document !== 'undefined' && document.hidden) return;

      try {
        const res = await fetch(url, options);

        if (res.ok) {
          const json = await res.json();
          const d = transform ? transform(json) : json;

          dataRef.current = { ...dataRef.current, ...d };
          setDataVersion((v) => v + 1);
          setBackendStatus('connected');
        }
      } catch (e) {
        console.warn('[OSIRIS] Suppressed error:', e instanceof Error ? e.message : e);
        setBackendStatus('error');
      }
    },
    [],
  );

  // ── PROGRESSIVE DATA LOADING ──
  useEffect(() => {
    fetchEndpoint('/api/earthquakes');
    fetchEndpoint('/api/news');

    const marketTimer = setTimeout(
      () => fetchEndpoint('/api/markets', (d) => ({ markets: d })),
      800,
    );

    const spaceTimer = setTimeout(async () => {
      try {
        const r = await fetch('/api/space-weather');

        if (r.ok) {
          setSpaceWeather(await r.json());
        }
      } catch (e) {
        console.warn('[OSIRIS] Suppressed error:', e instanceof Error ? e.message : e);
      }
    }, 5000);

    const intervals = [
      setInterval(() => fetchEndpoint('/api/earthquakes'), 900000),
      setInterval(() => fetchEndpoint('/api/news'), 1800000),
      setInterval(() => fetchEndpoint('/api/markets', (d) => ({ markets: d })), 900000),
    ];

    return () => {
      clearTimeout(marketTimer);
      clearTimeout(spaceTimer);
      intervals.forEach(clearInterval);
    };
  }, [fetchEndpoint]);

  // ── LAYER-AWARE DATA LOADING ──
  const layerFetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (
      activeLayers.flights ||
      activeLayers.military ||
      activeLayers.jets ||
      activeLayers.private
    ) {
      if (!layerFetchedRef.current.has('flights')) {
        fetchEndpoint('/api/flights');
        layerFetchedRef.current.add('flights');
      }
    }

    if (activeLayers.satellites && !layerFetchedRef.current.has('satellites')) {
      fetchEndpoint('/api/satellites');
      layerFetchedRef.current.add('satellites');
    }

    if (activeLayers.fires && !layerFetchedRef.current.has('fires')) {
      fetchEndpoint('/api/fires');
      layerFetchedRef.current.add('fires');
    }

    if (activeLayers.cctv && !layerFetchedRef.current.has('cctv')) {
      fetchEndpoint('/api/cctv?region=all&v=2');
      layerFetchedRef.current.add('cctv');
    }

    if (activeLayers.maritime && !layerFetchedRef.current.has('maritime')) {
      fetchEndpoint('/api/maritime', (d) => ({
        maritime_ports: d.ports,
        maritime_chokepoints: d.chokepoints,
        maritime_ships: d.ships,
      }));

      layerFetchedRef.current.add('maritime');
    }

    if (activeLayers.balloons && !layerFetchedRef.current.has('balloons')) {
      fetchEndpoint('/api/balloons', (d) => ({ balloons: d.balloons }));
      layerFetchedRef.current.add('balloons');
    }

    if (activeLayers.radiation && !layerFetchedRef.current.has('radiation')) {
      fetchEndpoint('/api/radiation', (d) => ({ radiation: d.stations }));
      layerFetchedRef.current.add('radiation');
    }

    if (activeLayers.live_news && !layerFetchedRef.current.has('live_news')) {
      fetchEndpoint('/api/live-news', (d) => ({ live_feeds: d.feeds }));
      layerFetchedRef.current.add('live_news');
    }

    if (activeLayers.weather && !layerFetchedRef.current.has('weather')) {
      fetchEndpoint('/api/weather', (d) => ({ weather_events: d.events }));
      layerFetchedRef.current.add('weather');
    }

    if (activeLayers.infrastructure && !layerFetchedRef.current.has('infrastructure')) {
      fetchEndpoint('/api/infrastructure', (d) => ({ infrastructure: d.infrastructure }));
      layerFetchedRef.current.add('infrastructure');
    }

    // Global Incidents — RSS/GDELT OSINT mapper
    if (activeLayers.global_incidents && !layerFetchedRef.current.has('gdelt')) {
      fetchEndpoint('/api/gdelt', (d) => ({
        gdelt: d.events || [],
        gdeltDerivedSignals: d.derivedSignals || [],
        gdeltMetadata: d.metadata || null,
        gdeltSourceNote: d.sourceNote || null,
      }));

      layerFetchedRef.current.add('gdelt');
    }
  }, [activeLayers, fetchEndpoint]);

  // ── LAYER-AWARE POLLING ──
  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    if (
      activeLayers.flights ||
      activeLayers.military ||
      activeLayers.jets ||
      activeLayers.private
    ) {
      intervals.push(setInterval(() => fetchEndpoint('/api/flights'), 300000));
    }

    if (activeLayers.balloons) {
      intervals.push(
        setInterval(() => fetchEndpoint('/api/balloons', (d) => ({ balloons: d.balloons })), 300000),
      );
    }

    if (activeLayers.radiation) {
      intervals.push(
        setInterval(
          () => fetchEndpoint('/api/radiation', (d) => ({ radiation: d.stations })),
          300000,
        ),
      );
    }

    if (activeLayers.maritime) {
      intervals.push(
        setInterval(
          () =>
            fetchEndpoint('/api/maritime', (d) => ({
              maritime_ports: d.ports,
              maritime_chokepoints: d.chokepoints,
              maritime_ships: d.ships,
            })),
          10000,
        ),
      );
    }

    return () => intervals.forEach(clearInterval);
  }, [activeLayers, fetchEndpoint]);

  // ── OSIRIS SDK — Intelligence Fusion Layer ──
  useEffect(() => {
    if (!activeLayers.sdk_stream) {
      dataRef.current = { ...dataRef.current, sdk_entities: [] };
      setDataVersion((v) => v + 1);
      return;
    }

    const currentData = dataRef.current;
    const sdkEntities: any[] = [];

    const allFlights = [
      ...(currentData.commercial_flights || []),
      ...(currentData.private_flights || []),
      ...(currentData.private_jets || []),
      ...(currentData.military_flights || []),
    ];

    const flightStep = Math.max(1, Math.floor(allFlights.length / 60));

    for (let i = 0; i < allFlights.length; i += flightStep) {
      const f = allFlights[i];

      if (!f.lat || !f.lng) continue;

      sdkEntities.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [f.lng, f.lat],
        },
        properties: {
          domain: 'AIR',
          name: f.callsign?.trim() || 'TRACK',
          source: 'ADS-B / OpenSky',
        },
      });
    }

    const ships = currentData.maritime_ships || [];
    const shipStep = Math.max(1, Math.floor(ships.length / 60));

    for (let i = 0; i < ships.length; i += shipStep) {
      const s = ships[i];

      if (!s.lat || !s.lng) continue;

      sdkEntities.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [s.lng, s.lat],
        },
        properties: {
          domain: 'SEA',
          name: s.name || `MMSI-${s.mmsi}`,
          source: 'AIS Stream',
        },
      });
    }

    if (currentData.earthquakes?.length) {
      for (const eq of currentData.earthquakes) {
        if (!eq.lat || !eq.lng) continue;

        sdkEntities.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [eq.lng, eq.lat],
          },
          properties: {
            domain: 'LAND',
            name: `M${eq.magnitude} ${eq.place || ''}`,
            source: 'USGS',
          },
        });
      }
    }

    if (currentData.gdelt?.length) {
      for (const g of currentData.gdelt) {
        if (!g.lat || !g.lng) continue;

        sdkEntities.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [g.lng, g.lat],
          },
          properties: {
            domain: 'INTEL',
            name: g.name || 'OSINT Event',
            source: 'RSS OSINT Mapping',
          },
        });
      }
    }

    if (currentData.gdeltDerivedSignals?.length) {
      for (const signal of currentData.gdeltDerivedSignals) {
        if (
          typeof signal.location?.lat !== 'number' ||
          typeof signal.location?.lng !== 'number'
        ) {
          continue;
        }

        sdkEntities.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [signal.location.lng, signal.location.lat],
          },
          properties: {
            domain: 'INTEL',
            name: signal.title || 'Derived Watch Condition',
            source: 'OSIRIS Derived Signal',
          },
        });
      }
    }

    if (currentData.news?.length) {
      for (const n of currentData.news) {
        if (!n.coords || n.coords.length < 2) continue;

        sdkEntities.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [n.coords[1], n.coords[0]],
          },
          properties: {
            domain: 'INTEL',
            name: n.title || 'SIGINT',
            source: n.source || 'RSS Feed',
          },
        });
      }
    }

    dataRef.current = { ...dataRef.current, sdk_entities: sdkEntities };
  }, [dataVersion, activeLayers.sdk_stream]);

  const totalFlights = useMemo(
    () =>
      (dashboardData.commercial_flights?.length || 0) +
      (dashboardData.private_flights?.length || 0) +
      (dashboardData.private_jets?.length || 0) +
      (dashboardData.military_flights?.length || 0),
    [
      dashboardData.commercial_flights,
      dashboardData.private_flights,
      dashboardData.private_jets,
      dashboardData.military_flights,
    ],
  );

  const intelData = useMemo(
    () => ({
      news: dashboardData.news || [],
      gdeltDerivedSignals: dashboardData.gdeltDerivedSignals || [],
      gdelt: dashboardData.gdelt || [],
      gdeltMetadata: dashboardData.gdeltMetadata || null,
      gdeltSourceNote: dashboardData.gdeltSourceNote || null,
    }),
    [
      dashboardData.news,
      dashboardData.gdeltDerivedSignals,
      dashboardData.gdelt,
      dashboardData.gdeltMetadata,
      dashboardData.gdeltSourceNote,
    ],
  );

  return (
    <main
      ref={mapRuntimeRef}
      className="relative h-full w-full bg-[var(--bg-void)] overflow-hidden"
    >
      {/* ── MAP ── */}
      <ErrorBoundary name="Map">
        <OsirisMap
          data={dashboardData}
          activeLayers={activeLayers}
          projection={mapProjection}
          mapStyle={
            mapStyle === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'dark'
          }
          onEntityClick={handleEntityClick}
          onMouseCoords={handleMouseCoords}
          onRightClick={handleRightClick}
          onViewStateChange={setMapView}
          flyToLocation={flyToLocation}
          sweepData={sweepData}
          scanTargets={scanTargets}
        />
      </ErrorBoundary>

      {/* ── MAP VIEW CONTROLS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-[75px] md:bottom-6 left-3 md:left-[315px] z-[200] flex items-center gap-2 pointer-events-none"
      >
        <button
          onClick={() => setMapProjection((p) => (p === 'globe' ? 'mercator' : 'globe'))}
          className="glass-panel p-2.5 pointer-events-auto hover:border-[var(--gold-primary)]/40 transition-colors group relative"
          title={mapProjection === 'globe' ? 'Switch to 2D Map' : 'Switch to 3D Globe'}
        >
          {mapProjection === 'globe' ? (
            <MapPinned className="w-4 h-4 text-[var(--gold-primary)] group-hover:scale-110 transition-transform" />
          ) : (
            <Globe className="w-4 h-4 text-[var(--cyan-primary)] group-hover:scale-110 transition-transform" />
          )}

          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[var(--text-muted)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity glass-panel px-2 py-1 z-[300]">
            {mapProjection === 'globe' ? '2D MAP' : '3D GLOBE'}
          </span>
        </button>

        <button
          onClick={() => setMapStyle((s) => (s === 'dark' ? 'satellite' : 'dark'))}
          className="glass-panel p-2.5 pointer-events-auto hover:border-[var(--gold-primary)]/40 transition-colors group relative"
          title={mapStyle === 'dark' ? 'Satellite View' : 'Night View'}
        >
          {mapStyle === 'dark' ? (
            <Satellite className="w-4 h-4 text-[var(--alert-green)] group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--cyan-primary)] group-hover:scale-110 transition-transform" />
          )}

          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[var(--text-muted)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity glass-panel px-2 py-1 z-[300]">
            {mapStyle === 'dark' ? 'SATELLITE' : 'NIGHT MODE'}
          </span>
        </button>
      </motion.div>

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute top-3 left-3 md:top-5 md:left-5 z-[200] pointer-events-none flex items-center gap-2 md:gap-3"
      >
        <div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center relative">
          <div
            className="absolute inset-[-4px] md:inset-[-5px] rounded-full border border-[var(--gold-primary)]/20"
            style={{ animation: 'osiris-rotate 12s linear infinite' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--gold-primary)] shadow-[0_0_6px_var(--gold-primary)]" />
          </div>

          <div
            className="absolute inset-[-8px] md:inset-[-10px] rounded-full border border-[var(--gold-primary)]/10"
            style={{ animation: 'osiris-rotate 20s linear infinite reverse' }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0.5 h-0.5 rounded-full bg-[var(--gold-primary)]/60" />
          </div>

          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-[var(--gold-primary)] flex items-center justify-center animate-glow-pulse">
            <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[var(--gold-primary)]/30 border border-[var(--gold-primary)]/60" />
          </div>

          <div className="absolute w-[1px] h-full bg-[var(--gold-primary)]/30" />
          <div className="absolute w-full h-[1px] bg-[var(--gold-primary)]/30" />
        </div>

        <div className="hidden md:block absolute top-1/2 left-[52px] w-[200px] h-[1px] bg-gradient-to-r from-[var(--gold-primary)]/40 via-[var(--gold-primary)]/15 to-transparent" />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-xl font-bold tracking-[0.4em] md:tracking-[0.5em] text-[var(--text-heading)] font-mono">
              OSIRIS
            </h1>

            <span
              className="hidden md:inline-flex items-center gap-1 px-1.5 py-[1px] rounded-sm border border-[var(--cyan-primary)]/40 bg-[var(--cyan-primary)]/10 text-[7px] font-mono font-bold tracking-[0.15em] text-[var(--cyan-primary)] uppercase"
              style={{ lineHeight: '1.4' }}
            >
              <Globe className="w-2.5 h-2.5" />
              OPEN SOURCE
            </span>
          </div>

          <span className="text-[8px] md:text-[9px] text-[var(--gold-primary)] font-mono tracking-[0.2em] md:tracking-[0.3em] opacity-80">
            GLOBAL INTELLIGENCE COMMAND
          </span>
        </div>
      </motion.div>

      {/* ── TOP-RIGHT STATUS ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="status-bar-desktop absolute top-3 right-3 md:top-4 md:right-5 z-[200] pointer-events-none flex items-center gap-1.5 md:gap-3 text-[9px] md:text-[10px] font-mono tracking-widest text-[var(--text-muted)]"
      >
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[var(--border-primary)] bg-black/30">
          <ZuluClock />
        </span>

        <span className="hidden lg:inline text-[var(--border-primary)]">│</span>

        <span className="flex items-center gap-1">
          SYS:{' '}
          <span
            className={
              backendStatus === 'connected'
                ? 'text-[var(--alert-green)]'
                : 'text-[var(--alert-red)]'
            }
          >
            {backendStatus.toUpperCase()}
          </span>
        </span>

        {spaceWeather && (
          <span className="hidden lg:inline">
            SOLAR:{' '}
            <span style={{ color: spaceWeather.storm_color, fontWeight: 700 }}>
              Kp{spaceWeather.kp_index}
            </span>
          </span>
        )}

        <span className="hidden lg:inline-flex items-center gap-1">
          <Wifi className="w-3 h-3 text-[var(--cyan-primary)]" />
          <span className="text-[var(--cyan-primary)] font-bold">
            {Object.values(activeLayers).filter(Boolean).length}
          </span>
          <span className="text-[var(--text-muted)]/60">LAYERS</span>
        </span>

        <UptimeClock />

        <a
          href="https://ko-fi.com/M8D41ZYW4Z"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto hover:opacity-80 transition-opacity ml-1 flex items-center"
        >
          <span className="px-3 py-1 rounded-sm border border-[var(--gold-primary)]/40 bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] text-[11px] font-bold tracking-[0.2em]">
            SUPPORT PROJECT
          </span>
        </a>
      </motion.div>

      {/* ── MOBILE: Compact top status ── */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute top-3 right-3 z-[200] pointer-events-auto flex items-center gap-2"
        >
          <a
            href="https://ko-fi.com/M8D41ZYW4Z"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel px-2 py-1 flex items-center gap-1.5 text-[7px] font-mono tracking-widest hover:opacity-80 transition-opacity border-[var(--gold-primary)]/40 bg-[var(--gold-primary)]/10"
          >
            <div className="w-1 h-1 rounded-full bg-[var(--gold-primary)] animate-osiris-pulse" />
            <span className="text-[var(--gold-primary)] font-bold">SUPPORT PROJECT</span>
          </a>
        </motion.div>
      )}

      {/* ── LEFT HUD ── */}
      <div className="desktop-panel absolute left-5 top-20 bottom-24 w-72 z-[200] pointer-events-none min-h-0">
        <div className="h-full max-h-full min-h-0 overflow-y-auto overflow-x-hidden styled-scrollbar pr-1 pb-8 pointer-events-auto">
          <div className="flex min-h-max flex-col gap-3">
            {showLayers && (
              <>
                <LayerPanel
                  data={dashboardData}
                  activeLayers={activeLayers}
                  setActiveLayers={setActiveLayers}
                />

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel px-3 py-2.5 pointer-events-auto shrink-0"
                >
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div>
                      <div className="hud-label">AIRCRAFT</div>
                      <div className="hud-value text-[10px] animate-data-pulse">
                        {globalStats ? globalStats.flights.toLocaleString() : '0'}
                      </div>
                    </div>

                    <div>
                      <div className="hud-label">SATS</div>
                      <div className="hud-value text-[10px]">
                        {globalStats ? globalStats.sats.toLocaleString() : '0'}
                      </div>
                    </div>

                    <div>
                      <div className="hud-label">CCTV</div>
                      <div className="hud-value text-[10px]">
                        {globalStats ? globalStats.cctv.toLocaleString() : '0'}
                      </div>
                    </div>

                    <div>
                      <div className="hud-label">WEATHER</div>
                      <div
                        className="hud-value text-[10px]"
                        style={{ color: 'var(--accent-weather)' }}
                      >
                        {globalStats ? globalStats.weather.toLocaleString() : '0'}
                      </div>
                    </div>

                    <div>
                      <div className="hud-label">NUCLEAR</div>
                      <div
                        className="hud-value text-[10px]"
                        style={{ color: 'var(--accent-nuclear)' }}
                      >
                        {globalStats ? globalStats.nuclear.toLocaleString() : '0'}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <ViewPresets
                  onNavigate={(lat, lng, zoom) => {
                    setFlyToLocation({ lat, lng, ts: Date.now() });
                    setMapView((v) => ({ ...v, zoom }));
                  }}
                />
              </>
            )}

            {showScmPanel && <ScmPanel data={dashboardData} />}

            {showMarkets && <MarketsPanel data={dashboardData} spaceWeather={spaceWeather} />}

            {showIntel && (
              <IntelFeed
                data={intelData}
                onLocate={(lat, lng) => setFlyToLocation({ lat, lng, ts: Date.now() })}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT HUD ── */}
      <div className="desktop-panel absolute right-5 top-20 bottom-24 w-80 flex flex-col gap-3 z-[200] pointer-events-auto overflow-y-auto overflow-x-hidden styled-scrollbar pr-1 min-h-0">
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <SearchBar onLocate={(lat, lng) => setFlyToLocation({ lat, lng, ts: Date.now() })} />
          </div>

          <div className="relative">
            <SharePanel mapView={mapView} activeLayers={activeLayers} mouseCoords={null} />
          </div>
        </div>

        <OsintPanel
          onSweepVisualize={setSweepData}
          onScanGeolocate={(target, data) => {
            setScanTargets((prev) => {
              const existing = prev.filter((t) => t.id !== target);
              return [{ id: target, timestamp: Date.now(), ...data }, ...existing].slice(0, 10);
            });

            setFlyToLocation({ lat: data.lat, lng: data.lng, ts: Date.now() });
          }}
        />

        <LiveAlerts
          data={dashboardData}
          onLocate={(lat, lng) => setFlyToLocation({ lat, lng, ts: Date.now() })}
          onWatchFeed={(url, name) => {
            setLiveFeedUrl(url);
            setLiveFeedName(name);
          }}
        />
      </div>

      {/* ── LIVE FEED VIEWER OVERLAY ── */}
      <AnimatePresence>
        {liveFeedUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setLiveFeedUrl(null)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="w-[90vw] max-w-[900px] flex flex-col relative rounded-xl overflow-hidden border border-[var(--border-primary)] shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF4081] animate-osiris-pulse" />

                  <span className="text-[12px] font-mono font-bold text-white tracking-wider">
                    {liveFeedName}
                  </span>

                  <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[9px] font-bold">
                    LIVE STREAM
                  </span>

                  {!liveFeedEmbedAllowed && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[9px]">
                      EXTERNAL ONLY
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={getYouTubeWatchUrl(liveFeedUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--border-primary)] hover:bg-[var(--gold-primary)] hover:text-black text-white transition-colors text-[11px] font-mono"
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setLiveFeedUrl(null)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {liveFeedEmbedAllowed ? (
                <div className="w-full aspect-video relative bg-black">
                  <iframe
                    src={liveFeedUrl}
                    className="w-full h-full absolute inset-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-black/95">
                  <div className="text-center px-8">
                    <div className="w-14 h-14 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="w-6 h-6 text-[#39FF14]" />
                    </div>

                    <p className="text-[13px] font-mono font-bold text-white tracking-widest mb-2">
                      EMBED RESTRICTED
                    </p>

                    <p className="text-[11px] font-mono text-white/50 mb-6 max-w-xs">
                      {liveFeedName} does not allow third-party embedding. Click below to open the
                      live stream directly.
                    </p>

                    <a
                      href={getYouTubeWatchUrl(liveFeedUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded border border-[#39FF14]/40 text-[#39FF14] font-mono text-[12px] hover:bg-[#39FF14]/10 transition-colors tracking-wider"
                    >
                      <ExternalLink className="w-4 h-4" />
                      OPEN LIVE STREAM
                    </a>
                  </div>
                </div>
              )}

              {liveFeedEmbedAllowed && (
                <div className="bg-[#111]/90 px-4 py-2.5 border-t border-[var(--border-primary)] flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[var(--gold-primary)] shrink-0" />

                  <span className="text-[11px] font-mono text-white/70 leading-relaxed">
                    If you see &ldquo;Video unavailable&rdquo;, use{' '}
                    <strong className="text-[var(--gold-primary)]">Open in YouTube</strong> above.
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MOBILE UI ═══ */}
      {isMobile && (
        <>
          <div className="mobile-nav">
            <div className="glass-panel mobile-nav-inner">
              {[
                { id: 'layers' as const, icon: Layers, label: 'LAYERS' },
                { id: 'markets' as const, icon: BarChart3, label: 'MARKETS' },
                { id: 'intel' as const, icon: Newspaper, label: 'INTEL' },
                { id: 'recon' as const, icon: Radar, label: 'RECON' },
                { id: 'search' as const, icon: Search, label: 'SEARCH' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMobilePanel(mobilePanel === tab.id ? null : tab.id)}
                  className={`mobile-nav-btn ${mobilePanel === tab.id ? 'active' : ''}`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${
                      tab.id === 'recon' ? 'text-[var(--cyan-primary)]' : ''
                    }`}
                  />

                  <span className={tab.id === 'recon' ? 'text-[var(--cyan-primary)]' : ''}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {mobilePanel && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute bottom-[52px] left-0 right-0 z-[400] glass-panel rounded-b-none overflow-y-auto overflow-x-hidden styled-scrollbar"
                style={{
                  maxHeight: 'min(55vh, calc(100dvh - 100px))',
                  paddingBottom: 'env(safe-area-inset-bottom, 4px)',
                }}
              >
                <div className="mobile-drawer-handle" />

                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="hud-text text-[9px] text-[var(--text-primary)]">
                      {mobilePanel === 'layers'
                        ? 'LAYERS & STATS'
                        : mobilePanel === 'markets'
                          ? 'MARKETS & INTEL'
                          : mobilePanel === 'intel'
                            ? 'INTEL FEED'
                            : mobilePanel === 'recon'
                              ? 'OSIRIS RECON'
                              : 'SEARCH'}
                    </span>

                    <button
                      onClick={() => setMobilePanel(null)}
                      className="text-[var(--text-muted)] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {mobilePanel === 'layers' && (
                    <>
                      <div className="glass-panel-sm p-2 mb-2">
                        <div className="grid grid-cols-5 gap-1 text-center">
                          <div>
                            <div className="hud-label" style={{ fontSize: '6px' }}>
                              AIR
                            </div>

                            <div className="hud-value text-[9px]">
                              {totalFlights.toLocaleString()}
                            </div>
                          </div>

                          <div>
                            <div className="hud-label" style={{ fontSize: '6px' }}>
                              SAT
                            </div>

                            <div className="hud-value text-[9px]">
                              {dashboardData.satellites?.length || 0}
                            </div>
                          </div>

                          <div>
                            <div className="hud-label" style={{ fontSize: '6px' }}>
                              CAM
                            </div>

                            <div className="hud-value text-[9px]">
                              {dashboardData.cameras?.length || 0}
                            </div>
                          </div>

                          <div>
                            <div className="hud-label" style={{ fontSize: '6px' }}>
                              WX
                            </div>

                            <div
                              className="hud-value text-[9px]"
                              style={{ color: 'var(--accent-weather)' }}
                            >
                              {dashboardData.weather_events?.length || 0}
                            </div>
                          </div>

                          <div>
                            <div className="hud-label" style={{ fontSize: '6px' }}>
                              NUC
                            </div>

                            <div
                              className="hud-value text-[9px]"
                              style={{ color: 'var(--accent-nuclear)' }}
                            >
                              {dashboardData.infrastructure?.length || 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      <LayerPanel
                        data={dashboardData}
                        activeLayers={activeLayers}
                        setActiveLayers={setActiveLayers}
                      />

                      <div className="mt-2">
                        <ViewPresets
                          onNavigate={(lat, lng, zoom) => {
                            setFlyToLocation({ lat, lng, ts: Date.now() });
                            setMapView((v) => ({ ...v, zoom }));
                            setMobilePanel(null);
                          }}
                        />
                      </div>
                    </>
                  )}

                  {mobilePanel === 'markets' && (
                    <MarketsPanel data={dashboardData} spaceWeather={spaceWeather} />
                  )}

                  {mobilePanel === 'intel' && (
                    <IntelFeed
                      data={intelData}
                      onLocate={(lat, lng) => {
                        setFlyToLocation({ lat, lng, ts: Date.now() });
                        setMobilePanel(null);
                      }}
                    />
                  )}

                  {mobilePanel === 'search' && (
                    <div className="space-y-2">
                      <SearchBar
                        onLocate={(lat, lng) => {
                          setFlyToLocation({ lat, lng, ts: Date.now() });
                          setMobilePanel(null);
                        }}
                      />

                      <SharePanel
                        mapView={mapView}
                        activeLayers={activeLayers}
                        mouseCoords={null}
                      />
                    </div>
                  )}

                  {mobilePanel === 'recon' && (
                    <div className="space-y-2">
                      <OsintPanel
                        isOpen={true}
                        onClose={() => setMobilePanel(null)}
                        isMobile={true}
                        onSweepVisualize={setSweepData}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── BOTTOM CENTER ── */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="desktop-only absolute bottom-5 left-1/2 -translate-x-1/2 z-[200] pointer-events-auto"
        >
          <div
            className="glass-panel px-5 py-2.5 flex items-center gap-0 osiris-glow relative overflow-hidden"
            style={{
              borderImage:
                'linear-gradient(90deg, rgba(212,175,55,0.05), rgba(212,175,55,0.2), rgba(212,175,55,0.05)) 1',
              borderImageSlice: 1,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div
                className="absolute top-0 bottom-0 w-[60px] bg-gradient-to-r from-transparent via-[var(--gold-primary)]/[0.07] to-transparent"
                style={{ animation: 'hud-scanline 4s ease-in-out infinite' }}
              />
            </div>

            <div className="flex flex-col items-center min-w-[110px] px-3">
              <div className="hud-label">COORDINATES</div>

              <div
                ref={coordsDisplayRef}
                className="text-[10px] font-mono font-bold text-[var(--gold-primary)] tracking-wide tabular-nums"
              >
                —
              </div>
            </div>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent shrink-0" />

            <div className="flex flex-col items-center min-w-[160px] max-w-[280px] px-3">
              <div className="hud-label">LOCATION</div>

              <div className="text-[9px] text-[var(--text-secondary)] font-mono truncate max-w-[280px]">
                {locationLabel || 'Hover over map...'}
              </div>
            </div>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent shrink-0" />

            <div className="flex flex-col items-center px-3">
              <div className="hud-label">ZOOM</div>

              <div className="text-[10px] font-mono font-bold text-[var(--gold-primary)] tabular-nums">
                {mapView.zoom.toFixed(1)}
              </div>
            </div>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent shrink-0" />

            <div className="flex flex-col items-center px-3 min-w-[60px]">
              <div className="hud-label">ACTIVE LAYERS</div>

              <div className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[var(--gold-primary)]" />

                <span className="text-[10px] font-mono font-bold text-[var(--gold-primary)] tabular-nums">
                  {Object.values(activeLayers).filter(Boolean).length}
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent shrink-0" />

            <div className="flex flex-col items-center px-3 min-w-[60px]">
              <div className="hud-label">FEEDS</div>

              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[var(--cyan-primary)]" />

                <span className="text-[10px] font-mono font-bold text-[var(--cyan-primary)] tabular-nums">
                  {Object.values(activeLayers).filter(Boolean).length}
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent shrink-0" />

            <div className="flex flex-col items-center px-3 min-w-[70px]">
              <div className="hud-label">ENTITIES</div>

              <div className="flex items-center gap-1">
                <Database className="w-3 h-3 text-[var(--alert-green)]" />
                <ActiveEntityCount data={dashboardData} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="desktop-only absolute bottom-[4.5rem] left-[20rem] z-[201] pointer-events-none">
        <ScaleBar zoom={mapView.zoom} latitude={mapView.latitude} />
      </div>

      {/* ── Region Dossier ── */}
      {(regionDossier || dossierLoading) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-16 md:top-20 left-2 right-2 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[300] md:w-[480px] max-h-[65vh] overflow-y-auto styled-scrollbar"
        >
          <div className="glass-panel p-5 osiris-glow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono font-bold text-[var(--gold-primary)] tracking-wider">
                REGION DOSSIER
              </h2>

              <button
                onClick={() => {
                  setRegionDossier(null);
                  setDossierLoading(false);
                }}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs"
              >
                ✕
              </button>
            </div>

            {dossierLoading ? (
              <div className="text-center py-8">
                <div className="w-5 h-5 border-2 border-[var(--gold-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />

                <span className="text-[8px] font-mono text-[var(--text-muted)] tracking-widest">
                  COMPILING INTEL...
                </span>
              </div>
            ) : (
              regionDossier && (
                <div className="space-y-3">
                  <div>
                    <div className="hud-label mb-0.5">LOCATION</div>

                    <div className="text-xs text-[var(--text-primary)]">
                      {regionDossier.location?.display_name}
                    </div>
                  </div>

                  {regionDossier.country && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="hud-label mb-0.5">COUNTRY</div>

                        <div className="text-xs text-[var(--text-primary)]">
                          {regionDossier.country.flag} {regionDossier.country.name}
                        </div>
                      </div>

                      <div>
                        <div className="hud-label mb-0.5">CAPITAL</div>

                        <div className="text-xs text-[var(--text-primary)]">
                          {regionDossier.country.capital}
                        </div>
                      </div>

                      <div>
                        <div className="hud-label mb-0.5">POPULATION</div>

                        <div className="text-xs text-[var(--text-primary)]">
                          {regionDossier.country.population?.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="hud-label mb-0.5">REGION</div>

                        <div className="text-xs text-[var(--text-primary)]">
                          {regionDossier.country.subregion || regionDossier.country.region}
                        </div>
                      </div>

                      <div>
                        <div className="hud-label mb-0.5">LANGUAGES</div>

                        <div className="text-xs text-[var(--text-primary)]">
                          {regionDossier.country.languages?.join(', ')}
                        </div>
                      </div>

                      <div>
                        <div className="hud-label mb-0.5">AREA</div>

                        <div className="text-xs text-[var(--text-primary)]">
                          {regionDossier.country.area?.toLocaleString()} km²
                        </div>
                      </div>
                    </div>
                  )}

                  {regionDossier.head_of_state && (
                    <div>
                      <div className="hud-label mb-0.5">HEAD OF STATE</div>

                      <div className="text-xs text-[var(--gold-primary)]">
                        {regionDossier.head_of_state.name}
                      </div>

                      <div className="text-[8px] text-[var(--text-muted)]">
                        {regionDossier.head_of_state.position}
                      </div>
                    </div>
                  )}

                  {regionDossier.wikipedia && (
                    <div>
                      <div className="hud-label mb-1">INTELLIGENCE BRIEF</div>

                      <div className="flex gap-3">
                        {regionDossier.wikipedia.thumbnail && (
                          <img
                            src={regionDossier.wikipedia.thumbnail}
                            alt=""
                            className="w-14 h-14 rounded object-cover shrink-0"
                          />
                        )}

                        <p className="text-[8px] text-[var(--text-secondary)] leading-relaxed">
                          {regionDossier.wikipedia.extract}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </motion.div>
      )}

      <CameraViewer
        camera={activeCamera}
        onClose={() => setActiveCamera(null)}
        onLocate={(lat, lng) => setFlyToLocation({ lat, lng, ts: Date.now() })}
      />

      {/* ── OVERLAYS ── */}
      <div className="vignette absolute inset-0 pointer-events-none z-[2]" />
      <div className="crt-scanlines absolute inset-0 pointer-events-none z-[3] opacity-[0.02]" />

      {[
        {
          pos: 'top-0 left-0',
          vAnchor: 'top-0',
          hAnchor: 'left-0',
          hGrad: 'bg-gradient-to-r',
          vGrad: 'bg-gradient-to-b',
        },
        {
          pos: 'top-0 right-0',
          vAnchor: 'top-0',
          hAnchor: 'right-0',
          hGrad: 'bg-gradient-to-l',
          vGrad: 'bg-gradient-to-b',
        },
        {
          pos: 'bottom-0 left-0',
          vAnchor: 'bottom-0',
          hAnchor: 'left-0',
          hGrad: 'bg-gradient-to-r',
          vGrad: 'bg-gradient-to-t',
        },
        {
          pos: 'bottom-0 right-0',
          vAnchor: 'bottom-0',
          hAnchor: 'right-0',
          hGrad: 'bg-gradient-to-l',
          vGrad: 'bg-gradient-to-t',
        },
      ].map((c, i) => (
        <div key={i} className={`absolute ${c.pos} w-16 h-16 pointer-events-none z-[1]`}>
          <div
            className={`absolute ${c.vAnchor} ${c.hAnchor} w-full h-[1px] ${c.hGrad} from-[var(--gold-primary)]/30 to-transparent`}
          />

          <div
            className={`absolute ${c.vAnchor} ${c.hAnchor} w-[1px] h-full ${c.vGrad} from-[var(--gold-primary)]/30 to-transparent`}
          />
        </div>
      ))}

      <KeyboardShortcuts />

      <GlobalStatusBar />

      <div className="desktop-only absolute bottom-[26px] right-5 z-[200] pointer-events-none text-[6px] font-mono text-[var(--text-muted)]/40 tracking-widest">
        [?] SHORTCUTS · [F] FULLSCREEN · [S] SHARE · [R] RESET VIEW
      </div>
    </main>
  );
}