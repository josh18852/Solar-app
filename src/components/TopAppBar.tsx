import React from 'react';
import { ActiveTab, CurrencyConfig } from '../types';

interface TopAppBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentCurrency: CurrencyConfig;
  onOpenCurrencyModal: () => void;
  onOpenProjectModal: () => void;
  onOpenMenuModal: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  setActiveTab,
  currentCurrency,
  onOpenCurrencyModal,
  onOpenProjectModal,
  onOpenMenuModal,
}) => {
  return (
    <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant transition-colors duration-200 shadow-2xs">
      <div className="flex justify-between items-center h-16 px-4 md:px-6 w-full max-w-[1200px] mx-auto">
        {/* Leading / Brand */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            id="mobile-menu-btn"
            aria-label="Menu"
            onClick={onOpenMenuModal}
            className="p-2 -ml-2 text-primary hover:bg-surface-container-low rounded-full transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div
            onClick={() => setActiveTab('loads')}
            className="font-bold text-xl md:text-2xl text-primary tracking-tight cursor-pointer select-none flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-secondary-container text-[26px]">solar_power</span>
            <span>Solar Planner</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <button
            id="nav-tab-loads"
            onClick={() => setActiveTab('loads')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-sm flex items-center gap-2 ${
              activeTab === 'loads'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'loads' ? 'fill-1' : ''
              }`}
            >
              electric_bolt
            </span>
            <span>Loads</span>
          </button>

          <button
            id="nav-tab-sizing"
            onClick={() => setActiveTab('sizing')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-sm flex items-center gap-2 ${
              activeTab === 'sizing'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'sizing' ? 'fill-1' : ''
              }`}
            >
              wb_sunny
            </span>
            <span>Sizing</span>
          </button>

          <button
            id="nav-tab-materials"
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-sm flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-secondary-container text-on-secondary-container shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'materials' ? 'fill-1' : ''
              }`}
            >
              inventory_2
            </span>
            <span>Materials</span>
          </button>
        </nav>

        {/* Trailing Controls: Currency Selector & Projects */}
        <div className="flex items-center gap-2">
          {/* Currency Button */}
          <button
            id="currency-select-btn"
            type="button"
            onClick={onOpenCurrencyModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant hover:border-primary bg-surface-container-low text-xs font-semibold text-primary transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs"
            title={`Currency: ${currentCurrency.name} (${currentCurrency.code})`}
          >
            <span className="text-base">{currentCurrency.flag}</span>
            <span className="font-bold font-mono">{currentCurrency.code}</span>
            <span className="text-[11px] font-mono text-on-surface-variant">({currentCurrency.symbol})</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
          </button>

          {/* Project Manager Button */}
          <button
            id="account-projects-btn"
            aria-label="Project Manager"
            onClick={onOpenProjectModal}
            title="Projects & Save"
            className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors duration-200 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[24px]">folder_special</span>
          </button>
        </div>
      </div>
    </header>
  );
};
