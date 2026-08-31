import { useState, useMemo, useEffect } from 'react';
import { ActiveTab, Appliance, CurrencyConfig, MaterialItem, SystemParameters } from './types';
import { DEFAULT_SYSTEM_PARAMETERS, INITIAL_APPLIANCES } from './data/defaults';
import { SUPPORTED_CURRENCIES } from './data/currencies';
import { calculateSystemSizing } from './utils/solarCalculations';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { LoadCalculatorView } from './components/LoadCalculatorView';
import { SystemSizingView } from './components/SystemSizingView';
import { BillOfMaterialsView } from './components/BillOfMaterialsView';
import { LocationModal } from './components/LocationModal';
import { EditApplianceModal } from './components/EditApplianceModal';
import { ExportPdfModal } from './components/ExportPdfModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { MenuDrawer } from './components/MenuDrawer';
import { CurrencySelectorModal } from './components/CurrencySelectorModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('loads');
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    try {
      const saved = localStorage.getItem('solar_planner_appliances');
      return saved ? JSON.parse(saved) : INITIAL_APPLIANCES;
    } catch {
      return INITIAL_APPLIANCES;
    }
  });

  const [params, setParams] = useState<SystemParameters>(() => {
    try {
      const saved = localStorage.getItem('solar_planner_params');
      return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_PARAMETERS;
    } catch {
      return DEFAULT_SYSTEM_PARAMETERS;
    }
  });

  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    try {
      const saved = localStorage.getItem('solar_planner_currency');
      return saved ? JSON.parse(saved) : SUPPORTED_CURRENCIES[0]; // Default to Nigerian Naira (NGN)
    } catch {
      return SUPPORTED_CURRENCIES[0];
    }
  });

  const [customMaterials, setCustomMaterials] = useState<MaterialItem[]>([]);

  // Modals state
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('solar_planner_appliances', JSON.stringify(appliances));
      localStorage.setItem('solar_planner_params', JSON.stringify(params));
      localStorage.setItem('solar_planner_currency', JSON.stringify(currency));
    } catch (e) {
      console.error(e);
    }
  }, [appliances, params, currency]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Perform solar calculations
  const sizingResult = useMemo(() => {
    const baseResult = calculateSystemSizing(appliances, params);
    if (customMaterials.length > 0) {
      const combinedMaterials = [...baseResult.materials, ...customMaterials];
      const newTotalCost = combinedMaterials.reduce(
        (acc, item) => acc + item.quantity * item.unitCost,
        0
      );
      const newTotalItems = combinedMaterials.reduce(
        (acc, item) => acc + (item.unit === 'ft' ? 1 : item.quantity),
        0
      );
      return {
        ...baseResult,
        materials: combinedMaterials,
        totalEstimatedCost: Math.round(newTotalCost),
        totalItemsCount: newTotalItems,
      };
    }
    return baseResult;
  }, [appliances, params, customMaterials]);

  // Handlers for Appliances
  const handleAddAppliance = (newApp: Omit<Appliance, 'id'>) => {
    const appliance: Appliance = {
      ...newApp,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setAppliances((prev) => [...prev, appliance]);
    showToast(`Added ${newApp.name}`);
  };

  const handleUpdateAppliance = (updated: Appliance) => {
    setAppliances((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    showToast(`Updated ${updated.name}`);
  };

  const handleDeleteAppliance = (id: string) => {
    const toDelete = appliances.find((a) => a.id === id);
    setAppliances((prev) => prev.filter((a) => a.id !== id));
    if (toDelete) {
      showToast(`Removed ${toDelete.name}`);
    }
  };

  // Handlers for System Parameters
  const handleUpdateParams = (newParams: Partial<SystemParameters>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleSelectCurrency = (newCurrency: CurrencyConfig) => {
    setCurrency(newCurrency);
    showToast(`Currency changed to ${newCurrency.flag} ${newCurrency.name} (${newCurrency.code})`);
  };

  const handleAddCustomMaterial = (newItem: Omit<MaterialItem, 'id'>) => {
    const item: MaterialItem = {
      ...newItem,
      id: `custom-mat-${Date.now()}`,
    };
    setCustomMaterials((prev) => [...prev, item]);
    showToast(`Added ${newItem.name} to BOM`);
  };

  const handleUpdateMaterialItem = (updated: MaterialItem) => {
    setCustomMaterials((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  const handleLoadProject = (
    newAppliances: Appliance[],
    newParams: SystemParameters,
    newCurrency?: CurrencyConfig
  ) => {
    setAppliances(newAppliances);
    setParams(newParams);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
    setCustomMaterials([]);
    showToast('Loaded project configuration successfully!');
  };

  const handleResetDefaults = () => {
    setAppliances(INITIAL_APPLIANCES);
    setParams(DEFAULT_SYSTEM_PARAMETERS);
    setCurrency(SUPPORTED_CURRENCIES[0]);
    setCustomMaterials([]);
    showToast('Reset back to demo defaults.');
  };

  // Scroll to top on tab change
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[18px] text-secondary-container">
            info
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <TopAppBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentCurrency={currency}
        onOpenCurrencyModal={() => setIsCurrencyModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenMenuModal={() => setIsMenuDrawerOpen(true)}
      />

      {/* Main View Switcher */}
      {activeTab === 'loads' && (
        <LoadCalculatorView
          appliances={appliances}
          onAddAppliance={handleAddAppliance}
          onEditAppliance={(app) => setEditingAppliance(app)}
          onDeleteAppliance={handleDeleteAppliance}
          onNext={() => handleTabChange('sizing')}
        />
      )}

      {activeTab === 'sizing' && (
        <SystemSizingView
          sizingResult={sizingResult}
          params={params}
          onUpdateParams={handleUpdateParams}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onGenerateMaterials={() => handleTabChange('materials')}
          onBackToLoads={() => handleTabChange('loads')}
        />
      )}

      {activeTab === 'materials' && (
        <BillOfMaterialsView
          sizingResult={sizingResult}
          currency={currency}
          onOpenCurrencyModal={() => setIsCurrencyModalOpen(true)}
          onExportPdf={() => setIsPdfModalOpen(true)}
          onSaveProject={() => setIsProjectModalOpen(true)}
          onUpdateMaterialItem={handleUpdateMaterialItem}
          onAddCustomItem={handleAddCustomMaterial}
        />
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNavBar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Modals & Drawers */}
      <CurrencySelectorModal
        isOpen={isCurrencyModalOpen}
        currentCurrency={currency}
        onClose={() => setIsCurrencyModalOpen(false)}
        onSelectCurrency={handleSelectCurrency}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        currentLocation={params.location}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={(loc) => {
          handleUpdateParams({ location: loc });
          showToast(`Location updated to ${loc.city}`);
        }}
      />

      <EditApplianceModal
        isOpen={Boolean(editingAppliance)}
        appliance={editingAppliance}
        onClose={() => setEditingAppliance(null)}
        onSave={handleUpdateAppliance}
      />

      <ExportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        sizingResult={sizingResult}
        params={params}
        appliances={appliances}
        currency={currency}
      />

      <ProjectManagerModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        currentAppliances={appliances}
        currentParams={params}
        currentCurrency={currency}
        onLoadProject={handleLoadProject}
        onResetDefaults={handleResetDefaults}
      />

      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentCurrency={currency}
        onOpenCurrencyModal={() => setIsCurrencyModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />
    </div>
  );
}
