"use client";

import React, { useState, useMemo, useEffect } from 'react';

// Suppress react-quill related warnings and source map errors in development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  console.warn = (...args) => {
    if (typeof args[0] === 'string') {
      const message = args[0];
      if (message.includes('findDOMNode') ||
        message.includes('DOMNodeInserted') ||
        message.includes('Adăugarea unui ascultător pentru DOMNodeInserted')) {
        return; // Suppress react-quill related warnings
      }
    }
    originalConsoleWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (typeof args[0] === 'string') {
      const message = args[0];
      if (message.includes('source map') ||
        message.includes('Eroare în source map') ||
        message.includes('installHook.js.map')) {
        return; // Suppress source map errors
      }
    }
    originalConsoleError.apply(console, args);
  };
}
import { lazy, Suspense } from 'react';
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
const ReactQuill = lazy(() => import('react-quill'));

interface RichTextEditorProps {
  element?: RichTextElement;
  onSave: (updatedElement: Partial<RichTextElement>) => void;
  onChange?: (newContent: LocalizedString) => void;
  hideSaveButton?: boolean;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean']
  ]
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ element, onSave, onChange, hideSaveButton = false }) => {
  const [content, setContent] = useState<LocalizedString>(element?.content || { ro: '', en: '' });
  const [activeLang, setActiveLang] = useState<Language>('ro');
  const [editorView, setEditorView] = useState<'visual' | 'text'>('visual');
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  useEffect(() => {
    console.log('RichTextEditor: element.content changed:', element?.content);
    if (element?.content) {
      setContent(element.content);
    }
  }, [element?.content]);

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
    <div className="space-y-4 pb-20">
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
        <div className="rich-text-editor">
          <style>{`
              /* Stiluri pentru editor */
              .rich-text-editor .ql-editor {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #333333 !important;
                background-color: #ffffff !important;
              }
              
              /* Stiluri pentru fonturi globale */
              .ql-font-Arial { font-family: Arial, sans-serif !important; }
              .ql-font-Helvetica { font-family: Helvetica, sans-serif !important; }
              .ql-font-Times-New-Roman { font-family: "Times New Roman", serif !important; }
              .ql-font-Georgia { font-family: Georgia, serif !important; }
              .ql-font-Verdana { font-family: Verdana, sans-serif !important; }
              .ql-font-Courier-New { font-family: "Courier New", monospace !important; }
              .ql-font-serif { font-family: serif !important; }
              .ql-font-sans-serif { font-family: sans-serif !important; }
              .ql-font-monospace { font-family: monospace !important; }
              
              /* Stiluri pentru dimensiuni de font */
              .ql-size-8px { font-size: 8px !important; }
              .ql-size-10px { font-size: 10px !important; }
              .ql-size-12px { font-size: 12px !important; }
              .ql-size-14px { font-size: 14px !important; }
              .ql-size-16px { font-size: 16px !important; }
              .ql-size-18px { font-size: 18px !important; }
              .ql-size-20px { font-size: 20px !important; }
              .ql-size-24px { font-size: 24px !important; }
              .ql-size-28px { font-size: 28px !important; }
              .ql-size-32px { font-size: 32px !important; }
              .ql-size-36px { font-size: 36px !important; }
              .ql-size-48px { font-size: 48px !important; }
              .ql-size-64px { font-size: 64px !important; }
              
              .rich-text-editor .ql-toolbar {
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
                border-right: 1px solid #ccc;
                padding: 8px;
              }
              .rich-text-editor .ql-container {
                border-bottom: 1px solid #ccc;
                border-left: 1px solid #ccc;
                border-right: 1px solid #ccc;
              }
              .rich-text-editor .ql-toolbar .ql-formats {
                margin-right: 8px;
              }
              @media (max-width: 640px) {
                .rich-text-editor .ql-toolbar {
                  padding: 4px;
                  font-size: 12px;
                }
                .rich-text-editor .ql-toolbar .ql-formats {
                  margin-right: 4px;
                }
                .rich-text-editor .ql-toolbar button {
                  padding: 4px;
                  width: 28px;
                  height: 28px;
                }
              }
            `}</style>
          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill
              theme="snow"
              value={content[activeLang]}
              onChange={handleContentChange}
              modules={modules}
            />
          </Suspense>
        </div>
      ) : (
        <textarea
          value={content[activeLang]}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          rows={10}
        />
      )}

      {!hideSaveButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-3 sm:p-4">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              {t.saveChanges}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;