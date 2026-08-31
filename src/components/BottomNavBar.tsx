import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-2 bg-surface border-t border-outline-variant z-50 md:hidden transition-transform duration-150 shadow-md">
      {/* Tab 1: Loads */}
      <button
        id="mobile-tab-loads"
        onClick={() => setActiveTab('loads')}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          activeTab === 'loads'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-5 py-1.5 scale-100 shadow-xs'
            : 'text-on-surface-variant hover:bg-surface-container-high px-4 py-1 rounded-lg'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'loads' ? 'fill-1 font-bold' : ''
          }`}
        >
          electric_bolt
        </span>
        <span className="text-[12px] font-bold tracking-wider uppercase mt-0.5">Loads</span>
      </button>

      {/* Tab 2: Sizing */}
      <button
        id="mobile-tab-sizing"
        onClick={() => setActiveTab('sizing')}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          activeTab === 'sizing'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-5 py-1.5 scale-100 shadow-xs'
            : 'text-on-surface-variant hover:bg-surface-container-high px-4 py-1 rounded-lg'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'sizing' ? 'fill-1 font-bold' : ''
          }`}
        >
          wb_sunny
        </span>
        <span className="text-[12px] font-bold tracking-wider uppercase mt-0.5">Sizing</span>
      </button>

      {/* Tab 3: Materials */}
      <button
        id="mobile-tab-materials"
        onClick={() => setActiveTab('materials')}
        className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
          activeTab === 'materials'
            ? 'bg-secondary-container text-on-secondary-container rounded-full px-5 py-1.5 scale-100 shadow-xs'
            : 'text-on-surface-variant hover:bg-surface-container-high px-4 py-1 rounded-lg'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'materials' ? 'fill-1 font-bold' : ''
          }`}
        >
          inventory_2
        </span>
        <span className="text-[12px] font-bold tracking-wider uppercase mt-0.5">Materials</span>
      </button>
    </nav>
  );
};
