"use client";

import React, { useEffect, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { X } from 'lucide-react';
import SectionBackgroundEditor from './editors/SectionBackgroundEditor';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const SlideStyleEditorModal: React.FC = () => {
  const { siteConfig, editingSlide, stopEditingSlideStyles, updateSlideItemStyles } = useSite();
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editorModal, [language]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopEditingSlideStyles();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopEditingSlideStyles]);

  if (!editingSlide || !siteConfig) return null;

  const section = siteConfig.sections[editingSlide.sectionId];
  const slideItem = section?.items?.find((item: any) => item.id === editingSlide.itemId);
  
  if (!slideItem) return null;

  const handleSave = (updatedStyles: React.CSSProperties) => {
    updateSlideItemStyles(editingSlide.sectionId, editingSlide.itemId, updatedStyles);
    stopEditingSlideStyles();
  };
  
  const title = t.editSlideBackground.replace('{slideNumber}', editingSlide.itemId.toString());

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-28" onClick={stopEditingSlideStyles}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl transform transition-all flex flex-col max-h-full" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={stopEditingSlideStyles} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto">
          <SectionBackgroundEditor
            initialStyles={slideItem.styles || {}}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideStyleEditorModal;