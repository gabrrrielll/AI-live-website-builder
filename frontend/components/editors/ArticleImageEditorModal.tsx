"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import ImageEditor from '@/components/editors/ImageEditor';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import type { Article, LocalizedString } from '@/types';
import { toast } from 'sonner';

interface ArticleImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newImageUrl: string, newImageAlt: LocalizedString) => void;
  article: Article;
}

const ArticleImageEditorModal: React.FC<ArticleImageEditorModalProps> = ({ isOpen, onClose, onSave, article }) => {
  const [imageData, setImageData] = useState({
    content: article.imageUrl,
    alt: article.imageAlt
  });

  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);

  // Reset local state when the modal is opened with the current article's data
  useEffect(() => {
    if (isOpen) {
      setImageData({
        content: article.imageUrl,
        alt: article.imageAlt,
      });
    }
  }, [isOpen, article]);

  if (!isOpen) return null;

  const handleSetImage = () => {
    onSave(imageData.content, imageData.alt);
    toast.success(t.editors.imageUpdated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-28" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl transform transition-all flex flex-col max-h-full" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">{t.articleImageEditorModal.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto">
          <ImageEditor 
            element={{ type: 'image', content: imageData.content, alt: imageData.alt }}
            onChange={setImageData}
            hideSaveButton={true}
          />
        </div>
        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
          <button onClick={handleSetImage} className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
            {t.articleImageEditorModal.setImageButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleImageEditorModal;