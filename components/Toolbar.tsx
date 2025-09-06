"use client";

import React, { useState, useRef, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { useSiteMode } from '@/context/SiteModeContext';
import { Eye, Edit, Undo2, Redo2, RefreshCw, HelpCircle, Download, Upload, Cloud, Loader, EyeOff, Bot } from 'lucide-react';
import HelpModal from './HelpModal';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { useTestMode } from '@/context/TestModeContext';

const Toolbar: React.FC = () => {
  const {
    siteConfig,
    showHiddenInEditor,
    toggleShowHiddenInEditor,
    openRebuildModal,
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

  // Funcții stub pentru compatibilitate
  const undo = () => toast.info('Undo funcționalitate în dezvoltare');
  const redo = () => toast.info('Redo funcționalitate în dezvoltare');
  const canUndo = false;
  const canRedo = false;
  const syncConfig = () => toast.info('Sync funcționalitate în dezvoltare');
  const isSyncing = false;
  const exportConfig = () => toast.info('Export funcționalitate în dezvoltare');
  const resetToDefaults = () => toast.info('Reset funcționalitate în dezvoltare');

  const isFreeUser = siteConfig?.metadata.userType === 'free';

  return (
    <>
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md p-2 rounded-full shadow-lg border border-gray-200">
          <button
            onClick={canUseRebuild() ? openRebuildModal : showLimitModal}
            className={`${buttonClass} ${enabledClass} bg-purple-100 text-purple-700 hover:bg-purple-200`}
            title={t.toolbar.aiRebuild}
          >
            <Bot size={20} />
          </button>

          <button
            onClick={isEditMode ? switchToViewMode : switchToEditMode}
            className={`${buttonClass} ${isEditMode ? activeClass : enabledClass}`}
            title={isEditMode ? t.toolbar.previewMode : t.toolbar.editMode}
          >
            {isEditMode ? <Eye size={20} /> : <Edit size={20} />}
          </button>

          {isEditMode && (
            <button
              onClick={toggleShowHiddenInEditor}
              className={`${buttonClass} ${enabledClass}`}
              title={showHiddenInEditor ? t.toolbar.hideHiddenSections : t.toolbar.showHiddenSections}
            >
              {showHiddenInEditor ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

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
            disabled={isSyncing || isFreeUser}
            className={`${buttonClass} ${enabledClass}`}
            title={isFreeUser ? t.toolbar.upgradeToSync : t.toolbar.syncToCloud}
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