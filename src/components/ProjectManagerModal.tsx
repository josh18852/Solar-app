import React, { useState, useEffect } from 'react';
import { Appliance, CurrencyConfig, SystemParameters } from '../types';

interface SavedProject {
  id: string;
  name: string;
  savedAt: string;
  appliances: Appliance[];
  params: SystemParameters;
  currency?: CurrencyConfig;
}

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAppliances: Appliance[];
  currentParams: SystemParameters;
  currentCurrency: CurrencyConfig;
  onLoadProject: (appliances: Appliance[], params: SystemParameters, currency?: CurrencyConfig) => void;
  onResetDefaults: () => void;
}

const STORAGE_KEY = 'solar_planner_saved_projects';

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  currentAppliances,
  currentParams,
  currentCurrency,
  onLoadProject,
  onResetDefaults,
}) => {
  const [projectName, setProjectName] = useState('My Solar Power Project');
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newProject: SavedProject = {
      id: Date.now().toString(),
      name: projectName.trim(),
      savedAt: new Date().toLocaleString(),
      appliances: currentAppliances,
      params: currentParams,
      currency: currentCurrency,
    };

    const updated = [newProject, ...savedProjects.filter((p) => p.name !== newProject.name)];
    setSavedProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setSaveSuccessMsg('Project saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportJson = () => {
    const projectData = {
      name: projectName,
      exportedAt: new Date().toISOString(),
      currency: currentCurrency,
      appliances: currentAppliances,
      params: currentParams,
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_solar_plan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.appliances && parsed.params) {
          onLoadProject(parsed.appliances, parsed.params, parsed.currency);
          onClose();
        }
      } catch (err) {
        alert('Invalid solar project JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-surface-container-high mb-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">folder_special</span>
            <h2 className="text-xl font-bold">Project Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="mb-4 p-2 bg-tertiary-fixed text-on-tertiary-fixed rounded text-xs font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Save Current Form */}
        <form onSubmit={handleSaveCurrent} className="mb-6 p-4 bg-surface-container-low rounded-lg border border-outline-variant">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
            Save Current Solar Configuration
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name..."
              className="flex-grow bg-surface-container-lowest border border-outline rounded p-2 text-xs text-on-surface"
              required
            />
            <button
              type="submit"
              className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded hover:bg-primary-container shrink-0"
            >
              Save Project
            </button>
          </div>
        </form>

        {/* Saved Projects List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Saved Configurations ({savedProjects.length})
            </span>
          </div>

          {savedProjects.length === 0 ? (
            <div className="p-4 text-center text-xs text-on-surface-variant bg-surface-container-low rounded border border-outline-variant">
              No saved projects yet. Click "Save Project" above to store your calculations.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {savedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 bg-surface-container-lowest border border-outline-variant rounded flex justify-between items-center hover:border-primary transition-colors"
                >
                  <div>
                    <div className="font-semibold text-xs text-primary">{proj.name}</div>
                    <div className="text-[10px] text-on-surface-variant">
                      {proj.savedAt} • {proj.appliances?.length || 0} appliances • {proj.params?.location?.city}
                      {proj.currency ? ` • ${proj.currency.flag} ${proj.currency.code}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadProject(proj.appliances, proj.params, proj.currency);
                        onClose();
                      }}
                      className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded text-xs font-bold hover:bg-secondary-fixed"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id)}
                      className="text-on-surface-variant hover:text-error p-1 rounded hover:bg-error-container"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import / Export / Reset Tools */}
        <div className="pt-3 border-t border-surface-container-high space-y-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
            Tools &amp; Backup
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="border border-outline hover:bg-surface-container-low text-primary p-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export JSON</span>
            </button>

            <label className="border border-outline hover:bg-surface-container-low text-primary p-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-center">
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset appliances and sizing parameters back to default demo state?')) {
                onResetDefaults();
                onClose();
              }
            }}
            className="w-full text-center text-xs text-on-surface-variant hover:text-error py-1.5 mt-1"
          >
            Reset All to Demo Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
