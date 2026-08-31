export interface Appliance {
  id: string;
  name: string;
  powerWatts: number;
  hoursPerDay: number;
  quantity: number;
  icon: string;
  category?: string;
}

export interface LocationData {
  city: string;
  stateOrCountry: string;
  peakSunHours: number;
  zone: string;
}

export type BatteryType = 'lead-acid' | 'lifepo4';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Conversion rate from 1 USD
  flag: string;
  symbolPosition?: 'prefix' | 'suffix';
  decimalPlaces?: number;
}

export interface SystemParameters {
  location: LocationData;
  autonomyDays: number;
  batteryType: BatteryType;
  systemVoltage: number; // 12, 24, 48
  panelWattage: number; // e.g. 400
  derateFactor: number; // e.g. 0.85
  inverterEfficiency: number; // e.g. 0.92
}

export interface MaterialItem {
  id: string;
  name: string;
  specification: string;
  category: 'Solar Panels' | 'Battery Bank' | 'Power Electronics' | 'Wiring & Fuses' | 'Mounting Hardware (Roof)' | 'Custom Components';
  quantity: number;
  unit: string;
  unitCost: number; // Base cost in USD
}

export interface SystemSizingResult {
  dailyLoadKWh: number;
  peakSimultaneousWatts: number;
  solarArrayCapacityKW: number;
  panelCount: number;
  panelRatingW: number;
  batteryCapacityAh: number;
  batteryCapacityKWh: number;
  batteryUnitsCount: number;
  batteryUnitSpec: string;
  batteryVoltage: number;
  dodPercentage: number;
  inverterContinuousWatts: number;
  inverterSurgeWatts: number;
  batteryInterconnectGauge: string;
  mainDcBreakerAmps: number;
  pvWireGauge: string;
  pvWireLengthFt: number;
  materials: MaterialItem[];
  totalEstimatedCost: number;
  totalItemsCount: number;
}

export type ActiveTab = 'loads' | 'sizing' | 'materials';
