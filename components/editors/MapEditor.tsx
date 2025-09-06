"use client";

import React, { useState, useMemo } from 'react';
import type { MapElement } from '@/types';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

interface MapEditorProps {
  element: MapElement;
  onSave: (updatedElement: Partial<MapElement>) => void;
}

const MapEditor: React.FC<MapEditorProps> = ({ element, onSave }) => {
  const [content, setContent] = useState(element.content);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);


  const handleSave = () => {
    // Basic validation to ensure it's an iframe
    if (!content.trim().startsWith('<iframe') || !content.includes('src=')) {
        toast.error(t.mapInvalidInput);
        return;
    }
    onSave({ content });
    toast.success(t.mapUpdated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.mapEmbedCode}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          rows={8}
          placeholder={t.mapEmbedPlaceholder}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">{t.mapInstructionsTitle}</h4>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            {t.mapInstructions.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
      </div>
      
      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {t.saveChanges}
        </button>
      </div>
    </div>
  );
};

export default MapEditor;