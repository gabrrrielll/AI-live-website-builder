"use client";

import React, { useState, useMemo } from 'react';
import * as icons from 'lucide-react';
import type { IconElement } from '@/types';
import ColorPicker from './ColorPicker';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';


// Get all icon names from lucide-react, filtering out non-component exports
const allIconNames = Object.keys(icons).filter(key => 
    typeof (icons as any)[key] === 'object' && key !== 'default' && (icons as any)[key].displayName
);

interface IconEditorProps {
  element: IconElement;
  onSave: (updatedElement: Partial<IconElement>) => void;
}

const IconEditor: React.FC<IconEditorProps> = ({ element, onSave }) => {
  const [iconName, setIconName] = useState(element.iconName);
  const [size, setSize] = useState(element.size);
  const [color, setColor] = useState(element.color);
  const [styles, setStyles] = useState(element.styles || {});
  const [search, setSearch] = useState('');
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  const filteredIcons = useMemo(() => {
    if (!search) return allIconNames;
    return allIconNames.filter(name => name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleSave = () => {
    onSave({ iconName, size, color, styles });
    toast.success(t.iconUpdated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.searchIcons}</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.searchIconsPlaceholder.replace('X', allIconNames.length.toString())}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="h-64 overflow-y-auto border rounded-md p-2 grid grid-cols-6 md:grid-cols-8 gap-2">
        {filteredIcons.map(name => {
          const LucideIcon = (icons as any)[name];
          return (
            <button
              key={name}
              onClick={() => setIconName(name)}
              className={`flex items-center justify-center p-2 rounded-md transition-colors ${iconName === name ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}`}
              title={name}
            >
              <LucideIcon size={24} className="text-gray-700" />
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.iconSize}</label>
          <input
            type="number"
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <ColorPicker
          label={t.iconColor}
          color={color}
          onChange={setColor}
        />
      </div>
      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {t.saveChanges}
        </button>
      </div>
    </div>
  );
};

export default IconEditor;