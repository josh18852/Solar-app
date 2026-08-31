import React, { useState } from 'react';
import { LocationData } from '../types';
import { POPULAR_LOCATIONS } from '../data/defaults';

interface LocationModalProps {
  isOpen: boolean;
  currentLocation: LocationData;
  onClose: () => void;
  onSave: (location: LocationData) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentLocation,
  onClose,
  onSave,
}) => {
  const [city, setCity] = useState(currentLocation.city);
  const [stateOrCountry, setStateOrCountry] = useState(currentLocation.stateOrCountry);
  const [peakSunHours, setPeakSunHours] = useState<string>(currentLocation.peakSunHours.toString());
  const [zone, setZone] = useState(currentLocation.zone);

  if (!isOpen) return null;

  const handleSelectPreset = (loc: LocationData) => {
    setCity(loc.city);
    setStateOrCountry(loc.stateOrCountry);
    setPeakSunHours(loc.peakSunHours.toString());
    setZone(loc.zone);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(peakSunHours);
    if (isNaN(hours) || hours <= 0 || hours > 10) return;

    onSave({
      city: city.trim() || 'Custom Location',
      stateOrCountry: stateOrCountry.trim() || 'Global',
      peakSunHours: hours,
      zone: zone.trim() || 'Custom Insolation Zone',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-surface-container-high mb-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">location_on</span>
            <h2 className="text-xl font-bold">Update Solar Location</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Popular Presets */}
        <div className="mb-5">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Popular Solar Regions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = loc.city === city && loc.stateOrCountry === stateOrCountry;
              return (
                <button
                  key={`${loc.city}-${loc.stateOrCountry}`}
                  type="button"
                  onClick={() => handleSelectPreset(loc)}
                  className={`text-left p-2 rounded border text-xs transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-on-primary font-semibold'
                      : 'border-outline-variant hover:border-primary bg-surface-container-lowest text-on-surface'
                  }`}
                >
                  <div className="font-semibold truncate">
                    {loc.city}, {loc.stateOrCountry}
                  </div>
                  <div className={`font-mono text-[11px] ${isSelected ? 'text-secondary-fixed' : 'text-on-surface-variant'}`}>
                    {loc.peakSunHours} hrs/day
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-3 border-t border-surface-container-high">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-outline rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">State / Country</label>
              <input
                type="text"
                value={stateOrCountry}
                onChange={(e) => setStateOrCountry(e.target.value)}
                className="border border-outline rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Peak Sun Hours (hrs/day)
              </label>
              <span className="text-xs font-mono font-bold text-primary">{peakSunHours} hrs</span>
            </div>
            <input
              type="number"
              min="1.0"
              max="9.0"
              step="0.1"
              value={peakSunHours}
              onChange={(e) => setPeakSunHours(e.target.value)}
              className="border border-outline rounded p-2 text-sm font-mono text-on-surface focus:border-primary focus:outline-none"
              required
            />
            <p className="text-[11px] text-on-surface-variant">
              The equivalent hours of 1000 W/m² irradiance your array receives on an average day.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline rounded text-sm text-on-surface hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-secondary-container text-on-secondary-container font-bold rounded text-sm hover:bg-secondary-fixed shadow-xs"
            >
              Apply Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
