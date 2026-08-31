import React, { useState, useEffect } from 'react';
import { Appliance } from '../types';

interface EditApplianceModalProps {
  isOpen: boolean;
  appliance: Appliance | null;
  onClose: () => void;
  onSave: (appliance: Appliance) => void;
}

export const EditApplianceModal: React.FC<EditApplianceModalProps> = ({
  isOpen,
  appliance,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [powerWatts, setPowerWatts] = useState<string>('');
  const [hoursPerDay, setHoursPerDay] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [icon, setIcon] = useState('devices');

  useEffect(() => {
    if (appliance) {
      setName(appliance.name);
      setPowerWatts(appliance.powerWatts.toString());
      setHoursPerDay(appliance.hoursPerDay.toString());
      setQuantity(appliance.quantity || 1);
      setIcon(appliance.icon || 'devices');
    }
  }, [appliance]);

  if (!isOpen || !appliance) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const watts = parseFloat(powerWatts);
    const hours = parseFloat(hoursPerDay);

    if (isNaN(watts) || watts <= 0 || isNaN(hours) || hours <= 0) return;

    onSave({
      ...appliance,
      name: name.trim(),
      powerWatts: watts,
      hoursPerDay: hours,
      quantity: quantity || 1,
      icon,
    });
    onClose();
  };

  const icons = [
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Light', value: 'lightbulb' },
    { label: 'TV', value: 'tv' },
    { label: 'AC', value: 'ac_unit' },
    { label: 'Laundry', value: 'local_laundry_service' },
    { label: 'Fan', value: 'mode_fan' },
    { label: 'Laptop', value: 'laptop' },
    { label: 'Water Pump', value: 'water_drop' },
    { label: 'General', value: 'devices' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-surface-container-high mb-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">edit</span>
            <h2 className="text-xl font-bold">Edit Appliance</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">Appliance Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-outline rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Power (Watts)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={powerWatts}
                onChange={(e) => setPowerWatts(e.target.value)}
                className="border border-outline rounded p-2 text-sm font-mono text-on-surface focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Hours/Day</label>
              <input
                type="number"
                min="0.1"
                max="24"
                step="0.1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="border border-outline rounded p-2 text-sm font-mono text-on-surface focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Quantity</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="border border-outline rounded p-2 text-sm font-mono text-on-surface focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="border border-outline rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none bg-surface-container-lowest"
              >
                {icons.map((ic) => (
                  <option key={ic.value} value={ic.value}>
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low rounded text-xs text-on-surface-variant font-mono flex justify-between">
            <span>Calculated Daily:</span>
            <span className="font-bold text-primary">
              {((parseFloat(powerWatts) || 0) * (parseFloat(hoursPerDay) || 0) * quantity / 1000).toFixed(2)} kWh/day
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline rounded text-sm text-on-surface hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary font-bold rounded text-sm hover:bg-primary-container shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
