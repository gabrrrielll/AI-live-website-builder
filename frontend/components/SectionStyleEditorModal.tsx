"use client";

import React, { useEffect, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { X } from 'lucide-react';
import SectionBackgroundEditor from './editors/SectionBackgroundEditor';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const SectionStyleEditorModal: React.FC = () => {
  const { siteConfig, editingSectionId, stopEditingSectionStyles, updateSectionStyles } = useSite();
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editorModal, [language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopEditingSectionStyles();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopEditingSectionStyles]);

  if (!editingSectionId || !siteConfig) return null;

  const section = siteConfig.sections[editingSectionId];
  if (!section) return null;

  const handleSave = (updatedStyles: React.CSSProperties) => {
    updateSectionStyles(editingSectionId, updatedStyles);
    stopEditingSectionStyles();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={stopEditingSectionStyles} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden" style={{ width: '90%', height: '80%', maxWidth: '800px', margin: '0 auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{t.editSectionBackground}</h2>
          <button onClick={stopEditingSectionStyles} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
          <SectionBackgroundEditor
            initialStyles={section.styles || {}}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionStyleEditorModal;