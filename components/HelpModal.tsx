"use client";

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

interface HelpModalProps {
  onClose: () => void;
}

const Shortcut: React.FC<{ keys: string[]; description: string }> = ({ keys, description }) => (
  <li className="flex items-center justify-between py-3">
    <span className="text-gray-600">{description}</span>
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-gray-400">+</span>}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  </li>
);


const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].helpModal, [language]);

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{t.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-200">
            <Shortcut keys={['Ctrl/⌘', 'E']} description={t.toggleMode} />
            <Shortcut keys={['Ctrl/⌘', 'Z']} description={t.undo} />
            <Shortcut keys={['Ctrl/⌘', 'Y']} description={t.redo} />
            <Shortcut keys={['Ctrl/⌘', 'S']} description={t.save} />
            <Shortcut keys={['Double Click']} description={t.openEditor} />
            <Shortcut keys={['Esc']} description={t.closeModal} />
            <Shortcut keys={['Enter']} description={t.generateAI} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;