import { Appliance, LocationData, SystemParameters } from '../types';

export const INITIAL_APPLIANCES: Appliance[] = [
  {
    id: 'app-1',
    name: 'Refrigerator',
    powerWatts: 150,
    hoursPerDay: 24,
    quantity: 1,
    icon: 'kitchen',
    category: 'Kitchen',
  },
  {
    id: 'app-2',
    name: 'LED Lighting (x10)',
    powerWatts: 100,
    hoursPerDay: 5,
    quantity: 1,
    icon: 'lightbulb',
    category: 'Lighting',
  },
  {
    id: 'app-3',
    name: 'Television (LED)',
    powerWatts: 120,
    hoursPerDay: 4,
    quantity: 1,
    icon: 'tv',
    category: 'Entertainment',
  },
];

export const PRESET_APPLIANCES = [
  { name: 'Refrigerator', powerWatts: 150, hoursPerDay: 24, icon: 'kitchen', category: 'Kitchen' },
  { name: 'Deep Freezer', powerWatts: 250, hoursPerDay: 18, icon: 'ac_unit', category: 'Kitchen' },
  { name: 'LED Lighting (x10)', powerWatts: 100, hoursPerDay: 5, icon: 'lightbulb', category: 'Lighting' },
  { name: 'Television (LED)', powerWatts: 120, hoursPerDay: 4, icon: 'tv', category: 'Entertainment' },
  { name: 'Washing Machine', powerWatts: 500, hoursPerDay: 1.5, icon: 'local_laundry_service', category: 'Appliances' },
  { name: 'Inverter AC (1.5 HP)', powerWatts: 1100, hoursPerDay: 6, icon: 'ac_unit', category: 'HVAC' },
  { name: 'Ceiling Fan (Standing/Ceiling)', powerWatts: 65, hoursPerDay: 8, icon: 'mode_fan', category: 'HVAC' },
  { name: 'Microwave Oven', powerWatts: 1000, hoursPerDay: 0.5, icon: 'microwave', category: 'Kitchen' },
  { name: 'Laptop / PC Workstation', powerWatts: 120, hoursPerDay: 8, icon: 'laptop', category: 'Office' },
  { name: 'Wi-Fi Router & Modem', powerWatts: 20, hoursPerDay: 24, icon: 'router', category: 'Electronics' },
  { name: 'Borehole Water Pump (1 HP)', powerWatts: 750, hoursPerDay: 2, icon: 'water_drop', category: 'Pumping' },
  { name: 'Electric Water Heater', powerWatts: 2000, hoursPerDay: 2, icon: 'hot_tub', category: 'HVAC' },
  { name: 'Iron / Pressing Iron', powerWatts: 1200, hoursPerDay: 0.5, icon: 'iron', category: 'Appliances' },
  { name: 'CCTV & Security System', powerWatts: 80, hoursPerDay: 24, icon: 'videocam', category: 'Security' },
];

export const POPULAR_LOCATIONS: LocationData[] = [
  // Nigeria Locations
  { city: 'Lagos', stateOrCountry: 'Nigeria', peakSunHours: 4.8, zone: 'West Africa (Coastal Tropical)' },
  { city: 'Abuja', stateOrCountry: 'Nigeria', peakSunHours: 5.5, zone: 'West Africa (Guinean Savanna)' },
  { city: 'Kano', stateOrCountry: 'Nigeria', peakSunHours: 6.1, zone: 'West Africa (Sudan Savanna)' },
  { city: 'Port Harcourt', stateOrCountry: 'Nigeria', peakSunHours: 4.3, zone: 'West Africa (Niger Delta)' },
  { city: 'Ibadan', stateOrCountry: 'Nigeria', peakSunHours: 4.9, zone: 'West Africa (Southwest Nigeria)' },
  { city: 'Enugu', stateOrCountry: 'Nigeria', peakSunHours: 4.7, zone: 'West Africa (Southeast Nigeria)' },

  // Global & US Locations
  { city: 'Phoenix', stateOrCountry: 'AZ, USA', peakSunHours: 5.8, zone: 'Southwest US (High Solar)' },
  { city: 'Los Angeles', stateOrCountry: 'CA, USA', peakSunHours: 5.4, zone: 'West Coast US' },
  { city: 'Miami', stateOrCountry: 'FL, USA', peakSunHours: 5.0, zone: 'Southeast US' },
  { city: 'Austin', stateOrCountry: 'TX, USA', peakSunHours: 4.9, zone: 'South Central US' },
  { city: 'London', stateOrCountry: 'UK', peakSunHours: 3.2, zone: 'Northern Europe' },
  { city: 'Madrid', stateOrCountry: 'Spain', peakSunHours: 5.1, zone: 'Southern Europe' },
  { city: 'Dubai', stateOrCountry: 'UAE', peakSunHours: 6.2, zone: 'Middle East (High Irradiance)' },
  { city: 'Nairobi', stateOrCountry: 'Kenya', peakSunHours: 5.7, zone: 'East Africa' },
  { city: 'Johannesburg', stateOrCountry: 'South Africa', peakSunHours: 5.6, zone: 'Southern Africa' },
  { city: 'Accra', stateOrCountry: 'Ghana', peakSunHours: 4.9, zone: 'West Africa' },
  { city: 'Sydney', stateOrCountry: 'Australia', peakSunHours: 4.8, zone: 'Oceania' },
  { city: 'Mumbai', stateOrCountry: 'India', peakSunHours: 5.3, zone: 'South Asia' },
];

export const DEFAULT_SYSTEM_PARAMETERS: SystemParameters = {
  location: POPULAR_LOCATIONS[0], // Lagos, Nigeria (or Phoenix)
  autonomyDays: 2.0,
  batteryType: 'lifepo4',
  systemVoltage: 48,
  panelWattage: 400,
  derateFactor: 0.85,
  inverterEfficiency: 0.92,
};
