import React, { useState } from 'react';
import { CurrencyConfig, MaterialItem, SystemSizingResult } from '../types';
import { convertToUsd, formatCurrency } from '../data/currencies';

interface BillOfMaterialsViewProps {
  sizingResult: SystemSizingResult;
  currency: CurrencyConfig;
  onOpenCurrencyModal: () => void;
  onExportPdf: () => void;
  onSaveProject: () => void;
  onUpdateMaterialItem: (updatedItem: MaterialItem) => void;
  onAddCustomItem: (newItem: Omit<MaterialItem, 'id'>) => void;
}

export const BillOfMaterialsView: React.FC<BillOfMaterialsViewProps> = ({
  sizingResult,
  currency,
  onOpenCurrencyModal,
  onExportPdf,
  onSaveProject,
  onUpdateMaterialItem: _onUpdateMaterialItem,
  onAddCustomItem,
}) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSpec, setCustomSpec] = useState('');
  const [customQty, setCustomQty] = useState<number>(1);
  const [customCostInCurrency, setCustomCostInCurrency] = useState<string>('50');
  const [customCategory, setCustomCategory] = useState<MaterialItem['category']>('Custom Components');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const enteredAmount = parseFloat(customCostInCurrency) || 0;
    // Convert from current active currency back to base USD storage
    const costInUsd = convertToUsd(enteredAmount, currency);

    onAddCustomItem({
      name: customName.trim(),
      specification: customSpec.trim() || 'Custom Added Material',
      category: customCategory,
      quantity: customQty || 1,
      unit: 'items',
      unitCost: costInUsd,
    });

    setCustomName('');
    setCustomSpec('');
    setCustomQty(1);
    setCustomCostInCurrency('50');
    setShowAddCustom(false);
  };

  const categories: Array<MaterialItem['category']> = [
    'Solar Panels',
    'Battery Bank',
    'Power Electronics',
    'Wiring & Fuses',
    'Mounting Hardware (Roof)',
  ];

  // Group items
  const itemsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = sizingResult.materials.filter((m) => m.category === cat);
    return acc;
  }, {} as Record<MaterialItem['category'], MaterialItem[]>);

  const customItems = sizingResult.materials.filter(
    (m) => !categories.includes(m.category as any) || m.category === 'Custom Components'
  );

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6 pb-32 md:pb-12 flex-grow">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
              Bill of Materials
            </h1>
            <button
              onClick={onOpenCurrencyModal}
              className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant bg-surface-container-low hover:bg-surface-container-high text-xs font-semibold text-primary transition-colors cursor-pointer"
              title="Change Currency"
            >
              <span>{currency.flag}</span>
              <span>{currency.code}</span>
              <span className="text-on-surface-variant font-mono">({currency.symbol})</span>
            </button>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant">
            Complete required component list for{' '}
            <span className="font-semibold text-primary">
              {sizingResult.solarArrayCapacityKW.toFixed(1)}kW
            </span>{' '}
            Solar Power System.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            id="export-pdf-btn"
            onClick={onExportPdf}
            className="flex-1 md:flex-none border border-primary text-primary font-semibold text-sm md:text-base px-5 py-2.5 rounded flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            <span>Export Spec PDF</span>
          </button>
          <button
            id="save-project-btn"
            onClick={onSaveProject}
            className="flex-1 md:flex-none bg-primary text-on-primary font-semibold text-sm md:text-base px-5 py-2.5 rounded flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Save Project</span>
          </button>
        </div>
      </div>

      {/* Summary Glass Panel */}
      <div
        id="bom-summary-glass-panel"
        className="glass-panel p-5 md:p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-xs border border-outline-variant rounded-xl bg-surface-container-lowest"
      >
        <div className="flex gap-6 md:gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                TOTAL ESTIMATED COST
              </p>
              <button
                onClick={onOpenCurrencyModal}
                className="text-[10px] text-primary hover:underline font-mono"
              >
                [{currency.code}]
              </button>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono tracking-tight">
              {formatCurrency(sizingResult.totalEstimatedCost, currency)}
            </p>
          </div>

          <div className="w-px bg-outline-variant hidden md:block" />

          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              TOTAL ITEMS
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono">
              {sizingResult.totalItemsCount}
            </p>
          </div>

          <div className="w-px bg-outline-variant hidden md:block" />

          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              SYSTEM CAPACITY
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono">
              {sizingResult.solarArrayCapacityKW.toFixed(1)} kW
            </p>
          </div>
        </div>

        {/* Currency badge pill */}
        <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-surface-container-high gap-1">
          <span className="text-xs text-on-surface-variant">Active Currency</span>
          <button
            onClick={onOpenCurrencyModal}
            className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-high px-3 py-1.5 rounded-lg text-xs font-semibold text-primary border border-outline-variant cursor-pointer transition-colors"
          >
            <span>{currency.flag}</span>
            <span>{currency.name} ({currency.code})</span>
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
          </button>
        </div>
      </div>

      {/* Materials Bento Grid */}
      <div className="bento-grid">
        {/* Category: Solar Panels */}
        <div
          id="category-solar-panels"
          className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5 md:p-6 shadow-xs hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-surface-variant pb-3">
            <div className="bg-surface-container-low p-2 rounded text-primary">
              <span className="material-symbols-outlined text-[20px]">solar_power</span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-primary">Solar Panels</h2>
          </div>

          <div className="space-y-4">
            {itemsByCategory['Solar Panels']?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="text-sm md:text-base font-semibold text-on-background">
                    {item.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{item.specification}</p>
                  <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                    Est. {formatCurrency(item.unitCost, currency)}/unit • {formatCurrency(item.quantity * item.unitCost, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: Batteries */}
        <div
          id="category-battery-bank"
          className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5 md:p-6 shadow-xs hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-surface-variant pb-3">
            <div className="bg-surface-container-low p-2 rounded text-primary">
              <span className="material-symbols-outlined text-[20px]">battery_charging_full</span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-primary">Battery Bank</h2>
          </div>

          <div className="space-y-4">
            {itemsByCategory['Battery Bank']?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="text-sm md:text-base font-semibold text-on-background">
                    {item.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{item.specification}</p>
                  <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                    Est. {formatCurrency(item.unitCost, currency)}/unit • {formatCurrency(item.quantity * item.unitCost, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: Inverter / Charge Controller */}
        <div
          id="category-power-electronics"
          className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5 md:p-6 shadow-xs hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-surface-variant pb-3">
            <div className="bg-surface-container-low p-2 rounded text-primary">
              <span className="material-symbols-outlined text-[20px]">power</span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-primary">Power Electronics</h2>
          </div>

          <div className="space-y-4">
            {itemsByCategory['Power Electronics']?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="text-sm md:text-base font-semibold text-on-background">
                    {item.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{item.specification}</p>
                  <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                    Est. {formatCurrency(item.unitCost, currency)}/unit • {formatCurrency(item.quantity * item.unitCost, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: Wiring & Fuses */}
        <div
          id="category-wiring-fuses"
          className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5 md:p-6 shadow-xs hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-surface-variant pb-3">
            <div className="bg-surface-container-low p-2 rounded text-primary">
              <span className="material-symbols-outlined text-[20px]">cable</span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-primary">Wiring &amp; Protection</h2>
          </div>

          <div className="space-y-4">
            {itemsByCategory['Wiring & Fuses']?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="text-sm md:text-base font-semibold text-on-background">
                    {item.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{item.specification}</p>
                  <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                    Est. {formatCurrency(item.unitCost, currency)}/{item.unit} • {formatCurrency(item.quantity * item.unitCost, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded">
                    Qty: {item.quantity} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: Mounting Hardware */}
        <div
          id="category-mounting-hardware"
          className="bg-surface-container-lowest border border-surface-variant rounded-lg p-5 md:p-6 shadow-xs hover:border-primary transition-colors sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-surface-variant pb-3">
            <div className="bg-surface-container-low p-2 rounded text-primary">
              <span className="material-symbols-outlined text-[20px]">construction</span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-primary">Roof Mounting Racks</h2>
          </div>

          <div className="space-y-4">
            {itemsByCategory['Mounting Hardware (Roof)']?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="text-sm md:text-base font-semibold text-on-background">
                    {item.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{item.specification}</p>
                  <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                    Est. {formatCurrency(item.unitCost, currency)}/{item.unit} • {formatCurrency(item.quantity * item.unitCost, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded">
                    Qty: {item.quantity} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Added Components */}
        {customItems.length > 0 && (
          <div className="bg-surface-container-lowest border border-primary/40 rounded-lg p-5 md:p-6 shadow-xs sm:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-3 mb-4 border-b border-surface-variant pb-3">
              <div className="bg-surface-container-low p-2 rounded text-primary">
                <span className="material-symbols-outlined text-[20px]">extension</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-primary">Custom Added Components</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-surface-container-low rounded border border-outline-variant flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm font-semibold text-on-background">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.specification}</p>
                    <p className="text-[11px] font-mono text-primary mt-1">
                      {formatCurrency(item.unitCost, currency)}/unit • Total: {formatCurrency(item.quantity * item.unitCost, currency)}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded shrink-0 ml-2">
                    Qty: {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Component Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-surface-container-low border border-outline-variant">
        <div>
          <span className="font-bold text-sm text-primary">Need specific local hardware or accessories?</span>
          <p className="text-xs text-on-surface-variant">
            Add custom combiner boxes, grounding rods, surge protectors, or conduit in {currency.code} ({currency.symbol}).
          </p>
        </div>
        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="border border-primary text-primary hover:bg-surface-container-highest px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {showAddCustom ? 'close' : 'add'}
          </span>
          <span>{showAddCustom ? 'Cancel' : 'Add Custom Item'}</span>
        </button>
      </div>

      {/* Add Custom Modal Form */}
      {showAddCustom && (
        <form
          onSubmit={handleAddCustom}
          className="mt-4 p-5 bg-surface-container-lowest border border-primary/40 rounded-lg shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">Item Name</label>
            <input
              type="text"
              placeholder="e.g. PV Combiner Box 4-String"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="border border-outline rounded p-2 text-xs"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">Specification</label>
            <input
              type="text"
              placeholder="e.g. 15A fuses, lightning surge arrestor"
              value={customSpec}
              onChange={(e) => setCustomSpec(e.target.value)}
              className="border border-outline rounded p-2 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">
              Quantity &amp; Cost ({currency.symbol} {currency.code})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={customQty}
                onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
                className="w-1/2 border border-outline rounded p-2 text-xs font-mono"
                placeholder="Qty"
              />
              <input
                type="number"
                min="0"
                step="any"
                value={customCostInCurrency}
                onChange={(e) => setCustomCostInCurrency(e.target.value)}
                className="w-1/2 border border-outline rounded p-2 text-xs font-mono"
                placeholder={`Cost in ${currency.code}`}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-semibold text-xs py-2.5 rounded hover:bg-primary-container transition-colors"
            >
              + Add to Bill of Materials
            </button>
          </div>
        </form>
      )}
    </main>
  );
};
