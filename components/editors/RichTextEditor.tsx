"use client";

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { RichTextElement, Language, LocalizedString } from '@/types';
import { toast } from 'sonner';
import { sanitizeHTML } from '@/utils/sanitize';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

// Dynamically import ReactQuill to prevent SSR issues, as it uses the 'document' object.
// FIX: The original dynamic import's wrapper component (`({ ...props }) => ...`) caused TypeScript
// to incorrectly infer the component's props as an empty object. By explicitly typing
// the props using `import('react-quill').ReactQuillProps`, we allow TypeScript to correctly
// validate props like `theme`, `value`, etc., resolving the overload error.
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return (props: import('react-quill').ReactQuillProps) => <RQ {...props} />;
  },
  {
    ssr: false,
  }
);

interface RichTextEditorProps {
  element: RichTextElement;
  onSave: (updatedElement: Partial<RichTextElement>) => void;
  onChange?: (newContent: LocalizedString) => void;
  hideSaveButton?: boolean;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ element, onSave, onChange, hideSaveButton = false }) => {
  const [content, setContent] = useState<LocalizedString>(element.content);
  const [activeLang, setActiveLang] = useState<Language>('ro');
  const [editorView, setEditorView] = useState<'visual' | 'text'>('visual');
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  useEffect(() => {
    setContent(element.content);
  }, [element.content]);

  const handleContentChange = (value: string) => {
    const newContent = { ...content, [activeLang]: value };
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleSave = () => {
    const sanitizedContent: LocalizedString = {
      ro: sanitizeHTML(content.ro),
      en: sanitizeHTML(content.en),
    };
    onSave({ content: sanitizedContent });
    toast.success(t.contentUpdated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b mb-2">
        <div className="flex">
          <button onClick={() => setActiveLang('ro')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'ro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.romanian}</button>
          <button onClick={() => setActiveLang('en')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'en' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.english}</button>
        </div>
        <div className="flex items-center space-x-1 p-1 bg-gray-200/80 rounded-full">
          <button onClick={() => setEditorView('visual')} className={`px-3 py-1 text-sm rounded-full transition-all ${editorView === 'visual' ? 'bg-white shadow font-semibold text-gray-800' : 'text-gray-500'}`}>{t.visual}</button>
          <button onClick={() => setEditorView('text')} className={`px-3 py-1 text-sm rounded-full transition-all ${editorView === 'text' ? 'bg-white shadow font-semibold text-gray-800' : 'text-gray-500'}`}>{t.text}</button>
        </div>
      </div>

      {editorView === 'visual' ? (
        <ReactQuill
          theme="snow"
          value={content[activeLang]}
          onChange={handleContentChange}
          modules={modules}
        />
      ) : (
        <textarea
          value={content[activeLang]}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          rows={10}
        />
      )}

      {!hideSaveButton && (
        <div className="flex justify-end">
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {t.saveChanges}
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;