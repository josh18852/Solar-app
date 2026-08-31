import { Appliance, MaterialItem, SystemParameters, SystemSizingResult } from '../types';

export function calculateApplianceDailyKWh(appliance: Appliance): number {
  return (appliance.powerWatts * appliance.hoursPerDay * (appliance.quantity || 1)) / 1000;
}

export function calculateTotalDailyLoadKWh(appliances: Appliance[]): number {
  return appliances.reduce((total, app) => total + calculateApplianceDailyKWh(app), 0);
}

export function calculateSystemSizing(
  appliances: Appliance[],
  params: SystemParameters
): SystemSizingResult {
  const rawDailyLoadKWh = calculateTotalDailyLoadKWh(appliances);
  // Guarantee a minimum sensible load if user has emptied the list
  const dailyLoadKWh = Math.max(rawDailyLoadKWh, 0.1);

  // Peak simultaneous load estimate (sum of power with diversity factor ~ 0.75 or minimum single largest load)
  const totalConnectedWatts = appliances.reduce(
    (acc, app) => acc + app.powerWatts * (app.quantity || 1),
    0
  );
  const maxSingleLoad = appliances.reduce(
    (max, app) => Math.max(max, app.powerWatts),
    0
  );
  const peakSimultaneousWatts = Math.max(totalConnectedWatts * 0.75, maxSingleLoad * 1.25, 1000);

  // 1. Solar Array Sizing
  // Required Daily Generation = Daily Load / (Derate Factor * Inverter Efficiency)
  const dailyEnergyNeeded = dailyLoadKWh / (params.derateFactor * params.inverterEfficiency);
  const peakSunHours = Math.max(params.location.peakSunHours, 1);
  const solarArrayCapacityKW = +(dailyEnergyNeeded / peakSunHours).toFixed(2);

  const panelRatingW = params.panelWattage || 400;
  const panelCount = Math.max(Math.ceil((solarArrayCapacityKW * 1000) / panelRatingW), 2);
  const actualArrayKW = +((panelCount * panelRatingW) / 1000).toFixed(2);

  // 2. Battery Bank Sizing
  // DoD: Lead-acid = 50% (0.50), LiFePO4 = 80% (0.80)
  const dodPercentage = params.batteryType === 'lifepo4' ? 80 : 50;
  const dodFactor = dodPercentage / 100;
  
  // Usable battery energy needed for autonomy
  const totalBatteryKWhNeeded = (dailyLoadKWh * params.autonomyDays) / dodFactor;
  const systemVoltage = params.systemVoltage || 48;
  const batteryCapacityAh = Math.round((totalBatteryKWhNeeded * 1000) / systemVoltage);

  // Units configuration
  let batteryUnitsCount = 0;
  let batteryUnitSpec = '';
  let batteryUnitCost = 0;

  if (params.batteryType === 'lifepo4') {
    // 48V 100Ah rack modules (5.12 kWh nominal each)
    const unitAh = 100;
    batteryUnitsCount = Math.max(Math.ceil(batteryCapacityAh / unitAh), 1);
    batteryUnitSpec = '48V 100Ah LiFePO4 Server Rack';
    batteryUnitCost = 1150;
  } else {
    // 12V 200Ah Lead-Acid deep cycle batteries
    // Series strings to reach system voltage (e.g. 48V = 4 in series)
    const seriesPerString = systemVoltage / 12;
    const unitAh = 200;
    const stringsNeeded = Math.max(Math.ceil(batteryCapacityAh / unitAh), 1);
    batteryUnitsCount = Math.max(stringsNeeded * seriesPerString, 4);
    batteryUnitSpec = '12V / 200Ah Deep Cycle AGM';
    batteryUnitCost = 280;
  }

  // 3. Inverter Sizing
  // Continuous inverter power: Round up to nearest 1000W or standard sizes (3kW, 5kW, 6kW, 8kW, 10kW, 12kW)
  const rawInverterContinuous = Math.max(peakSimultaneousWatts * 1.3, actualArrayKW * 800, 3000);
  let inverterContinuousWatts = Math.ceil(rawInverterContinuous / 1000) * 1000;
  if (inverterContinuousWatts < 5000 && dailyLoadKWh > 6) {
    inverterContinuousWatts = 5000;
  }
  if (inverterContinuousWatts < 6000 && dailyLoadKWh > 10) {
    inverterContinuousWatts = 6000;
  }
  const inverterSurgeWatts = inverterContinuousWatts * 2;

  // 4. Cabling & Breakers Minimums
  // Maximum DC current into inverter: Inverter Watts / (System Voltage * 0.85 low battery)
  const maxDcCurrent = inverterContinuousWatts / (systemVoltage * 0.85);
  let batteryInterconnectGauge = '2/0 AWG';
  let mainDcBreakerAmps = 150;

  if (maxDcCurrent > 200 || systemVoltage <= 24) {
    batteryInterconnectGauge = '4/0 AWG';
    mainDcBreakerAmps = 250;
  } else if (maxDcCurrent > 125) {
    batteryInterconnectGauge = '2/0 AWG';
    mainDcBreakerAmps = 175;
  } else {
    batteryInterconnectGauge = '1/0 AWG';
    mainDcBreakerAmps = 125;
  }

  // PV Wire: 10 AWG standard for residential strings
  const pvWireGauge = '10 AWG';
  const pvWireLengthFt = 100;

  // 5. Mounting Hardware calculations (Roof)
  // 2 panels per 14ft rail pair roughly
  const railsCount = Math.max(Math.ceil(panelCount / 2) * 2, 4);
  const lFeetCount = railsCount * 3;
  const midClampsCount = Math.max((panelCount - 2) * 2, 4);
  const endClampsCount = 8;

  // 6. Generate Materials List
  const materials: MaterialItem[] = [
    {
      id: 'mat-solar-1',
      name: `${panelRatingW}W Monocrystalline`,
      specification: 'Tier 1, 24V Nominal, MC4 Connectors',
      category: 'Solar Panels',
      quantity: panelCount,
      unit: 'panels',
      unitCost: 185,
    },
    {
      id: 'mat-bat-1',
      name: params.batteryType === 'lifepo4' ? 'LiFePO4 48V 100Ah' : '12V 200Ah Deep Cycle',
      specification:
        params.batteryType === 'lifepo4'
          ? 'Server Rack Battery, Built-in BMS'
          : 'Sealed AGM, High Cycle Life',
      category: 'Battery Bank',
      quantity: batteryUnitsCount,
      unit: 'units',
      unitCost: batteryUnitCost,
    },
    {
      id: 'mat-inv-1',
      name: `${Math.round(inverterContinuousWatts / 1000)}kW Hybrid Inverter`,
      specification: `${systemVoltage}V DC to 120/240V AC, Pure Sine Wave`,
      category: 'Power Electronics',
      quantity: 1,
      unit: 'unit',
      unitCost: inverterContinuousWatts >= 6000 ? 1450 : 1100,
    },
    {
      id: 'mat-cc-1',
      name: `${Math.min(Math.max(Math.round((actualArrayKW * 1000) / systemVoltage), 60), 100)}A MPPT Charge Controller`,
      specification: '150V Max Input, 48V Output',
      category: 'Power Electronics',
      quantity: 1,
      unit: 'unit',
      unitCost: 320,
    },
    {
      id: 'mat-wire-1',
      name: `${pvWireGauge} PV Wire`,
      specification: 'UV Resistant, Black & Red pairs',
      category: 'Wiring & Fuses',
      quantity: pvWireLengthFt,
      unit: 'ft',
      unitCost: 0.95,
    },
    {
      id: 'mat-wire-2',
      name: `${batteryInterconnectGauge} Battery Cables`,
      specification: 'Pure Copper, 3ft lengths, crimped lugs',
      category: 'Wiring & Fuses',
      quantity: Math.max(Math.floor(batteryUnitsCount / 2), 4),
      unit: 'units',
      unitCost: 32,
    },
    {
      id: 'mat-fuse-1',
      name: `${mainDcBreakerAmps}A DC Breaker`,
      specification: 'Between Battery & Inverter',
      category: 'Wiring & Fuses',
      quantity: 1,
      unit: 'unit',
      unitCost: 75,
    },
    {
      id: 'mat-mount-1',
      name: 'Aluminum Rails',
      specification: '14ft length, Mill finish',
      category: 'Mounting Hardware (Roof)',
      quantity: railsCount,
      unit: 'rails',
      unitCost: 48,
    },
    {
      id: 'mat-mount-2',
      name: 'L-Foot Brackets',
      specification: 'With lag bolts & flashing',
      category: 'Mounting Hardware (Roof)',
      quantity: lFeetCount,
      unit: 'brackets',
      unitCost: 8.5,
    },
    {
      id: 'mat-mount-3',
      name: 'Mid Clamps',
      specification: '35mm frame height',
      category: 'Mounting Hardware (Roof)',
      quantity: midClampsCount,
      unit: 'clamps',
      unitCost: 4.25,
    },
    {
      id: 'mat-mount-4',
      name: 'End Clamps',
      specification: '35mm frame height',
      category: 'Mounting Hardware (Roof)',
      quantity: endClampsCount,
      unit: 'clamps',
      unitCost: 4.5,
    },
  ];

  const totalEstimatedCost = materials.reduce(
    (acc, item) => acc + item.quantity * item.unitCost,
    0
  );

  const totalItemsCount = materials.reduce((acc, item) => acc + (item.unit === 'ft' ? 1 : item.quantity), 0);

  return {
    dailyLoadKWh: +dailyLoadKWh.toFixed(1),
    peakSimultaneousWatts,
    solarArrayCapacityKW: actualArrayKW,
    panelCount,
    panelRatingW,
    batteryCapacityAh,
    batteryCapacityKWh: +totalBatteryKWhNeeded.toFixed(1),
    batteryUnitsCount,
    batteryUnitSpec,
    batteryVoltage: systemVoltage,
    dodPercentage,
    inverterContinuousWatts,
    inverterSurgeWatts,
    batteryInterconnectGauge,
    mainDcBreakerAmps,
    pvWireGauge,
    pvWireLengthFt,
    materials,
    totalEstimatedCost: Math.round(totalEstimatedCost),
    totalItemsCount,
  };
}
