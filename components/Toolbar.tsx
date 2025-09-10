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

const Toolbar: React.FC = () => {
  const {
    siteConfig,
    openRebuildModal,
    saveConfig,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSite();
  const { isEditMode, switchToEditMode, switchToViewMode } = useSiteMode();
  const { isTestMode, canUseRebuild, showLimitModal } = useTestMode();
  const [showHelp, setShowHelp] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);

  const buttonClass = "flex items-center justify-center p-3 rounded-full text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
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


  // Funcție reală pentru salvare pe server
  const syncConfig = async () => {
    try {
      await saveConfig();
    } catch (error) {
      console.error('Error saving to server:', error);
    }
  };
  const isSyncing = false;

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

  const isFreeUser = siteConfig?.metadata.userType === 'free';

  return (
    <>
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200">
          <button
            onClick={isEditMode ? switchToViewMode : switchToEditMode}
            className={`${buttonClass} ${isEditMode ? activeClass : enabledClass}`}
            title={isEditMode ? t.toolbar.previewMode : t.toolbar.editMode}
          >
            {isEditMode ? <Eye size={20} /> : <Edit size={20} />}
          </button>

          <button
            onClick={canUseRebuild() ? openRebuildModal : showLimitModal}
            className={`${buttonClass} ${enabledClass} bg-purple-100 text-purple-700 hover:bg-purple-200`}
            title={t.toolbar.aiRebuild}
          >
            <Bot size={20} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button onClick={undo} disabled={!canUndo} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.undo}>
            <Undo2 size={20} />
          </button>
          <button onClick={redo} disabled={!canRedo} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.redo}>
            <Redo2 size={20} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={syncConfig}
            disabled={isSyncing}
            className={`${buttonClass} ${enabledClass}`}
            title={t.toolbar.syncToCloud}
          >
            {isSyncing ? <Loader size={20} className="animate-spin" /> : <Cloud size={20} />}
          </button>
          {!isTestMode && (
            <>
              <button onClick={exportConfig} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.exportConfig}>
                <Download size={20} />
              </button>
              <button onClick={handleImportClick} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.importConfig}>
                <Upload size={20} />
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

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button onClick={resetToDefaults} className={`${buttonClass} ${enabledClass} hover:bg-red-100 hover:text-red-600`} title={t.toolbar.resetToDefaults}>
            <RefreshCw size={20} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button onClick={() => setShowHelp(true)} className={`${buttonClass} ${enabledClass}`} title={t.toolbar.help}>
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default Toolbar;