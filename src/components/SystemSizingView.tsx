import React from 'react';
import { SystemParameters, SystemSizingResult } from '../types';

interface SystemSizingViewProps {
  sizingResult: SystemSizingResult;
  params: SystemParameters;
  onUpdateParams: (newParams: Partial<SystemParameters>) => void;
  onOpenLocationModal: () => void;
  onGenerateMaterials: () => void;
  onBackToLoads: () => void;
}

export const SystemSizingView: React.FC<SystemSizingViewProps> = ({
  sizingResult,
  params,
  onUpdateParams,
  onOpenLocationModal,
  onGenerateMaterials,
  onBackToLoads,
}) => {
  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-6 pb-32 md:pb-12 flex flex-col">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
            System Sizing Recommendations
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            Based on your calculated load profile of{' '}
            <span className="font-mono font-bold text-primary">
              {sizingResult.dailyLoadKWh.toFixed(1)} kWh/day
            </span>
            .
          </p>
        </div>

        <button
          onClick={onBackToLoads}
          className="self-start md:self-auto text-xs md:text-sm font-semibold text-primary hover:text-on-surface-variant flex items-center gap-1 border border-outline-variant rounded px-3 py-1.5 bg-surface-container-lowest transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>Edit Loads</span>
        </button>
      </div>

      {/* Location & Sun Hours Section */}
      <section
        id="location-sun-hours-card"
        className="mb-6 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 shadow-xs"
      >
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-container-high">
          <div className="p-2 bg-primary-container rounded text-on-primary-container">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface">Location &amp; Sun Hours</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          {/* Map Image */}
          <div className="w-full md:w-1/2 h-44 md:h-48 rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low relative group">
            <img
              alt="Solar irradiation map"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJXObuSxbqc_oXkq4E3kiEpFIFDye3ZC2gEL4fbKIbvOEpeeUzLnNVJLu7IZx343CQlJ8jBqSuln2XebVTOPk1V6CP2jC3sdtcUI4UHOmMOqj8l9PZRBxIMdCXxd5VGLtS-oIBR_7UT3CuqH1rQ6rAxXvFhgWS1K98LmxKsr55Pr5tOblTWSg66-XztquFE9YDxOlr0k97HdqZSdkDC8cjVaZ9j_Hiy3YWXt-k9mOf_phQV4Phb7YG-g"
            />
            <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono text-on-surface border border-outline-variant">
              Solar Insolation Map
            </div>
          </div>

          {/* Details & Update Button */}
          <div className="flex-grow flex flex-col justify-between py-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Average Peak Sun Hours
                </div>
                <div className="font-mono text-primary text-xl md:text-2xl font-bold">
                  {params.location.peakSunHours} hrs/day
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  Daily solar generation window
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Location
                </div>
                <div className="text-lg md:text-xl font-bold text-on-surface">
                  {params.location.city}, {params.location.stateOrCountry}
                </div>
                <div className="text-xs text-on-surface-variant mt-1 truncate">
                  {params.location.zone}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-surface-container-high flex flex-wrap gap-2 items-center justify-between">
              <button
                id="update-location-btn"
                onClick={onOpenLocationModal}
                className="w-full sm:w-auto border border-outline text-primary hover:bg-surface-container-low transition-colors duration-200 px-4 py-2 rounded font-semibold text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit_location_alt</span>
                <span>Update Location</span>
              </button>
              <span className="text-xs text-on-surface-variant">
                Derate factor: {(params.derateFactor * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Metric: Backup Autonomy Card */}
      <section
        id="backup-autonomy-card"
        className="mb-6 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 shadow-xs"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-container">
                timelapse
              </span>
              <span>Estimated Backup Autonomy</span>
            </h2>
            <div className="text-4xl md:text-5xl font-bold text-primary flex items-baseline gap-2">
              {params.autonomyDays}{' '}
              <span className="text-lg md:text-xl font-normal text-on-surface-variant">Days</span>
            </div>
            <p className="text-xs md:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Sustained critical load operation without solar input (Depth of Discharge limited to{' '}
              {sizingResult.dodPercentage}%).
            </p>

            {/* Quick Autonomy Selector */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="font-bold text-on-surface-variant uppercase">Autonomy:</span>
              {[1, 2, 2.5, 3, 4].map((days) => (
                <button
                  key={days}
                  onClick={() => onUpdateParams({ autonomyDays: days })}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                    params.autonomyDays === days
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Technical Diagram */}
          <div className="w-full md:w-72 h-36 md:h-32 rounded bg-surface-container-low border border-outline flex items-center justify-center overflow-hidden relative shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-85 mix-blend-multiply hover:scale-105 transition-transform duration-300"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwsN67GNAjgs0nXcHAzC75KD6xaQtP7QAf3jmsOJELKCIsGWa8DBo-1cHnIbOgA6gld9hN8n2CFa6ixg90AFjvsDVh6XLNZMY4zWn_H2ca-iZB-x5DwaNhhoyBgBRWmWHX5g_l7MmnZEdat6WZQ5rB5QCjqS_QGD6VCxSn_brUxvJd3oc54wOiVXSQrovWu65I1V9HKrVogh-wBJrRinjLrI41SjXJxOfQ9HUhwhzas964Pwtf3XW5Rw')`,
              }}
            />
            <div className="absolute top-1 right-1 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded text-[10px] font-mono text-primary border border-outline-variant">
              Schematic S-101
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid for Technical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Solar Array Sizing */}
        <div
          id="solar-array-spec-card"
          className="md:col-span-6 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 hover:border-primary transition-colors duration-200 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-container-high">
              <div className="p-2 bg-primary-container rounded text-on-primary-container">
                <span className="material-symbols-outlined text-[20px]">solar_power</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Solar Array</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Total Capacity Required
                </div>
                <div className="font-mono text-primary text-xl font-bold">
                  {sizingResult.solarArrayCapacityKW.toFixed(2)} kW
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded border border-surface-container-high">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Panel Configuration
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface">Quantity</span>
                  <span className="font-mono text-primary font-bold text-base">
                    {sizingResult.panelCount}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                  <span className="text-sm text-on-surface">Rating per Panel</span>
                  <span className="font-mono text-on-surface-variant">
                    {sizingResult.panelRatingW}W
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container-high flex justify-between text-xs text-on-surface-variant">
            <span>Roof Area Est:</span>
            <span className="font-mono font-medium text-on-surface">
              ~{(sizingResult.panelCount * 21).toFixed(0)} sq ft
            </span>
          </div>
        </div>

        {/* Battery Bank Sizing */}
        <div
          id="battery-bank-spec-card"
          className="md:col-span-6 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 hover:border-primary transition-colors duration-200 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-container rounded text-on-primary-container">
                  <span className="material-symbols-outlined text-[20px]">
                    battery_charging_full
                  </span>
                </div>
                <h3 className="text-lg font-bold text-on-surface">Battery Bank</h3>
              </div>

              {/* Battery chemistry toggle */}
              <div className="flex rounded border border-outline-variant overflow-hidden text-[10px] font-bold uppercase">
                <button
                  onClick={() => onUpdateParams({ batteryType: 'lead-acid' })}
                  className={`px-2 py-1 ${
                    params.batteryType === 'lead-acid'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  AGM
                </button>
                <button
                  onClick={() => onUpdateParams({ batteryType: 'lifepo4' })}
                  className={`px-2 py-1 ${
                    params.batteryType === 'lifepo4'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  LiFePO4
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Total Capacity
                  </div>
                  <div className="font-mono text-primary text-xl font-bold">
                    {sizingResult.batteryCapacityAh} Ah
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    System Voltage
                  </div>
                  <div className="font-mono text-on-surface-variant font-bold">
                    {sizingResult.batteryVoltage}V DC
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded border border-surface-container-high relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 h-1 bg-tertiary-container"
                  style={{ width: `${sizingResult.dodPercentage}%` }}
                />
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex justify-between">
                  <span>
                    Unit Configuration ({params.batteryType === 'lifepo4' ? 'Lithium' : 'Lead-Acid'})
                  </span>
                  <span className="text-[10px] text-tertiary-container font-mono">
                    {sizingResult.dodPercentage}% DoD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface">Quantity</span>
                  <span className="font-mono text-primary font-bold text-base">
                    {sizingResult.batteryUnitsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                  <span className="text-sm text-on-surface">Rating per Unit</span>
                  <span className="font-mono text-on-surface-variant text-xs">
                    {sizingResult.batteryUnitSpec}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container-high flex justify-between text-xs text-on-surface-variant">
            <span>Storage Total:</span>
            <span className="font-mono font-medium text-on-surface">
              {sizingResult.batteryCapacityKWh} kWh Gross
            </span>
          </div>
        </div>

        {/* Inverter & Cabling (Combined for layout density) */}
        <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Inverter */}
          <div
            id="inverter-spec-card"
            className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-lg p-5 hover:border-primary transition-colors duration-200 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-primary text-[20px]">
                electric_meter
              </span>
              <h3 className="text-lg font-bold text-on-surface">Inverter Sizing</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Continuous
                </div>
                <div className="font-mono text-primary font-bold text-base">
                  {sizingResult.inverterContinuousWatts} W
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Surge (Peak)
                </div>
                <div className="font-mono text-primary font-bold text-base">
                  {sizingResult.inverterSurgeWatts} W
                </div>
              </div>
            </div>
          </div>

          {/* Cabling & Protection */}
          <div
            id="cabling-spec-card"
            className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-lg p-5 hover:border-primary transition-colors duration-200 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-surface-container-high">
              <span className="material-symbols-outlined text-primary text-[20px]">cable</span>
              <h3 className="text-lg font-bold text-on-surface">Cabling Minimums</h3>
            </div>
            <ul className="space-y-2.5">
              <li className="flex justify-between items-center text-sm">
                <span className="text-on-surface">Battery Interconnect</span>
                <span className="font-mono font-bold text-on-surface-variant">
                  {sizingResult.batteryInterconnectGauge}
                </span>
              </li>
              <li className="flex justify-between items-center text-sm border-t border-surface-container-high pt-2">
                <span className="text-on-surface">Main DC Breaker</span>
                <span className="font-mono font-bold text-on-surface-variant">
                  {sizingResult.mainDcBreakerAmps} A
                </span>
              </li>
              <li className="flex justify-between items-center text-sm border-t border-surface-container-high pt-2">
                <span className="text-on-surface">PV Array Homerun</span>
                <span className="font-mono font-bold text-on-surface-variant">
                  {sizingResult.pvWireGauge}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-auto pt-6 flex justify-end">
        <button
          id="generate-materials-btn"
          onClick={onGenerateMaterials}
          className="w-full md:w-auto bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors duration-200 px-8 py-4 rounded font-bold text-base md:text-lg shadow-[0_4px_14px_rgba(252,212,0,0.25)] flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span>Generate Materials List</span>
        </button>
      </div>
    </main>
  );
};
