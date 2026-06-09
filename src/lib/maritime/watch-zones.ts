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

  // ============================================================
  // Tier 1: Global canals, straits, passages, and shipping chokepoints
  // ============================================================

  { id: 'strait-of-hormuz-west', name: 'Strait of Hormuz West / Persian Gulf Approach', country: 'Iran / Oman / UAE', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 26.65, lng: 55.75, radiusKm: 95, traffic: 'Western Persian Gulf approach to Strait of Hormuz', risk: 'HIGH', tags: ['chokepoint', 'strait', 'energy', 'oil', 'lng', 'persian-gulf', 'middle-east', 'high-risk'] },
  { id: 'strait-of-hormuz-central', name: 'Strait of Hormuz Central Passage', country: 'Iran / Oman / UAE', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 26.5667, lng: 56.25, radiusKm: 95, traffic: 'Central tanker and commercial transit passage', risk: 'HIGH', tags: ['chokepoint', 'strait', 'energy', 'oil', 'lng', 'tanker', 'middle-east', 'high-risk'] },
  { id: 'gulf-of-oman-hormuz-approach', name: 'Gulf of Oman / Hormuz Eastern Approach', country: 'Oman / Iran', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 25.85, lng: 57.25, radiusKm: 140, traffic: 'Eastern approach to Strait of Hormuz from Gulf of Oman', risk: 'HIGH', tags: ['chokepoint', 'gulf-of-oman', 'energy', 'oil', 'lng', 'tanker', 'middle-east', 'high-risk'] },
  { id: 'strait-of-malacca', name: 'Strait of Malacca', country: 'Malaysia / Indonesia / Singapore / Thailand', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 2.5, lng: 101.0, radiusKm: 260, traffic: 'Primary Indian Ocean-Pacific Ocean trade corridor', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'container', 'energy', 'asia', 'high-traffic'] },
  { id: 'singapore-strait', name: 'Singapore Strait / Phillips Channel', country: 'Singapore / Malaysia / Indonesia', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 1.203, lng: 103.97, radiusKm: 90, traffic: 'Dense east-west traffic bottleneck at Singapore', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'container', 'energy', 'asia', 'high-traffic', 'collision-risk'] },
  { id: 'suez-canal', name: 'Suez Canal', country: 'Egypt', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 30.5852, lng: 32.2654, radiusKm: 140, traffic: 'Europe-Asia canal corridor between Mediterranean and Red Sea', risk: 'ELEVATED', tags: ['chokepoint', 'canal', 'container', 'energy', 'middle-east', 'africa', 'high-risk'] },
  { id: 'port-said-suez-north', name: 'Port Said / Suez Canal North Approach', country: 'Egypt', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 31.2653, lng: 32.3019, radiusKm: 70, traffic: 'Northern Suez Canal approach and anchorage zone', risk: 'ELEVATED', tags: ['chokepoint', 'canal-approach', 'mediterranean', 'suez', 'container', 'energy'] },
  { id: 'gulf-of-suez-south-approach', name: 'Gulf of Suez / Canal South Approach', country: 'Egypt', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 29.9668, lng: 32.5498, radiusKm: 90, traffic: 'Southern Suez Canal approach from Red Sea', risk: 'ELEVATED', tags: ['chokepoint', 'canal-approach', 'red-sea', 'suez', 'container', 'energy'] },
  { id: 'bab-el-mandeb', name: 'Bab el-Mandeb', country: 'Yemen / Djibouti / Eritrea', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 12.5833, lng: 43.3333, radiusKm: 120, traffic: 'Red Sea-Gulf of Aden energy and container corridor', risk: 'CRITICAL', tags: ['chokepoint', 'strait', 'energy', 'red-sea', 'gulf-of-aden', 'middle-east', 'africa', 'high-risk'] },
  { id: 'red-sea-central-corridor', name: 'Central Red Sea Shipping Corridor', country: 'Saudi Arabia / Sudan / Eritrea', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 19.25, lng: 38.75, radiusKm: 220, traffic: 'Main Red Sea north-south commercial shipping route', risk: 'HIGH', tags: ['shipping-corridor', 'red-sea', 'container', 'energy', 'conflict-risk', 'high-risk'] },
  { id: 'gulf-of-aden', name: 'Gulf of Aden Transit Corridor', country: 'Yemen / Somalia / Djibouti', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 12.2, lng: 48.0, radiusKm: 260, traffic: 'Indian Ocean approach to Bab el-Mandeb and Red Sea', risk: 'HIGH', tags: ['shipping-corridor', 'gulf-of-aden', 'red-sea', 'piracy-risk', 'conflict-risk'] },
  { id: 'panama-canal', name: 'Panama Canal', country: 'Panama', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 9.08, lng: -79.68, radiusKm: 95, traffic: 'Atlantic-Pacific canal corridor', risk: 'LOW', tags: ['chokepoint', 'canal', 'container', 'americas'] },
  { id: 'panama-canal-atlantic-approach', name: 'Panama Canal Atlantic Approach / Colón', country: 'Panama', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 9.36, lng: -79.9, radiusKm: 55, traffic: 'Atlantic entrance and anchorage zone for Panama Canal', risk: 'LOW', tags: ['chokepoint', 'canal-approach', 'container', 'atlantic', 'americas'] },
  { id: 'panama-canal-pacific-approach', name: 'Panama Canal Pacific Approach / Balboa', country: 'Panama', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 8.95, lng: -79.57, radiusKm: 55, traffic: 'Pacific entrance and anchorage zone for Panama Canal', risk: 'LOW', tags: ['chokepoint', 'canal-approach', 'container', 'pacific', 'americas'] },
  { id: 'turkish-straits', name: 'Turkish Straits', country: 'Turkey', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 41.1, lng: 29.05, radiusKm: 150, traffic: 'Black Sea grain, energy, and commercial corridor', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'black-sea', 'energy', 'grain', 'europe', 'middle-east'] },
  { id: 'bosporus-strait', name: 'Bosporus Strait', country: 'Turkey', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 41.12, lng: 29.07, radiusKm: 55, traffic: 'Black Sea to Sea of Marmara chokepoint', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'black-sea', 'turkish-straits', 'grain', 'energy'] },
  { id: 'dardanelles-strait', name: 'Dardanelles Strait', country: 'Turkey', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 40.15, lng: 26.4, radiusKm: 70, traffic: 'Sea of Marmara to Aegean chokepoint', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'turkish-straits', 'grain', 'energy', 'mediterranean'] },
  { id: 'gibraltar', name: 'Strait of Gibraltar', country: 'Spain / Morocco / United Kingdom', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 35.9606, lng: -5.5613, radiusKm: 100, traffic: 'Mediterranean-Atlantic gateway', risk: 'LOW', tags: ['chokepoint', 'strait', 'container', 'energy', 'mediterranean', 'atlantic'] },
  { id: 'english-channel-dover', name: 'English Channel / Strait of Dover', country: 'United Kingdom / France', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 51.05, lng: 1.55, radiusKm: 130, traffic: 'North Sea-Atlantic high-density commercial corridor', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'english-channel', 'north-sea', 'europe', 'high-traffic'] },
  { id: 'danish-straits', name: 'Danish Straits', country: 'Denmark / Sweden / Germany', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 55.7, lng: 12.6, radiusKm: 130, traffic: 'Baltic Sea access route for commercial, energy, and naval traffic', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'baltic-sea', 'north-sea', 'energy', 'europe'] },
  { id: 'great-belt', name: 'Great Belt', country: 'Denmark', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 55.35, lng: 10.95, radiusKm: 70, traffic: 'Major Baltic-North Sea shipping passage', risk: 'LOW', tags: ['chokepoint', 'strait', 'baltic-sea', 'north-sea', 'europe'] },
  { id: 'oresund', name: 'Øresund', country: 'Denmark / Sweden', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 55.85, lng: 12.75, radiusKm: 60, traffic: 'Baltic access corridor between Denmark and Sweden', risk: 'LOW', tags: ['chokepoint', 'strait', 'baltic-sea', 'north-sea', 'europe'] },
  { id: 'kiel-canal', name: 'Kiel Canal', country: 'Germany', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 54.35, lng: 9.75, radiusKm: 70, traffic: 'Baltic-North Sea shortcut canal', risk: 'LOW', tags: ['chokepoint', 'canal', 'baltic-sea', 'north-sea', 'europe'] },
  { id: 'taiwan-strait', name: 'Taiwan Strait', country: 'China / Taiwan', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 24.0, lng: 119.0, radiusKm: 180, traffic: 'High-volume East Asia commercial and energy corridor', risk: 'HIGH', tags: ['chokepoint', 'strait', 'container', 'energy', 'asia', 'conflict-risk', 'high-risk'] },
  { id: 'luzon-strait', name: 'Luzon Strait', country: 'Taiwan / Philippines', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 20.6, lng: 121.3, radiusKm: 170, traffic: 'Western Pacific-South China Sea passage', risk: 'ELEVATED', tags: ['chokepoint', 'strait', 'south-china-sea', 'pacific', 'asia', 'conflict-risk'] },
  { id: 'south-china-sea-central', name: 'Central South China Sea Shipping Corridor', country: 'China / Vietnam / Philippines / Malaysia / Brunei', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 13.5, lng: 113.5, radiusKm: 360, traffic: 'Major Asia container, bulk, and energy shipping corridor', risk: 'ELEVATED', tags: ['shipping-corridor', 'south-china-sea', 'container', 'energy', 'asia', 'conflict-risk'] },
  { id: 'korea-strait', name: 'Korea Strait / Tsushima Strait', country: 'South Korea / Japan', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 34.6, lng: 129.3, radiusKm: 120, traffic: 'Sea of Japan-East China Sea commercial passage', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'korea', 'japan', 'asia', 'container'] },
  { id: 'tsugaru-strait', name: 'Tsugaru Strait', country: 'Japan', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 41.5, lng: 140.7, radiusKm: 85, traffic: 'Japanese north-south and Pacific access passage', risk: 'LOW', tags: ['chokepoint', 'strait', 'japan', 'pacific', 'asia'] },
  { id: 'bohai-strait', name: 'Bohai Strait', country: 'China', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 38.0, lng: 120.9, radiusKm: 110, traffic: 'Bohai Sea access to Tianjin, Dalian, and northern China ports', risk: 'LOW', tags: ['chokepoint', 'strait', 'china', 'asia', 'container', 'bulk'] },
  { id: 'lombok-strait', name: 'Lombok Strait', country: 'Indonesia', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -8.47, lng: 115.72, radiusKm: 120, traffic: 'Deep-water alternative to Malacca for large vessels', risk: 'LOW', tags: ['chokepoint', 'strait', 'indonesia', 'asia', 'malacca-alternative', 'deep-water'] },
  { id: 'sunda-strait', name: 'Sunda Strait', country: 'Indonesia', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -6.05, lng: 105.9, radiusKm: 110, traffic: 'Java Sea-Indian Ocean passage', risk: 'LOW', tags: ['chokepoint', 'strait', 'indonesia', 'asia', 'malacca-alternative'] },
  { id: 'makassar-strait', name: 'Makassar Strait', country: 'Indonesia', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -1.5, lng: 118.7, radiusKm: 260, traffic: 'Indonesian archipelagic sea lane for large vessels', risk: 'LOW', tags: ['chokepoint', 'strait', 'indonesia', 'asia', 'deep-water', 'archipelagic-route'] },
  { id: 'ombai-wetar-straits', name: 'Ombai-Wetar Straits', country: 'Indonesia / Timor-Leste', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -8.35, lng: 125.1, radiusKm: 170, traffic: 'Deep-water passage between Pacific and Indian Ocean routes', risk: 'LOW', tags: ['chokepoint', 'strait', 'indonesia', 'timor-leste', 'deep-water', 'asia'] },
  { id: 'torres-strait', name: 'Torres Strait', country: 'Australia / Papua New Guinea', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -10.55, lng: 142.2, radiusKm: 160, traffic: 'Northern Australia-Papua New Guinea reef-constrained passage', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'australia', 'papua-new-guinea', 'reef-risk', 'oceania'] },
  { id: 'cape-of-good-hope', name: 'Cape of Good Hope / Cape Route', country: 'South Africa', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -34.3568, lng: 18.474, radiusKm: 260, traffic: 'Suez alternative route around southern Africa', risk: 'LOW', tags: ['chokepoint', 'cape-route', 'suez-alternative', 'container', 'energy', 'africa', 'atlantic', 'indian-ocean'] },
  { id: 'mozambique-channel', name: 'Mozambique Channel', country: 'Mozambique / Madagascar', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -18.0, lng: 42.5, radiusKm: 360, traffic: 'Western Indian Ocean route between southern Africa and Madagascar', risk: 'LOW', tags: ['shipping-corridor', 'indian-ocean', 'africa', 'container', 'energy'] },
  { id: 'cape-horn-drake-passage', name: 'Cape Horn / Drake Passage', country: 'Chile / Argentina', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -56.2, lng: -67.3, radiusKm: 280, traffic: 'Extreme southern alternate Atlantic-Pacific passage', risk: 'MODERATE', tags: ['chokepoint', 'cape-route', 'south-america', 'atlantic', 'pacific', 'weather-risk'] },
  { id: 'magellan-strait', name: 'Strait of Magellan', country: 'Chile', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: -53.4, lng: -70.9, radiusKm: 220, traffic: 'Protected Atlantic-Pacific passage through southern Chile', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'south-america', 'atlantic', 'pacific', 'weather-risk'] },
  { id: 'yucatan-channel', name: 'Yucatán Channel', country: 'Mexico / Cuba', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 21.7, lng: -86.9, radiusKm: 160, traffic: 'Gulf of Mexico-Caribbean passage', risk: 'LOW', tags: ['chokepoint', 'channel', 'gulf-of-mexico', 'caribbean', 'americas', 'energy'] },
  { id: 'florida-straits', name: 'Florida Straits', country: 'United States / Cuba / Bahamas', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 24.5, lng: -80.5, radiusKm: 180, traffic: 'Gulf of Mexico-Atlantic commercial and cruise corridor', risk: 'LOW', tags: ['chokepoint', 'strait', 'gulf-of-mexico', 'atlantic', 'caribbean', 'americas'] },
  { id: 'windward-passage', name: 'Windward Passage', country: 'Cuba / Haiti', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 20.0, lng: -74.5, radiusKm: 150, traffic: 'Caribbean-Atlantic passage', risk: 'LOW', tags: ['chokepoint', 'passage', 'caribbean', 'atlantic', 'americas'] },
  { id: 'mona-passage', name: 'Mona Passage', country: 'Dominican Republic / Puerto Rico', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 18.5, lng: -67.8, radiusKm: 140, traffic: 'Caribbean-Atlantic passage between Hispaniola and Puerto Rico', risk: 'LOW', tags: ['chokepoint', 'passage', 'caribbean', 'atlantic', 'americas'] },
  { id: 'st-lawrence-seaway', name: 'St. Lawrence Seaway', country: 'Canada / United States', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 44.9, lng: -75.2, radiusKm: 260, traffic: 'Great Lakes-Atlantic inland shipping corridor', risk: 'LOW', tags: ['chokepoint', 'seaway', 'great-lakes', 'atlantic', 'north-america', 'bulk'] },
  { id: 'strait-of-belle-isle', name: 'Strait of Belle Isle', country: 'Canada', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 51.7, lng: -56.7, radiusKm: 150, traffic: 'Gulf of St. Lawrence-Labrador Sea passage', risk: 'LOW', tags: ['chokepoint', 'strait', 'canada', 'north-atlantic', 'north-america'] },
  { id: 'bering-strait', name: 'Bering Strait', country: 'United States / Russia', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 65.8, lng: -169.0, radiusKm: 180, traffic: 'Pacific-Arctic passage and Northern Sea Route access', risk: 'MODERATE', tags: ['chokepoint', 'strait', 'arctic', 'pacific', 'northern-sea-route', 'weather-risk'] },
  { id: 'northern-sea-route-western-gate', name: 'Northern Sea Route Western Gate / Barents-Kara', country: 'Russia / Norway', tier: 1, watchType: 'chokepoint', mapType: 'chokepoint', lat: 70.5, lng: 55.0, radiusKm: 360, traffic: 'Arctic shipping route western access', risk: 'MODERATE', tags: ['shipping-corridor', 'arctic', 'northern-sea-route', 'russia', 'energy', 'weather-risk'] },

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
  { id: 'columbia-river-mouth', name: 'Columbia River Mouth / Astoria', country: 'United States', tier: 2, watchType: 'chokepoint', mapType: 'chokepoint', lat: 46.2443, lng: -124.0565, radiusKm: 65, traffic: 'Columbia River maritime entrance and bar crossing', risk: 'MODERATE', tags: ['pnw', 'oregon', 'washington', 'river', 'bar-crossing', 'us-port', 'chokepoint'] },
  { id: 'portland-vancouver-columbia', name: 'Portland / Vancouver Columbia River Ports', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 45.5575, lng: -122.7311, radiusKm: 70, volume: 'Columbia River inland port complex', tags: ['pnw', 'oregon', 'washington', 'river', 'grain', 'autos', 'bulk', 'container', 'us-port'] },
  { id: 'coos-bay', name: 'Port of Coos Bay', country: 'United States', tier: 2, watchType: 'port', mapType: 'container', lat: 43.3665, lng: -124.2179, radiusKm: 40, volume: 'Oregon coastal bulk and rail-linked port', tags: ['pnw', 'oregon', 'coastal-port', 'bulk', 'us-port'] },
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

