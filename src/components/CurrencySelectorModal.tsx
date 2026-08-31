import React, { useState } from 'react';
import { CurrencyConfig } from '../types';
import { SUPPORTED_CURRENCIES } from '../data/currencies';

interface CurrencySelectorModalProps {
  isOpen: boolean;
  currentCurrency: CurrencyConfig;
  onClose: () => void;
  onSelectCurrency: (currency: CurrencyConfig) => void;
  onUpdateRate?: (code: string, newRate: number) => void;
}

export const CurrencySelectorModal: React.FC<CurrencySelectorModalProps> = ({
  isOpen,
  currentCurrency,
  onClose,
  onSelectCurrency,
  onUpdateRate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Africa' | 'Americas' | 'Europe' | 'Asia/ME'>('All');
  const [customRate, setCustomRate] = useState<string>(currentCurrency.rate.toString());
  const [isEditingRate, setIsEditingRate] = useState(false);

  if (!isOpen) return null;

  const categoryMap: Record<string, string[]> = {
    Africa: ['NGN', 'ZAR', 'KES', 'GHS', 'EGP'],
    Americas: ['USD', 'CAD', 'BRL'],
    Europe: ['EUR', 'GBP'],
    'Asia/ME': ['AED', 'INR', 'JPY', 'CNY', 'PHP'],
  };

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter((curr) => {
    const matchesSearch =
      curr.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;

    return categoryMap[selectedCategory]?.includes(curr.code);
  });

  const handleSelect = (curr: CurrencyConfig) => {
    onSelectCurrency(curr);
    setCustomRate(curr.rate.toString());
    setIsEditingRate(false);
    onClose();
  };

  const handleSaveCustomRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = parseFloat(customRate);
    if (!isNaN(rateVal) && rateVal > 0) {
      const updatedCurrency: CurrencyConfig = {
        ...currentCurrency,
        rate: rateVal,
      };
      if (onUpdateRate) {
        onUpdateRate(currentCurrency.code, rateVal);
      }
      onSelectCurrency(updatedCurrency);
      setIsEditingRate(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-surface-container-high mb-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">payments</span>
            <div>
              <h2 className="text-xl font-bold">Select System Currency</h2>
              <p className="text-xs text-on-surface-variant">
                Active: <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container-low"
            aria-label="Close currency modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search currency (e.g. Naira, NGN, USD, Euro, Rand)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low border border-outline rounded-lg focus:outline-none focus:border-primary text-on-surface"
              autoFocus
            />
          </div>

          {/* Region Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['All', 'Africa', 'Americas', 'Europe', 'Asia/ME'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Currency List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 flex-grow max-h-64 mb-4">
          {filteredCurrencies.map((curr) => {
            const isSelected = curr.code === currentCurrency.code;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => handleSelect(curr)}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{curr.flag}</span>
                  <div className="truncate">
                    <div className="font-bold text-xs text-on-surface truncate flex items-center gap-1.5">
                      <span>{curr.code}</span>
                      <span className="text-[11px] font-mono text-primary bg-surface-container-high px-1 rounded">
                        {curr.symbol}
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant truncate">{curr.name}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[10px] text-on-surface-variant">Rate vs USD</div>
                  <div className="font-mono text-xs font-semibold text-primary">
                    {curr.rate === 1 ? '1.00' : curr.rate > 10 ? curr.rate.toLocaleString() : curr.rate.toFixed(2)}
                  </div>
                </div>
              </button>
            );
          })}
          {filteredCurrencies.length === 0 && (
            <div className="col-span-2 text-center py-6 text-xs text-on-surface-variant">
              No currencies match "{searchQuery}"
            </div>
          )}
        </div>

        {/* Exchange Rate Customizer Footer */}
        <div className="pt-3 border-t border-surface-container-high bg-surface-container-low/50 -mx-6 -mb-6 p-4 rounded-b-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-on-surface">
              Exchange Rate for {currentCurrency.flag} {currentCurrency.code}
            </span>
            <button
              type="button"
              onClick={() => setIsEditingRate(!isEditingRate)}
              className="text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>{isEditingRate ? 'Close rate editor' : 'Customize rate'}</span>
            </button>
          </div>

          {isEditingRate ? (
            <form onSubmit={handleSaveCustomRate} className="flex gap-2 items-center">
              <div className="text-xs text-on-surface-variant whitespace-nowrap">1 USD =</div>
              <input
                type="number"
                step="any"
                min="0.0001"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="flex-grow bg-surface-container-lowest border border-outline rounded p-1.5 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                required
              />
              <span className="text-xs font-bold text-primary">{currentCurrency.code}</span>
              <button
                type="submit"
                className="bg-primary text-on-primary text-xs px-3 py-1.5 rounded font-bold hover:bg-primary-container"
              >
                Apply
              </button>
            </form>
          ) : (
            <div className="text-[11px] text-on-surface-variant flex justify-between items-center">
              <span>
                1.00 USD = <strong className="font-mono text-primary">{currentCurrency.symbol}{currentCurrency.rate.toLocaleString()} {currentCurrency.code}</strong>
              </span>
              <span className="text-[10px] opacity-75">All components convert live</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
