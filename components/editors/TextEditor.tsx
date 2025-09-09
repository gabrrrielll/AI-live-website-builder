"use client";

import React, { useState, useMemo } from 'react';
import type { RichTextElement, Language, LocalizedString } from '@/types';
import { generateTextWithRetryWithRetry } from '@/services/aiService';
import { toast } from 'sonner';
import { Sparkles, Loader } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

interface TextEditorProps {
  element: RichTextElement;
  onSave: (updatedElement: Partial<RichTextElement>) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ element, onSave }) => {
  const [content, setContent] = useState<LocalizedString>(element.content);
  const [styles, setStyles] = useState(element.styles || {});
  const [activeLang, setActiveLang] = useState<Language>('ro');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  const handleSave = () => {
    onSave({ content, styles });
    toast.success(t.textUpdated);
  };

  const handleStyleChange = (prop: keyof React.CSSProperties, value: any) => {
    setStyles(prev => ({ ...prev, [prop]: value }));
  };

  const handleGenerateText = async () => {
    if (!aiPrompt.trim()) {
      toast.error(t.aiPromptError);
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading(`${t.generating} text in ${activeLang === 'ro' ? 'Romanian' : 'English'}...`);
    try {
      const languageInstruction = `Generate the response in ${activeLang === 'ro' ? 'Romanian' : 'English'}.`;
      const fullPrompt = `Based on the following instruction, generate a short piece of text for a website. Current text is "${content[activeLang]}". Instruction: "${aiPrompt}". ${languageInstruction} Return only the generated text.`;
      const result = await generateTextWithRetry(fullPrompt);

      setContent(prev => ({ ...prev, [activeLang]: result }));

      toast.success("AI text generated!", { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to generate text.", { id: toastId, description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerateText();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.content}</label>
        <div className="flex border-b mb-2">
          <button onClick={() => setActiveLang('ro')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'ro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.romanian}</button>
          <button onClick={() => setActiveLang('en')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'en' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.english}</button>
        </div>
        <textarea
          value={content[activeLang]}
          onChange={(e) => setContent(prev => ({ ...prev, [activeLang]: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <Sparkles className="mr-2 text-purple-500" size={20} /> {t.aiGeneration}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{t.generatingFor} <span className="font-semibold">{activeLang === 'ro' ? t.romanian : t.english}</span> version.</p>
        <div className="flex space-x-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={handleAiInputKeyDown}
            placeholder={t.aiPromptPlaceholder}
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={handleGenerateText} disabled={isGenerating} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center">
            {isGenerating ? <Loader size={20} className="animate-spin" /> : t.generate}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <ColorPicker
          label={t.textColor}
          color={styles.color as string || '#000000'}
          onChange={(newColor) => handleStyleChange('color', newColor)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.fontSize}</label>
            <input
              type="number"
              value={parseInt(styles.fontSize as string, 10) || 16}
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.fontWeight}</label>
            <select
              value={styles.fontWeight as string || 'normal'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="300">Light</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.textAlign}</label>
            <select
              value={styles.textAlign as string || 'left'}
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;