export type MaritimeTrackingMode = 'critical' | 'ports' | 'us' | 'pnw' | 'all';

/**
 * Controls how much AISStream subscribes to at once.
 *
 * Recommended default:
 *   MARITIME_TRACKING_MODE=critical
 *
 * Other useful values:
 *   MARITIME_TRACKING_MODE=ports
 *   MARITIME_TRACKING_MODE=us
 *   MARITIME_TRACKING_MODE=pnw
 *   MARITIME_TRACKING_MODE=all
 *
 * Use "all" only when testing. It can request a lot of AIS traffic.
 */
export const MARITIME_ZONE_GROUPS: Record<MaritimeTrackingMode, string[]> = {
  critical: [
    'strait-of-hormuz-west',
    'strait-of-hormuz-central',
    'gulf-of-oman-hormuz-approach',
    'suez-canal',
    'port-said-suez-north',
    'gulf-of-suez-south-approach',
    'bab-el-mandeb',
    'red-sea-central-corridor',
    'gulf-of-aden',
    'strait-of-malacca',
    'singapore-strait',
    'panama-canal',
    'panama-canal-atlantic-approach',
    'panama-canal-pacific-approach',
    'taiwan-strait',
    'luzon-strait',
    'english-channel-dover',
    'danish-straits',
    'gibraltar',
    'turkish-straits',
    'bosporus-strait',
    'dardanelles-strait',
    'cape-of-good-hope',
  ],

  ports: [
    'shanghai',
    'singapore',
    'ningbo-zhoushan',
    'shenzhen',
    'guangzhou',
    'qingdao',
    'busan',
    'rotterdam',
    'antwerp-bruges',
    'jebel-ali',
    'tanger-med',
    'los-angeles-long-beach',
    'new-york-new-jersey',
    'houston',
    'corpus-christi',
    'fujairah',
    'ras-tanura',
    'hamburg',
    'bremerhaven',
    'felixstowe',
    'le-havre',
    'valencia',
    'piraeus',
    'colombo',
    'mumbai-nhava-sheva',
    'mundra',
    'kaohsiung',
    'hong-kong',
    'tokyo-yokohama',
    'laem-chabang',
    'tanjung-pelepas',
    'jakarta-tanjung-priok',
    'manila',
    'vancouver',
    'seattle-tacoma',
    'oakland',
    'savannah',
    'charleston',
    'norfolk-hampton-roads',
    'new-orleans',
    'mobile',
    'santos',
    'manzanillo-mexico',
    'colon-panama',
    'durban',
    'melbourne',
    'sydney-botany',
  ],

  us: [
    'los-angeles-long-beach',
    'new-york-new-jersey',
    'houston',
    'corpus-christi',
    'seattle-tacoma',
    'columbia-river-mouth',
    'portland-vancouver-columbia',
    'coos-bay',
    'oakland',
    'savannah',
    'charleston',
    'norfolk-hampton-roads',
    'new-orleans',
    'mobile',
    'panama-canal',
    'panama-canal-atlantic-approach',
    'panama-canal-pacific-approach',
    'florida-straits',
    'yucatan-channel',
    'st-lawrence-seaway',
  ],

  pnw: [
    'vancouver',
    'seattle-tacoma',
    'columbia-river-mouth',
    'portland-vancouver-columbia',
    'coos-bay',
  ],

  all: MARITIME_WATCH_ZONES.map((zone) => zone.id),
};

