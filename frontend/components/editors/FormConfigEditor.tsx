"use client";

import React, { useState, useMemo } from 'react';
import type { FormConfigElement } from '@/types';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

interface FormConfigEditorProps {
  element: FormConfigElement;
  onSave: (updatedElement: Partial<FormConfigElement>) => void;
}

const FormConfigEditor: React.FC<FormConfigEditorProps> = ({ element, onSave }) => {
  const [recipientEmail, setRecipientEmail] = useState(element.recipientEmail);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  const handleSave = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast.error(t.formConfigInvalid);
      return;
    }
    onSave({ recipientEmail });
    toast.success(t.formConfigUpdated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">{t.formRecipientEmail}</label>
        <input
          id="recipientEmail"
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="email@destinatar.com"
        />
        <p className="text-xs text-gray-500 mt-1">{t.formRecipientHint}</p>
      </div>

       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-800">
            {t.emailJsInfo}
       </div>
      
      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {t.saveChanges}
        </button>
      </div>
    </div>
  );
};

export default FormConfigEditor;