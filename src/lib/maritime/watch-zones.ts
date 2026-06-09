export type MaritimeWatchZoneTier = 1 | 2;

export type MaritimeWatchZoneType = 'port' | 'chokepoint';

export type MaritimeWatchZone = {
  id: string;
  name: string;
  country: string;
  tier: MaritimeWatchZoneTier;
  watchType: MaritimeWatchZoneType;
  mapType: 'container' | 'energy' | 'naval' | 'chokepoint';
  lat: number;
  lng: number;
  radiusKm: number;
  traffic?: string;
  volume?: string;
  rank?: number;
  risk?: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  tags: string[];
};

export type BoundingBox = [[number, number], [number, number]];

export const MARITIME_WATCH_ZONES: MaritimeWatchZone[] = [
  // ============================================================
  // Tier 1: Mega ports, chokepoints, energy ports, major U.S. ports
  // ============================================================
  { id: 'shanghai', name: 'Port of Shanghai', country: 'China', tier: 1, watchType: 'port', mapType: 'container', lat: 31.2304, lng: 121.4737, radiusKm: 45, volume: 'Mega container hub', rank: 1, tags: ['mega-port', 'global-port', 'container', 'asia'] },
  { id: 'singapore', name: 'Port of Singapore', country: 'Singapore', tier: 1, watchType: 'port', mapType: 'energy', lat: 1.2644, lng: 103.8222, radiusKm: 45, volume: 'Mega transshipment + bunkering hub', rank: 2, tags: ['mega-port', 'global-port', 'container', 'transshipment', 'energy', 'asia'] },
  { id: 'ningbo-zhoushan', name: 'Ningbo-Zhoushan Port', country: 'China', tier: 1, watchType: 'port', mapType: 'energy', lat: 29.8683, lng: 121.544, radiusKm: 45, volume: 'Container, bulk, crude, and energy hub', rank: 3, tags: ['mega-port', 'global-port', 'container', 'bulk', 'energy', 'asia'] },
  { id: 'shenzhen', name: 'Port of Shenzhen', country: 'China', tier: 1, watchType: 'port', mapType: 'container', lat: 22.5431, lng: 114.0579, radiusKm: 40, volume: 'Mega container hub', rank: 4, tags: ['mega-port', 'global-port', 'container', 'asia'] },
  { id: 'guangzhou', name: 'Port of Guangzhou', country: 'China', tier: 1, watchType: 'port', mapType: 'container', lat: 23.1291, lng: 113.2644, radiusKm: 45, volume: 'Container and Pearl River Delta hub', rank: 5, tags: ['mega-port', 'global-port', 'container', 'bulk', 'asia'] },
  { id: 'qingdao', name: 'Port of Qingdao', country: 'China', tier: 1, watchType: 'port', mapType: 'container', lat: 36.0671, lng: 120.3826, radiusKm: 40, volume: 'Container, bulk, and energy hub', rank: 6, tags: ['mega-port', 'global-port', 'container', 'bulk', 'asia'] },
  { id: 'busan', name: 'Port of Busan', country: 'South Korea', tier: 1, watchType: 'port', mapType: 'container', lat: 35.1796, lng: 129.0756, radiusKm: 40, volume: 'Northeast Asia transshipment hub', rank: 7, tags: ['mega-port', 'global-port', 'container', 'transshipment', 'asia'] },
  { id: 'rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', tier: 1, watchType: 'port', mapType: 'energy', lat: 51.9244, lng: 4.4777, radiusKm: 45, volume: 'Europe container and energy gateway', rank: 8, tags: ['mega-port', 'global-port', 'container', 'energy', 'europe'] },
  { id: 'antwerp-bruges', name: 'Port of Antwerp-Bruges', country: 'Belgium', tier: 1, watchType: 'port', mapType: 'energy', lat: 51.2194, lng: 4.4025, radiusKm: 45, volume: 'European container and petrochemical hub', rank: 9, tags: ['mega-port', 'global-port', 'container', 'energy', 'europe'] },
  { id: 'jebel-ali', name: 'Jebel Ali Port', country: 'United Arab Emirates', tier: 1, watchType: 'port', mapType: 'energy', lat: 25.0118, lng: 55.061, radiusKm: 40, volume: 'Middle East container and transshipment hub', rank: 10, tags: ['mega-port', 'global-port', 'container', 'transshipment', 'energy', 'middle-east'] },
  { id: 'tanger-med', name: 'Tanger Med', country: 'Morocco', tier: 1, watchType: 'port', mapType: 'container', lat: 35.8894, lng: -5.5, radiusKm: 35, volume: 'Mediterranean transshipment hub', rank: 11, tags: ['mega-port', 'global-port', 'container', 'transshipment', 'africa', 'mediterranean'] },
  { id: 'los-angeles-long-beach', name: 'Los Angeles / Long Beach Port Complex', country: 'United States', tier: 1, watchType: 'port', mapType: 'container', lat: 33.7405, lng: -118.2775, radiusKm: 45, volume: 'Largest U.S. container gateway', rank: 12, tags: ['mega-port', 'global-port', 'container', 'us-port', 'north-america'] },
  { id: 'new-york-new-jersey', name: 'Port of New York and New Jersey', country: 'United States', tier: 1, watchType: 'port', mapType: 'container', lat: 40.6681, lng: -74.0451, radiusKm: 45, volume: 'Major U.S. East Coast container gateway', rank: 13, tags: ['mega-port', 'global-port', 'container', 'us-port', 'north-america'] },
  { id: 'houston', name: 'Port Houston', country: 'United States', tier: 1, watchType: 'port', mapType: 'energy', lat: 29.7604, lng: -95.3698, radiusKm: 45, volume: 'Energy, petrochemical, and container hub', tags: ['major-us-port', 'us-port', 'energy', 'container', 'north-america'] },
  { id: 'corpus-christi', name: 'Port of Corpus Christi', country: 'United States', tier: 1, watchType: 'port', mapType: 'energy', lat: 27.8006, lng: -97.3964, radiusKm: 45, volume: 'U.S. crude oil and LNG export hub', tags: ['major-us-port', 'us-port', 'energy', 'crude-oil', 'lng', 'north-america'] },
  { id: 'fujairah', name: 'Port of Fujairah', country: 'United Arab Emirates', tier: 1, watchType: 'port', mapType: 'energy', lat: 25.1288, lng: 56.3265, radiusKm: 40, volume: 'Oil storage and bunkering hub', tags: ['major-energy-port', 'energy', 'bunkering', 'oil', 'middle-east'] },
  { id: 'ras-tanura', name: 'Ras Tanura Terminal', country: 'Saudi Arabia', tier: 1, watchType: 'port', mapType: 'energy', lat: 26.6436, lng: 50.1592, radiusKm: 45, volume: 'Major crude oil export terminal', tags: ['major-energy-port', 'energy', 'crude-oil', 'middle-east'] },
  { id: 'strait-of-hormuz', name: 'Strait of Hormuz', country: 'Iran / Oman / UAE', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 26.5667, lng: 56.25, radiusKm: 80, traffic: 'Critical oil and LNG corridor', risk: 'HIGH', tags: ['chokepoint', 'energy', 'oil', 'lng', 'middle-east', 'high-risk'] },
  { id: 'strait-of-malacca', name: 'Strait of Malacca', country: 'Malaysia / Indonesia / Singapore', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 2.5, lng: 101.0, radiusKm: 220, traffic: 'High-volume Asia-Europe container and energy corridor', risk: 'MODERATE', tags: ['chokepoint', 'container', 'energy', 'asia', 'high-traffic'] },
  { id: 'suez-canal', name: 'Suez Canal', country: 'Egypt', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 30.5852, lng: 32.2654, radiusKm: 120, traffic: 'Europe-Asia canal corridor', risk: 'ELEVATED', tags: ['chokepoint', 'container', 'energy', 'middle-east', 'africa', 'high-risk'] },
  { id: 'bab-el-mandeb', name: 'Bab el-Mandeb', country: 'Yemen / Djibouti / Eritrea', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 12.5833, lng: 43.3333, radiusKm: 90, traffic: 'Red Sea energy and container corridor', risk: 'CRITICAL', tags: ['chokepoint', 'energy', 'red-sea', 'middle-east', 'africa', 'high-risk'] },
  { id: 'panama-canal', name: 'Panama Canal', country: 'Panama', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 9.08, lng: -79.68, radiusKm: 90, traffic: 'Atlantic-Pacific canal corridor', risk: 'LOW', tags: ['chokepoint', 'container', 'americas', 'canal'] },
  { id: 'turkish-straits', name: 'Turkish Straits', country: 'Turkey', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 41.1, lng: 29.05, radiusKm: 120, traffic: 'Black Sea grain and energy corridor', risk: 'MODERATE', tags: ['chokepoint', 'black-sea', 'energy', 'grain', 'europe', 'middle-east'] },
  { id: 'gibraltar', name: 'Strait of Gibraltar', country: 'Spain / Morocco / United Kingdom', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 35.9606, lng: -5.5613, radiusKm: 90, traffic: 'Mediterranean-Atlantic gateway', risk: 'LOW', tags: ['chokepoint', 'container', 'energy', 'mediterranean', 'atlantic'] },

  // ============================================================
  // Tier 2: Regional logistics hubs
  // ============================================================
  { id: 'hamburg', name: 'Port of Hamburg', country: 'Germany', tier: 2, watchType: 'port', mapType: 'container', lat: 53.5511, lng: 9.9937, radiusKm: 35, volume: 'Regional container hub', tags: ['regional-logistics-hub', 'container', 'europe'] },
  { id: 'bremerhaven', name: 'Port of Bremerhaven', country: 'Germany', tier: 2, watchType: 'port', mapType: 'container', lat: 53.5396, lng: 8.5809, radiusKm: 35, volume: 'Container and automotive hub', tags: ['regional-logistics-hub', 'container', 'automotive', 'europe'] },
  { id: 'felixstowe', name: 'Port of Felixstowe', country: 'United Kingdom', tier: 2, watchType: 'port', mapType: 'container', lat: 51.9542, lng: 1.3511, radiusKm: 30, volume: 'UK container gateway', tags: ['regional-logistics-hub', 'container', 'europe'] },
  { id: 'le-havre', name: 'Port of Le Havre', country: 'France', tier: 2, watchType: 'port', mapType: 'energy', lat: 49.4944, lng: 0.1079, radiusKm: 35, volume: 'Container and energy hub', tags: ['regional-logistics-hub', 'container', 'energy', 'europe'] },
  { id: 'valencia', name: 'Port of Valencia', country: 'Spain', tier: 2, watchType: 'port', mapType: 'container', lat: 39.4486, lng: -0.3167, radiusKm: 35, volume: 'Mediterranean container hub', tags: ['regional-logistics-hub', 'container', 'mediterranean', 'europe'] },
  { id: 'piraeus', name: 'Port of Piraeus', country: 'Greece', tier: 2, watchType: 'port', mapType: 'container', lat: 37.942, lng: 23.6469, radiusKm: 35, volume: 'Eastern Mediterranean container hub', tags: ['regional-logistics-hub', 'container', 'mediterranean', 'europe'] },
  { id: 'colombo', name: 'Port of Colombo', country: 'Sri Lanka', tier: 2, watchType: 'port', mapType: 'container', lat: 6.9271, lng: 79.8612, radiusKm: 35, volume: 'Indian Ocean transshipment hub', tags: ['regional-logistics-hub', 'container', 'transshipment', 'indian-ocean', 'asia'] },
  { id: 'mumbai-nhava-sheva', name: 'Mumbai / Nhava Sheva', country: 'India', tier: 2, watchType: 'port', mapType: 'container', lat: 18.949, lng: 72.9512, radiusKm: 45, volume: 'Western India container hub', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'mundra', name: 'Port of Mundra', country: 'India', tier: 2, watchType: 'port', mapType: 'energy', lat: 22.8395, lng: 69.7213, radiusKm: 40, volume: 'Container and energy hub', tags: ['regional-logistics-hub', 'container', 'energy', 'asia'] },
  { id: 'kaohsiung', name: 'Port of Kaohsiung', country: 'Taiwan', tier: 2, watchType: 'port', mapType: 'container', lat: 22.6273, lng: 120.3014, radiusKm: 35, volume: 'Taiwan container hub', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'hong-kong', name: 'Port of Hong Kong', country: 'Hong Kong', tier: 2, watchType: 'port', mapType: 'container', lat: 22.3193, lng: 114.1694, radiusKm: 35, volume: 'Regional container hub', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'tokyo-yokohama', name: 'Tokyo / Yokohama Port Complex', country: 'Japan', tier: 2, watchType: 'port', mapType: 'container', lat: 35.4437, lng: 139.638, radiusKm: 45, volume: 'Japan container and industrial hub', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'laem-chabang', name: 'Laem Chabang Port', country: 'Thailand', tier: 2, watchType: 'port', mapType: 'container', lat: 13.0827, lng: 100.8832, radiusKm: 35, volume: 'Thailand container gateway', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'tanjung-pelepas', name: 'Port of Tanjung Pelepas', country: 'Malaysia', tier: 2, watchType: 'port', mapType: 'container', lat: 1.36, lng: 103.55, radiusKm: 35, volume: 'Malaysia transshipment hub', tags: ['regional-logistics-hub', 'container', 'transshipment', 'asia'] },
  { id: 'jakarta-tanjung-priok', name: 'Tanjung Priok / Jakarta', country: 'Indonesia', tier: 2, watchType: 'port', mapType: 'container', lat: -6.1045, lng: 106.8804, radiusKm: 35, volume: 'Indonesia container gateway', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'manila', name: 'Port of Manila', country: 'Philippines', tier: 2, watchType: 'port', mapType: 'container', lat: 14.5833, lng: 120.9667, radiusKm: 35, volume: 'Philippines container gateway', tags: ['regional-logistics-hub', 'container', 'asia'] },
  { id: 'vancouver', name: 'Port of Vancouver', country: 'Canada', tier: 2, watchType: 'port', mapType: 'energy', lat: 49.2827, lng: -123.1207, radiusKm: 40, volume: 'Container, bulk, and energy hub', tags: ['regional-logistics-hub', 'container', 'bulk', 'energy', 'north-america'] },
  { id: 'seattle-tacoma', name: 'Seattle / Tacoma Northwest Seaport Alliance', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 47.6062, lng: -122.3321, radiusKm: 45, volume: 'U.S. Pacific Northwest container hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'container', 'north-america'] },
  { id: 'oakland', name: 'Port of Oakland', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 37.7955, lng: -122.2794, radiusKm: 35, volume: 'Northern California container hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'container', 'north-america'] },
  { id: 'savannah', name: 'Port of Savannah', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 32.0809, lng: -81.0912, radiusKm: 35, volume: 'U.S. Southeast container hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'container', 'north-america'] },
  { id: 'charleston', name: 'Port of Charleston', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 32.7765, lng: -79.9311, radiusKm: 35, volume: 'U.S. Southeast container hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'container', 'north-america'] },
  { id: 'norfolk-hampton-roads', name: 'Port of Virginia / Hampton Roads', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 36.8508, lng: -76.2859, radiusKm: 45, volume: 'U.S. East Coast container and military logistics hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'container', 'military', 'north-america'] },
  { id: 'new-orleans', name: 'Port of New Orleans', country: 'United States', tier: 2, watchType: 'port', mapType: 'energy', lat: 29.9511, lng: -90.0715, radiusKm: 45, volume: 'River, grain, and energy logistics hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'grain', 'energy', 'river', 'north-america'] },
  { id: 'mobile', name: 'Port of Mobile', country: 'United States', tier: 2, watchType: 'port', mapType: 'energy', lat: 30.6954, lng: -88.0399, radiusKm: 35, volume: 'Gulf Coast container and energy hub', tags: ['major-us-port', 'us-port', 'regional-logistics-hub', 'energy', 'container', 'north-america'] },
  { id: 'santos', name: 'Port of Santos', country: 'Brazil', tier: 2, watchType: 'port', mapType: 'container', lat: -23.9608, lng: -46.3336, radiusKm: 40, volume: 'South America container, bulk, and agriculture hub', tags: ['regional-logistics-hub', 'container', 'bulk', 'agriculture', 'south-america'] },
  { id: 'manzanillo-mexico', name: 'Port of Manzanillo', country: 'Mexico', tier: 2, watchType: 'port', mapType: 'container', lat: 19.05, lng: -104.3333, radiusKm: 35, volume: 'Mexico Pacific container hub', tags: ['regional-logistics-hub', 'container', 'north-america', 'latin-america'] },
  { id: 'colon-panama', name: 'Colón / Manzanillo International Terminal', country: 'Panama', tier: 2, watchType: 'port', mapType: 'container', lat: 9.3592, lng: -79.9014, radiusKm: 35, volume: 'Panama transshipment hub', tags: ['regional-logistics-hub', 'container', 'transshipment', 'panama-canal', 'latin-america'] },
  { id: 'durban', name: 'Port of Durban', country: 'South Africa', tier: 2, watchType: 'port', mapType: 'container', lat: -29.8587, lng: 31.0218, radiusKm: 35, volume: 'Southern Africa container hub', tags: ['regional-logistics-hub', 'container', 'africa'] },
  { id: 'melbourne', name: 'Port of Melbourne', country: 'Australia', tier: 2, watchType: 'port', mapType: 'container', lat: -37.8136, lng: 144.9631, radiusKm: 35, volume: 'Australia container hub', tags: ['regional-logistics-hub', 'container', 'oceania'] },
  { id: 'sydney-botany', name: 'Port Botany / Sydney', country: 'Australia', tier: 2, watchType: 'port', mapType: 'container', lat: -33.9667, lng: 151.2167, radiusKm: 35, volume: 'Australia east coast container hub', tags: ['regional-logistics-hub', 'container', 'oceania'] },
];

export function watchZoneToBoundingBox(zone: MaritimeWatchZone): BoundingBox {
  const latDelta = zone.radiusKm / 111;
  const lonDelta = zone.radiusKm / (111 * Math.cos((zone.lat * Math.PI) / 180));

  return [
    [Number((zone.lat - latDelta).toFixed(5)), Number((zone.lng - lonDelta).toFixed(5))],
    [Number((zone.lat + latDelta).toFixed(5)), Number((zone.lng + lonDelta).toFixed(5))],
  ];
}

export function watchZonesToBoundingBoxes(zones: readonly MaritimeWatchZone[]): BoundingBox[] {
  return zones.map(watchZoneToBoundingBox);
}

export const MARITIME_AIS_BOUNDING_BOXES = watchZonesToBoundingBoxes(MARITIME_WATCH_ZONES);

export const MARITIME_PORT_WATCH_ZONES = MARITIME_WATCH_ZONES.filter(
  (zone) => zone.watchType === 'port',
);

export const MARITIME_CHOKEPOINT_WATCH_ZONES = MARITIME_WATCH_ZONES.filter(
  (zone) => zone.watchType === 'chokepoint',
);