function getMaritimeTrackingMode(): MaritimeTrackingMode {
  const requestedMode = (process.env.MARITIME_TRACKING_MODE || 'critical')
    .trim()
    .toLowerCase();

  if (
    requestedMode === 'critical' ||
    requestedMode === 'ports' ||
    requestedMode === 'us' ||
    requestedMode === 'pnw' ||
    requestedMode === 'all'
  ) {
    return requestedMode;
  }

  return 'critical';
}

export const MARITIME_TRACKING_MODE = getMaritimeTrackingMode();

export const ACTIVE_MARITIME_ZONE_IDS = new Set(
  MARITIME_ZONE_GROUPS[MARITIME_TRACKING_MODE],
);

export const ACTIVE_MARITIME_WATCH_ZONES = MARITIME_WATCH_ZONES.filter((zone) =>
  ACTIVE_MARITIME_ZONE_IDS.has(zone.id),
);

export const MARITIME_AIS_BOUNDING_BOXES = watchZonesToBoundingBoxes(
  ACTIVE_MARITIME_WATCH_ZONES,
);

export const MARITIME_PORT_WATCH_ZONES = ACTIVE_MARITIME_WATCH_ZONES.filter(
  (zone) => zone.watchType === 'port',
);

export const MARITIME_CHOKEPOINT_WATCH_ZONES = ACTIVE_MARITIME_WATCH_ZONES.filter(
  (zone) => zone.watchType === 'chokepoint',
);