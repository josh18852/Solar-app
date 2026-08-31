import React from 'react';
import { Appliance, CurrencyConfig, SystemParameters, SystemSizingResult } from '../types';
import { formatCurrency } from '../data/currencies';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizingResult: SystemSizingResult;
  params: SystemParameters;
  appliances: Appliance[];
  currency: CurrencyConfig;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  sizingResult,
  params,
  appliances,
  currency,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-3xl w-full p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex justify-between items-center pb-4 border-b border-surface-container-high mb-6 no-print">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
            <div>
              <h2 className="text-xl font-bold">Solar System Engineering Specification Report</h2>
              <p className="text-xs text-on-surface-variant">
                Currency: <span className="font-semibold text-primary">{currency.flag} {currency.name} ({currency.code})</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed font-bold text-xs md:text-sm px-4 py-2 rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="bg-white text-black p-4 md:p-6 border border-gray-200 rounded-md print:border-none print:p-0">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-[#192830] pb-4 mb-6">
            <div>
              <div className="text-2xl font-bold text-[#192830] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#705d00]">solar_power</span>
                <span>SOLAR PLANNER SPECIFICATION REPORT</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Project generated on {new Date().toLocaleDateString()} • System Size:{' '}
                {sizingResult.solarArrayCapacityKW} kW PV Array • Currency: {currency.code} ({currency.symbol})
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#192830]">
                {params.location.city}, {params.location.stateOrCountry}
              </div>
              <div className="text-xs text-gray-600 font-mono">
                {params.location.peakSunHours} Peak Sun Hours/day
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded mb-6 border border-gray-200">
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500">Daily Load Profile</div>
              <div className="text-lg font-bold font-mono text-[#192830]">
                {sizingResult.dailyLoadKWh.toFixed(1)} kWh/day
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500">Solar Array Size</div>
              <div className="text-lg font-bold font-mono text-[#192830]">
                {sizingResult.solarArrayCapacityKW} kW ({sizingResult.panelCount} panels)
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500">Battery Storage</div>
              <div className="text-lg font-bold font-mono text-[#192830]">
                {sizingResult.batteryCapacityAh} Ah @ {sizingResult.batteryVoltage}V
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500">Inverter Rating</div>
              <div className="text-lg font-bold font-mono text-[#192830]">
                {sizingResult.inverterContinuousWatts}W / {sizingResult.inverterSurgeWatts}W Peak
              </div>
            </div>
          </div>

          {/* Connected Loads Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 border-b border-gray-200 pb-1">
              1. Load Profile Breakdown ({appliances.length} Appliances)
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-semibold">
                  <th className="p-2 border-b">Appliance</th>
                  <th className="p-2 border-b">Power (W)</th>
                  <th className="p-2 border-b">Hours/Day</th>
                  <th className="p-2 border-b">Qty</th>
                  <th className="p-2 border-b text-right">Daily Energy (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100">
                    <td className="p-2 font-medium">{app.name}</td>
                    <td className="p-2 font-mono">{app.powerWatts}W</td>
                    <td className="p-2 font-mono">{app.hoursPerDay}h</td>
                    <td className="p-2 font-mono">{app.quantity}</td>
                    <td className="p-2 font-mono text-right">
                      {((app.powerWatts * app.hoursPerDay * (app.quantity || 1)) / 1000).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bill of Materials Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 border-b border-gray-200 pb-1">
              2. Complete Bill of Materials (BOM) — in {currency.name} ({currency.code})
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-semibold">
                  <th className="p-2 border-b">Category</th>
                  <th className="p-2 border-b">Item &amp; Specification</th>
                  <th className="p-2 border-b">Qty</th>
                  <th className="p-2 border-b">Unit Price ({currency.symbol})</th>
                  <th className="p-2 border-b text-right">Subtotal ({currency.symbol})</th>
                </tr>
              </thead>
              <tbody>
                {sizingResult.materials.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-2 font-medium text-gray-600">{item.category}</td>
                    <td className="p-2">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-[11px] text-gray-500">{item.specification}</div>
                    </td>
                    <td className="p-2 font-mono">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 font-mono">{formatCurrency(item.unitCost, currency)}</td>
                    <td className="p-2 font-mono text-right font-semibold">
                      {formatCurrency(item.quantity * item.unitCost, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={4} className="p-2 text-right">
                    TOTAL ESTIMATED COST ({currency.code}):
                  </td>
                  <td className="p-2 text-right font-mono text-sm text-[#192830]">
                    {formatCurrency(sizingResult.totalEstimatedCost, currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Engineering Notes & Footnotes */}
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-[11px] text-gray-600 space-y-1">
            <div className="font-bold text-gray-800">System Engineering Notes:</div>
            <p>• Autonomy: Configured for {params.autonomyDays} days with {sizingResult.dodPercentage}% Depth of Discharge limit.</p>
            <p>• Battery Interconnect: {sizingResult.batteryInterconnectGauge} copper wire with {sizingResult.mainDcBreakerAmps}A DC main disconnect.</p>
            <p>• PV Homerun Cabling: {sizingResult.pvWireGauge} dual-conductor UV-resistant PV wire rated for outdoor exposed conduit.</p>
            <p>• Currency Conversion: All prices estimated at {currency.rate} {currency.code} per 1.00 USD base pricing index.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
