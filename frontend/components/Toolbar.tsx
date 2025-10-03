"use client";

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useSite } from '@/context/SiteContext';
import { useSiteMode } from '@/context/SiteModeContext';
import { Eye, Edit, Undo2, Redo2, RefreshCw, HelpCircle, Download, Upload, Cloud, Loader, Bot } from 'lucide-react';
import HelpModal from './HelpModal';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { useTestMode } from '@/context/TestModeContext';
import { usePlansConfig } from '@/context/ConfigProvider';
import { useSync } from '@/hooks/useSync';

const Toolbar: React.FC = () => {
  const {
    siteConfig,
    openRebuildModal,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSite();
  const { isEditMode, switchToEditMode, switchToViewMode } = useSiteMode();
  const { isTestMode, canUseRebuild, showLimitModal } = useTestMode();
  const { showSaveButton, showImportExportConfig, isLoading, plansConfig } = usePlansConfig();

  // Debug logging pentru butonul de salvare
  React.useEffect(() => {
    console.log('🔧 Toolbar - showSaveButton:', showSaveButton);
    console.log('🔧 Toolbar - isLoading:', isLoading);
    console.log('🔧 Toolbar - plansConfig:', plansConfig);
  }, [showSaveButton, isLoading, plansConfig]);
  const [showHelp, setShowHelp] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);

  // Hook pentru sincronizare
  const { syncConfig } = useSync({ siteConfig, setIsSyncing, t });

  const buttonClass = "flex items-center justify-center p-0.5 sm:p-3 rounded-full text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 min-w-[28px] sm:min-w-[44px] min-h-[28px] sm:min-h-[44px]";
  const enabledClass = "bg-white hover:bg-gray-100";
  const activeClass = "bg-[#F7F2E9] text-[#c29a47] hover:bg-[#F3EADF]";

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast.error(t.toolbar.importInvalidFile);
        return;
      }
      // Implementare simplificată pentru import
      toast.info('Import funcționalitate în dezvoltare');
    }
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  };



  // Funcție reală pentru export configurație
  const exportConfig = useCallback(async () => {
    if (!siteConfig) {
      toast.error("Nu există configurație disponibilă pentru export.");
      return;
    }
    try {
      // Configurația conține deja imaginile ca base64 în siteConfig.images
      const jsonString = JSON.stringify(siteConfig, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'site-config.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Configurația a fost exportată cu succes!');
    } catch (error) {
      console.error("Failed to export config:", error);
      toast.error("Export eșuat", { description: "Nu s-a putut genera fișierul." });
    }
  }, [siteConfig]);

  const resetToDefaults = () => toast.info('Reset funcționalitate în dezvoltare');

  return (
    <>
      <div className="fixed bottom-2 left-2 right-2 z-50 sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto">
        <div className="flex items-center justify-center space-x-0.5 sm:space-x-2 bg-white/90 backdrop-blur-md p-1.5 sm:p-2 sm:rounded-full rounded-lg shadow-lg border border-gray-200 overflow-x-auto scrollbar-hide">
          <button
            onClick={isEditMode ? switchToViewMode : switchToEditMode}
            className={`${buttonClass} ${isEditMode ? activeClass : enabledClass}`}
            title={isEditMode ? t.toolbar.previewMode : t.toolbar.editMode}
          >
            {isEditMode ? <Eye size={16} className="sm:w-5 sm:h-5" /> : <Edit size={16} className="sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={canUseRebuild() ? openRebuildModal : showLimitModal}
            className={`${buttonClass} ${enabledClass} bg-purple-100 text-purple-700 hover:bg-purple-200`}
            title={t.toolbar.aiRebuild}
          >
            <Bot size={16} className="sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-2 sm:h-6 bg-gray-300 mx-0.5 sm:mx-2"></div>

          <button onClick={undo} disabled={!canUndo} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.undo}>
            <Undo2 size={16} className="sm:w-5 sm:h-5" />
          </button>
          <button onClick={redo} disabled={!canRedo} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.redo}>
            <Redo2 size={16} className="sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-2 sm:h-6 bg-gray-300 mx-0.5 sm:mx-2"></div>

          {showSaveButton && (
            <button
              onClick={syncConfig}
              disabled={isSyncing}
              className={`${buttonClass} ${enabledClass}`}
              title={t.toolbar.syncToCloud}
            >
              {isSyncing ? <Loader size={16} className="animate-spin sm:w-5 sm:h-5" /> : <Cloud size={16} className="sm:w-5 sm:h-5" />}
            </button>
          )}
          {!isTestMode && showImportExportConfig && (
            <>
              <button onClick={exportConfig} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.exportConfig}>
                <Download size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button onClick={handleImportClick} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.importConfig}>
                <Upload size={16} className="sm:w-5 sm:h-5" />
              </button>
              <input
                type="file"
                ref={importInputRef}
                onChange={handleFileImport}
                className="hidden"
                accept="application/json"
              />
            </>
          )}

          <div className="w-px h-2 sm:h-6 bg-gray-300 mx-0.5 sm:mx-2"></div>

          <button onClick={resetToDefaults} className={`${buttonClass} ${enabledClass} hover:bg-red-100 hover:text-red-600`} title={t.toolbar.resetToDefaults}>
            <RefreshCw size={16} className="sm:w-5 sm:h-5" />
          </button>

          <div className="w-px h-2 sm:h-6 bg-gray-300 mx-0.5 sm:mx-2"></div>

          <button onClick={() => setShowHelp(true)} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.help}>
            <HelpCircle size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default Toolbar;