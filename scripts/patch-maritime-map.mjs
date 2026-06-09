import fs from 'node:fs';
import path from 'node:path';

const mapPath = path.join(process.cwd(), 'src/components/OsirisMap.tsx');

if (!fs.existsSync(mapPath)) {
  console.error(`[OSIRIS maritime patch] Missing file: ${mapPath}`);
  process.exit(1);
}

let source = fs.readFileSync(mapPath, 'utf8').replace(/\r\n/g, '\n');
let changed = false;

function applyReplacement(label, find, replace) {
  if (!source.includes(find)) {
    console.warn(`[OSIRIS maritime patch] Skipped ${label}; target block not found or already patched.`);
    return;
  }

  source = source.replace(find, replace);
  changed = true;
  console.log(`[OSIRIS maritime patch] Applied ${label}.`);
}

if (!source.includes('const createShipIcon = useCallback')) {
  applyReplacement(
    'ship canvas icon generator',
    `  const createDot = useCallback((map: maplibregl.Map, id: string, color: string, size: number) => {
    if (map.hasImage(id)) return;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    map.addImage(id, { width: size, height: size, data: new Uint8Array(ctx.getImageData(0, 0, size, size).data) });
  }, []);
`,
    `  const createDot = useCallback((map: maplibregl.Map, id: string, color: string, size: number) => {
    if (map.hasImage(id)) return;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    map.addImage(id, { width: size, height: size, data: new Uint8Array(ctx.getImageData(0, 0, size, size).data) });
  }, []);

  const createShipIcon = useCallback((map: maplibregl.Map, id: string, color: string, size: number) => {
    if (map.hasImage(id)) return;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const cx = size / 2;
    const cy = size / 2;

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.18;

    // Bow + hull — points north, MapLibre rotates it by AIS heading.
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.42);
    ctx.lineTo(cx - size * 0.28, cy - size * 0.06);
    ctx.lineTo(cx - size * 0.20, cy + size * 0.35);
    ctx.lineTo(cx, cy + size * 0.43);
    ctx.lineTo(cx + size * 0.20, cy + size * 0.35);
    ctx.lineTo(cx + size * 0.28, cy - size * 0.06);
    ctx.closePath();
    ctx.fill();

    // Bridge/cabin highlight.
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(cx - size * 0.09, cy - size * 0.05, size * 0.18, size * 0.20);

    // Wake line for direction readability.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = Math.max(1, size * 0.045);
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.45);
    ctx.lineTo(cx, cy + size * 0.26);
    ctx.stroke();

    ctx.restore();

    map.addImage(id, {
      width: size,
      height: size,
      data: new Uint8Array(ctx.getImageData(0, 0, size, size).data),
    });
  }, []);
`
  );
}

if (!source.includes("createShipIcon(map, 'ship-cargo'")) {
  applyReplacement(
    'ship icon registration',
    `      createDot(map, 'dot-cctv', '#39FF14', 10);
`,
    `      createDot(map, 'dot-cctv', '#39FF14', 10);
      createShipIcon(map, 'ship-cargo', '#00BCD4', 28);
      createShipIcon(map, 'ship-tanker', '#FF9500', 28);
      createShipIcon(map, 'ship-military', '#FF1744', 28);
      createShipIcon(map, 'ship-passenger', '#E040FB', 28);
      createShipIcon(map, 'ship-service', '#B3E5FC', 28);
      createShipIcon(map, 'ship-unknown', '#E8E6E0', 28);
`
  );
}

