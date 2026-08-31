import React from 'react';
import { ActiveTab, CurrencyConfig } from '../types';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentCurrency: CurrencyConfig;
  onOpenCurrencyModal: () => void;
  onOpenProjectModal: () => void;
  onOpenLocationModal: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  currentCurrency,
  onOpenCurrencyModal,
  onOpenProjectModal,
  onOpenLocationModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-72 max-w-[80vw] bg-surface-container-lowest border-r border-outline-variant shadow-2xl h-full flex flex-col p-5 z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-[26px]">
              solar_power
            </span>
            <span className="font-bold text-lg text-primary">Solar Planner</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation items */}
        <div className="py-4 space-y-1">
          <button
            onClick={() => {
              setActiveTab('loads');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'loads'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
            <span>1. Load Calculator</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('sizing');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'sizing'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
            <span>2. System Sizing</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('materials');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'materials'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span>3. Bill of Materials</span>
          </button>
        </div>

        {/* Quick Actions & Settings */}
        <div className="pt-3 border-t border-surface-container-high space-y-2">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            System &amp; Settings
          </span>

          <button
            onClick={() => {
              onClose();
              onOpenCurrencyModal();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-container-low rounded transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Currency</span>
            </div>
            <span className="bg-surface-container-high px-2 py-0.5 rounded text-[11px] font-mono font-bold">
              {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol})
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLocationModal();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-container-low rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit_location_alt</span>
            <span>Change Solar Region</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenProjectModal();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-container-low rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">folder_special</span>
            <span>Save / Load Projects</span>
          </button>
        </div>

        {/* Technical Reference Guide */}
        <div className="mt-auto pt-4 border-t border-surface-container-high text-[11px] text-on-surface-variant space-y-1.5">
          <span className="font-bold text-primary block">Engineering Rules of Thumb</span>
          <p>• Peak Sun Hours = Equivalent 1kW/m² direct solar irradiation.</p>
          <p>• LiFePO4 Lithium DoD supports 80% daily cycling safely.</p>
          <p>• Lead-Acid DoD is capped at 50% for battery longevity.</p>
        </div>
      </div>
    </div>
  );
};
