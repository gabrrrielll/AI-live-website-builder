"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleSwitch = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-1 p-1 bg-gray-200/80 rounded-full">
      <button
        onClick={() => handleSwitch('ro')}
        className={`px-3 py-1 text-sm rounded-full transition-all ${
          language === 'ro' ? 'bg-white shadow font-semibold text-gray-800' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        RO
      </button>
      <button
        onClick={() => handleSwitch('en')}
        className={`px-3 py-1 text-sm rounded-full transition-all ${
          language === 'en' ? 'bg-white shadow font-semibold text-gray-800' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;