if (!source.includes("id: 'ship-icons'")) {
  applyReplacement(
    'rotated ship symbol layer',
    `      map.addLayer({
        id: 'ship-dots', type: 'circle', source: 'maritime-ships', paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 2, 5, 4, 10, 6],
          'circle-color': ['match', ['get', 'type'], 'military', '#FF1744', 'tanker', '#FF9500', 'cargo', '#00BCD4', '#fff'],
          'circle-opacity': 0.8,
        }
      });
      map.addLayer({
        id: 'ship-label', type: 'symbol', source: 'maritime-ships', minzoom: 5, layout: {
          'text-field': ['get', 'name'], 'text-size': 9, 'text-font': ['Open Sans Regular'],
          'text-offset': [0, 1.2], 'text-allow-overlap': false,
        }, paint: { 'text-color': ['match', ['get', 'type'], 'military', '#FF1744', 'tanker', '#FF9500', 'cargo', '#00BCD4', '#fff'], 'text-halo-color': '#000', 'text-halo-width': 1 }
      });
`,
    `      map.addLayer({
        id: 'ship-dots', type: 'circle', source: 'maritime-ships', paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 4, 5, 7, 10, 11],
          'circle-color': ['match', ['get', 'type'], 'military', '#FF1744', 'tanker', '#FF9500', 'cargo', '#00BCD4', 'passenger', '#E040FB', 'service', '#B3E5FC', 'fishing', '#B3E5FC', '#E8E6E0'],
          'circle-opacity': 0.16,
          'circle-blur': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': ['match', ['get', 'type'], 'military', '#FF1744', 'tanker', '#FF9500', 'cargo', '#00BCD4', 'passenger', '#E040FB', 'service', '#B3E5FC', 'fishing', '#B3E5FC', '#E8E6E0'],
          'circle-stroke-opacity': 0.35,
        }
      });
      map.addLayer({
        id: 'ship-icons', type: 'symbol', source: 'maritime-ships', layout: {
          'icon-image': ['match', ['get', 'type'], 'military', 'ship-military', 'tanker', 'ship-tanker', 'cargo', 'ship-cargo', 'passenger', 'ship-passenger', 'service', 'ship-service', 'fishing', 'ship-service', 'ship-unknown'],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.42, 5, 0.68, 10, 1.0, 14, 1.25],
          'icon-rotate': ['coalesce', ['get', 'heading'], ['get', 'course'], 0],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        }, paint: { 'icon-opacity': 0.95 }
      });
      map.addLayer({
        id: 'ship-label', type: 'symbol', source: 'maritime-ships', minzoom: 6, layout: {
          'text-field': ['get', 'name'], 'text-size': 9, 'text-font': ['Open Sans Regular'],
          'text-offset': [0, 1.5], 'text-allow-overlap': false,
        }, paint: { 'text-color': ['match', ['get', 'type'], 'military', '#FF1744', 'tanker', '#FF9500', 'cargo', '#00BCD4', 'passenger', '#E040FB', 'service', '#B3E5FC', 'fishing', '#B3E5FC', '#E8E6E0'], 'text-halo-color': '#000', 'text-halo-width': 1 }
      });
`
  );
}

