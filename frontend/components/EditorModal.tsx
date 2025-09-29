"use client";

import React, { useEffect, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { X } from 'lucide-react';
import ImageEditor from '@/components/editors/ImageEditor';
import RichTextEditor from '@/components/editors/RichTextEditor';
import MapEditor from '@/components/editors/MapEditor';
import LogoEditor from '@/components/editors/LogoEditor';
import FormConfigEditor from '@/components/editors/FormConfigEditor';
import IconEditor from '@/components/editors/IconEditor';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const EditorModal: React.FC = () => {
  const { editingElement, stopEditing, updateElement } = useSite();
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editorModal, [language]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopEditing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopEditing]);


  if (!editingElement) return null;

  const { sectionId, elementId, element } = editingElement;

  const handleSave = (updatedElement: any) => {
    updateElement(sectionId, elementId, { ...element, ...updatedElement });
    stopEditing();
  };

  const handleChange = (updatedElement: any) => {
    updateElement(sectionId, elementId, { ...element, ...updatedElement });
  };

  const renderEditor = () => {
    switch (element.type) {
      case 'rich-text':
        return <RichTextEditor element={element} onSave={handleSave} onChange={handleChange} />;
      case 'image':
        return <ImageEditor element={element} onSave={handleSave} />;
      case 'map':
        return <MapEditor element={element} onSave={handleSave} />;
      case 'logo':
        return <LogoEditor element={element} onSave={handleSave} />;
      case 'form-config':
        return <FormConfigEditor element={element} onSave={handleSave} />;
      case 'icon':
        return <IconEditor element={element} onSave={handleSave} />;
      default:
        return <div>Editor for this element type is not available.</div>;
    }
  };

  const getTitle = () => {
    switch (element.type) {
      case 'rich-text': return t.editRichText;
      case 'image': return t.editImage;
      case 'map': return t.editMap;
      case 'logo': return t.editLogo;
      case 'form-config': return t.editFormConfig;
      case 'icon': return t.editIcon;
      default: return 'Edit Element';
    }
  };

  return (
    <div id="editor-modal-backdrop" className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={stopEditing} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden" style={{ width: '90%', height: '80%', maxWidth: '800px', margin: '0 auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{getTitle()}</h2>
          <button onClick={stopEditing} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
          {renderEditor()}
        </div>
      </div>
    </div>
  );
};

export default EditorModal;