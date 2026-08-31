import React, { useState } from 'react';
import { Appliance } from '../types';
import { PRESET_APPLIANCES } from '../data/defaults';
import { calculateApplianceDailyKWh, calculateTotalDailyLoadKWh } from '../utils/solarCalculations';

interface LoadCalculatorViewProps {
  appliances: Appliance[];
  onAddAppliance: (appliance: Omit<Appliance, 'id'>) => void;
  onEditAppliance: (appliance: Appliance) => void;
  onDeleteAppliance: (id: string) => void;
  onNext: () => void;
}

export const LoadCalculatorView: React.FC<LoadCalculatorViewProps> = ({
  appliances,
  onAddAppliance,
  onEditAppliance,
  onDeleteAppliance,
  onNext,
}) => {
  const [name, setName] = useState('');
  const [powerWatts, setPowerWatts] = useState<string>('');
  const [hoursPerDay, setHoursPerDay] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedIcon, setSelectedIcon] = useState('devices');
  const [errorMessage, setErrorMessage] = useState('');

  const totalDailyKWh = calculateTotalDailyLoadKWh(appliances);
  // Average US household uses ~29 kWh/day
  const percentageOfTypical = Math.min(Math.round((totalDailyKWh / 29.0) * 100), 100);

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PRESET_APPLIANCES.find((p) => p.name === e.target.value);
    if (selected) {
      setName(selected.name);
      setPowerWatts(selected.powerWatts.toString());
      setHoursPerDay(selected.hoursPerDay.toString());
      setSelectedIcon(selected.icon);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter an appliance name.');
      return;
    }
    const watts = parseFloat(powerWatts);
    const hours = parseFloat(hoursPerDay);

    if (isNaN(watts) || watts <= 0) {
      setErrorMessage('Please enter a valid power rating in Watts.');
      return;
    }
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      setErrorMessage('Hours per day must be between 0.1 and 24.');
      return;
    }

    setErrorMessage('');
    onAddAppliance({
      name: name.trim(),
      powerWatts: watts,
      hoursPerDay: hours,
      quantity: quantity || 1,
      icon: selectedIcon || 'devices',
    });

    // Reset form
    setName('');
    setPowerWatts('');
    setHoursPerDay('');
    setQuantity(1);
  };

  const getApplianceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'kitchen':
        return 'kitchen';
      case 'lightbulb':
        return 'lightbulb';
      case 'tv':
        return 'tv';
      case 'ac_unit':
        return 'ac_unit';
      case 'local_laundry_service':
        return 'local_laundry_service';
      case 'mode_fan':
        return 'mode_fan';
      case 'microwave':
        return 'microwave';
      case 'laptop':
        return 'laptop';
      case 'router':
        return 'router';
      case 'water_drop':
        return 'water_drop';
      case 'hot_tub':
        return 'hot_tub';
      case 'coffee_maker':
        return 'coffee_maker';
      default:
        return 'devices';
    }
  };

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-6 pb-[120px] md:pb-12 flex flex-col gap-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-1">Load Calculator</h1>
        <p className="text-sm md:text-base text-on-surface-variant">
          Estimate your daily energy needs to properly size your solar system.
        </p>
      </div>

      {/* Total Consumption Summary Card */}
      <section
        id="consumption-summary-card"
        className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 flex flex-col gap-2 shadow-xs relative overflow-hidden transition-all duration-200"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-secondary opacity-10 rounded-full -mr-10 -mt-10 pointer-events-none" />
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Daily Energy Consumption
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            {totalDailyKWh.toFixed(1)}
          </span>
          <span className="text-xl md:text-2xl font-semibold text-on-surface-variant">kWh</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(percentageOfTypical, 4)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs md:text-sm text-on-surface-variant">
            {percentageOfTypical}% of typical residential usage (29 kWh/day benchmark)
          </p>
          <span className="text-xs font-mono font-medium text-primary bg-surface-container-low px-2 py-0.5 rounded">
            {(totalDailyKWh * 30).toFixed(0)} kWh / mo
          </span>
        </div>
      </section>

      {/* Appliance List Section */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg md:text-xl font-bold text-on-surface">Appliances</h3>
          <span className="text-sm font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full">
            {appliances.length} {appliances.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-2.5">
          {appliances.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">playlist_add</span>
              <p className="font-semibold">No appliances in your list yet.</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Add an appliance below or pick a preset to calculate your solar load.
              </p>
            </div>
          ) : (
            appliances.map((app) => {
              const itemDailyKWh = calculateApplianceDailyKWh(app);
              return (
                <div
                  key={app.id}
                  id={`appliance-item-${app.id}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-center justify-between group hover:border-primary transition-all duration-200 shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {getApplianceIcon(app.icon)}
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-on-surface flex items-center gap-2">
                        <span>{app.name}</span>
                        {app.quantity > 1 && (
                          <span className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded font-mono text-on-surface-variant">
                            ×{app.quantity}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs md:text-sm text-on-surface-variant mt-0.5">
                        {app.powerWatts}W × {app.hoursPerDay}h
                        {app.quantity > 1 ? ` × ${app.quantity}` : ''} = {itemDailyKWh.toFixed(2)} kWh
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      id={`edit-appliance-${app.id}`}
                      aria-label={`Edit ${app.name}`}
                      onClick={() => onEditAppliance(app)}
                      className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors"
                      title="Edit Appliance"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      id={`delete-appliance-${app.id}`}
                      aria-label={`Delete ${app.name}`}
                      onClick={() => onDeleteAppliance(app.id)}
                      className="text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-error-container transition-colors"
                      title="Delete Appliance"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Appliance Inline Form */}
        <div
          id="add-appliance-section"
          className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg p-5 mt-2 transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
              <span className="font-bold text-base">Add New Appliance</span>
            </div>

            {/* Quick Presets Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Preset:</span>
              <select
                id="preset-appliance-select"
                onChange={handleSelectPreset}
                defaultValue=""
                className="bg-surface-container-low border border-outline-variant rounded text-xs px-2.5 py-1.5 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Choose a common appliance...
                </option>
                {PRESET_APPLIANCES.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.powerWatts}W, {p.hoursPerDay}h)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 bg-error-container text-on-error-container rounded text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Appliance Name
              </label>
              <input
                id="appliance-name-input"
                type="text"
                placeholder="e.g., Washing Machine"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-surface-container-lowest border border-outline rounded px-3.5 py-2 text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Power (Watts)
                </label>
                <input
                  id="appliance-watts-input"
                  type="number"
                  placeholder="0"
                  min="1"
                  step="1"
                  value={powerWatts}
                  onChange={(e) => setPowerWatts(e.target.value)}
                  className="bg-surface-container-lowest border border-outline rounded px-3.5 py-2 font-mono text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Hours/Day
                </label>
                <input
                  id="appliance-hours-input"
                  type="number"
                  placeholder="0"
                  min="0.1"
                  max="24"
                  step="0.1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="bg-surface-container-lowest border border-outline rounded px-3.5 py-2 font-mono text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Quantity
                </label>
                <input
                  id="appliance-qty-input"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="bg-surface-container-lowest border border-outline rounded px-3.5 py-2 font-mono text-sm md:text-base text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              id="add-appliance-btn"
              type="submit"
              className="bg-transparent border border-primary text-primary font-semibold text-sm md:text-base rounded py-2.5 px-4 hover:bg-surface-container-low transition-colors mt-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Add to List</span>
            </button>
          </form>
        </div>
      </section>

      {/* Primary Action Button */}
      <div className="mt-auto pt-6">
        <button
          id="next-size-system-btn"
          onClick={onNext}
          className="w-full bg-secondary-container text-on-secondary-container font-bold text-base md:text-lg rounded py-3.5 px-6 shadow-sm hover:opacity-95 transition-opacity flex justify-center items-center gap-2 cursor-pointer"
        >
          <span>Next: Size My System</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </main>
  );
};
