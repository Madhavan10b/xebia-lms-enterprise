import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Save, RotateCcw, AlertTriangle, CloudLightning, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const userRole = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved).role : 'admin';
  }, []);

  // Local storage values state
  const [liveSync, setLiveSync] = useState(false);
  const [apiTimeout, setApiTimeout] = useState('1500');
  const [defaultIndexing, setDefaultIndexing] = useState(true);
  const [autoSitemap, setAutoSitemap] = useState(true);

  useEffect(() => {
    const isLive = localStorage.getItem('xebia_lms_is_live_api') === 'true';
    setLiveSync(isLive);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('xebia_lms_is_live_api', String(liveSync));
    showToast('System settings saved successfully.');
  };

  const handleResetLocalStorage = () => {
    if (window.confirm('WARNING: This will wipe out all local mock database modifications (courses, categories, content edits) and reset to system defaults. Proceed?')) {
      localStorage.removeItem('xebia_lms_courses');
      localStorage.removeItem('xebia_lms_categories');
      localStorage.removeItem('xebia_lms_is_live_api');
      showToast('Mock database flushed! Reload the page to load defaults.');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="flex-grow flex flex-col gap-6 max-w-4xl text-left">
      
      {/* General Settings Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-6">
        <h3 className="font-black text-sm text-brand-primaryDark border-b border-[#E2E4F0]/60 pb-3 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-brand-primary" /> General Platform Settings
        </h3>

        {/* Live sync */}
        <div className="flex items-center justify-between p-4 bg-[#E2E4F0]/15 rounded-xl border border-[#E2E4F0]/30">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-brand-primaryDark flex items-center gap-1">
              <CloudLightning className="w-3.5 h-3.5 text-brand-success" /> Live Spring Boot Sync
            </span>
            <span className="text-[10px] text-brand-muted font-medium">When active, connects directly to port 8085 API controllers</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={liveSync} 
              onChange={e => setLiveSync(e.target.checked)} 
              className="sr-only switch-input" 
            />
            <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
          </label>
        </div>

        {/* SEO Default Switches */}
        <div className="flex items-center justify-between p-4 bg-[#E2E4F0]/15 rounded-xl border border-[#E2E4F0]/30">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-brand-primaryDark flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-accent" /> Default Indexing (Robots tag)
            </span>
            <span className="text-[10px] text-brand-muted font-medium">Pre-populates new courses with "index, follow" tags</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={defaultIndexing} 
              onChange={e => setDefaultIndexing(e.target.checked)} 
              className="sr-only switch-input" 
            />
            <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#E2E4F0]/15 rounded-xl border border-[#E2E4F0]/30">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-brand-primaryDark">Auto Sitemap XML ping</span>
            <span className="text-[10px] text-brand-muted font-medium">Sends sitemap pings to search engines upon course publication</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={autoSitemap} 
              onChange={e => setAutoSitemap(e.target.checked)} 
              className="sr-only switch-input" 
            />
            <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E2E4F0]/60 pt-4 mt-2">
          <button
            onClick={handleSaveSettings}
            className="bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs py-2.5 px-4.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> Save Preferences
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      {userRole !== 'student' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-red-200 bg-red-50/10 shadow-glass flex flex-col gap-4">
          <h3 className="font-black text-sm text-red-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" /> Danger Zone
          </h3>
          <p className="text-xs text-brand-muted leading-relaxed font-semibold">
            Resetting local cache will delete all course lessons, modules, submodules, content blocks, and categories created in offline mock mode, returning them to their initial mock seed values. This action cannot be undone.
          </p>

          <button
            onClick={handleResetLocalStorage}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md self-start mt-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Local Mock DB
          </button>
        </div>
      )}

    </div>
  );
};