if (!source.includes('AIS VESSEL TRACK')) {
  applyReplacement(
    'ship click popup',
    `    // ── Live News (opens feed viewer) ──
`,
    `    // ── Maritime Ships — clickable AIS vessel popup ──
    ['ship-icons', 'ship-dots'].forEach(layer => {
      map.on('click', layer, e => {
        if (!e.features?.length) return;

        const p = e.features[0].properties as any;
        const coords = (e.features[0].geometry as any).coordinates;
        const typeColor = p.type === 'military' ? '#FF1744' : p.type === 'tanker' ? '#FF9500' : p.type === 'passenger' ? '#E040FB' : p.type === 'service' || p.type === 'fishing' ? '#B3E5FC' : '#00BCD4';
        const speed = Number.isFinite(Number(p.speed)) ? `${Number(p.speed).toFixed(1)} kt` : '—';
        const heading = Number.isFinite(Number(p.heading)) ? `${Math.round(Number(p.heading))}°` : Number.isFinite(Number(p.course)) ? `${Math.round(Number(p.course))}°` : '—';
        const ageSeconds = Number(p.ageSeconds);
        const ageLabel = Number.isFinite(ageSeconds) ? ageSeconds < 60 ? `${ageSeconds}s ago` : `${Math.round(ageSeconds / 60)}m ago` : '—';
        const zoneDistance = Number.isFinite(Number(p.nearestZoneDistanceKm)) ? `${Number(p.nearestZoneDistanceKm).toFixed(1)} km` : '—';
        const statusLabel = String(p.status || '').replaceAll('-', ' ').toUpperCase() || ((Number(p.speed) || 0) < 0.5 ? 'ANCHORED / STATIONARY' : 'UNDERWAY');
        const displayName = p.name || (p.mmsi ? `MMSI-${p.mmsi}` : 'Unknown Vessel');

        popup(coords, `<div style="${pStyle}border:1px solid ${typeColor}55;min-width:280px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
            <div>
              <div style="color:${typeColor};font-size:13px;font-weight:800;letter-spacing:0.08em;line-height:1.2;">🚢 ${displayName}</div>
              <div style="color:#5C5A54;font-size:9px;margin-top:2px;letter-spacing:0.12em;">AIS VESSEL TRACK</div>
            </div>
            <div style="color:${typeColor};border:1px solid ${typeColor}66;background:${typeColor}18;border-radius:999px;padding:3px 7px;font-size:8px;font-weight:800;letter-spacing:0.1em;">${String(p.type || 'unknown').toUpperCase()}</div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;font-size:10px;margin-bottom:10px;">
            <div><span style="color:#5C5A54;font-size:8px;">MMSI</span><br/><span style="color:#E8E6E0;font-weight:700;">${p.mmsi || '—'}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">STATUS</span><br/><span style="color:${typeColor};font-weight:700;">${statusLabel}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">SPEED</span><br/><span style="color:#E8E6E0;font-weight:700;">${speed}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">HEADING</span><br/><span style="color:#E8E6E0;font-weight:700;">${heading}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">DESTINATION</span><br/><span style="color:#E8E6E0;font-weight:700;">${p.destination || '—'}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">LAST AIS</span><br/><span style="color:#00E5FF;font-weight:700;">${ageLabel}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">WATCH ZONE</span><br/><span style="color:#D4AF37;font-weight:700;">${p.nearestZoneName || '—'}</span></div>
            <div><span style="color:#5C5A54;font-size:8px;">ZONE DISTANCE</span><br/><span style="color:#E8E6E0;font-weight:700;">${zoneDistance}</span></div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <a href="https://www.vesselfinder.com/vessels?name=${p.mmsi || ''}" target="_blank" rel="noopener noreferrer" style="${linkStyle}color:${typeColor};border:1px solid ${typeColor}66;background:${typeColor}18;">VESSELFINDER</a>
            <a href="https://www.google.com/maps/@${coords[1]},${coords[0]},12z" target="_blank" rel="noopener noreferrer" style="${linkStyle}color:#448AFF;border:1px solid rgba(68,138,255,0.4);background:rgba(68,138,255,0.1);">MAP</a>
          </div>
        </div>`);
      });

      map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
    });

    // ── Live News (opens feed viewer) ──
`
  );
}

if (!source.includes('nearestZoneDistanceKm')) {
  applyReplacement(
    'ship feature properties',
    `    setGeo('maritime-ships', activeLayers.maritime && data.maritime_ships ? data.maritime_ships.map((s: any) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [s.lng, s.lat] }, properties: { name: s.name || s.mmsi?.toString(), type: s.type || 'cargo', speed: s.speed, heading: s.heading, destination: s.destination, flag: s.flag } })) : []);
`,
    `    setGeo('maritime-ships', activeLayers.maritime && data.maritime_ships ? data.maritime_ships.map((s: any) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [s.lng, s.lat] }, properties: { id: s.id, mmsi: s.mmsi, name: s.name || s.mmsi?.toString(), type: s.type || 'cargo', speed: s.speed, heading: s.heading, course: s.course, destination: s.destination, flag: s.flag, status: s.status, source: s.source, ageSeconds: s.ageSeconds, nearestZoneName: s.nearestZoneName, nearestZoneDistanceKm: s.nearestZoneDistanceKm } })) : []);
`
  );
}

applyReplacement(
  'ship visibility list',
  `    setVis(['ship-dots', 'ship-label'], activeLayers.maritime);
`,
  `    setVis(['ship-dots', 'ship-icons', 'ship-label'], activeLayers.maritime);
`
);

if (changed) {
  fs.writeFileSync(mapPath, source, 'utf8');
  console.log('[OSIRIS maritime patch] Complete.');
} else {
  console.log('[OSIRIS maritime patch] No changes needed.');
}
