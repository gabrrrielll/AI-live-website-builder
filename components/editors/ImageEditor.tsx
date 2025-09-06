"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { ImageElement, Language, LocalizedString } from '@/types';
import { toast } from 'sonner';
import ImageCropperModal from './ImageCropperModal';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import ImageSelector from './ImageSelector';
import { useSite } from '@/context/SiteContext';

interface ImageEditorProps {
  element: ImageElement;
  onSave?: (updatedElement: Partial<ImageElement>) => void; // Made optional
  onChange?: (data: { content: string, alt: LocalizedString }) => void;
  hideSaveButton?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ element, onSave, onChange, hideSaveButton = false }) => {
  const { storeImage } = useSite();
  const [content, setContent] = useState(element.content);
  const [alt, setAlt] = useState<LocalizedString>(element.alt);
  const [activeLang, setActiveLang] = useState<Language>('ro');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  // Sync state if the element prop changes from outside
  useEffect(() => {
    setContent(element.content);
    setAlt(element.alt);
  }, [element]);

  // Bubble up changes to the parent component in real-time
  useEffect(() => {
    if (onChange) {
      onChange({ content, alt });
    }
  }, [content, alt, onChange]);

  const handleSave = async () => {
    if (!onSave) return;
    // If the content is a new Base64 image, store it and get an ID.
    if (content.startsWith('data:image')) {
      try {
        const imageId = await storeImage(content);
        onSave({ content: imageId, alt });
      } catch {
        // Error toast is already shown by storeImage
        return;
      }
    } else {
      // It's a regular URL or an existing local ID, just save it as is.
      onSave({ content, alt });
    }
    toast.success(t.imageUpdated);
  };

  const handleCropSave = (croppedImageUrl: string) => {
    setContent(croppedImageUrl);
    setImageToCrop(null);
    toast.success("Image cropped successfully!");
  };
  
  const handleAltSuggestion = (suggestedAlt: string) => {
    setAlt({ ro: suggestedAlt, en: suggestedAlt });
  };

  return (
    <>
      {imageToCrop && (
        <ImageCropperModal 
          src={imageToCrop}
          onSave={handleCropSave}
          onClose={() => setImageToCrop(null)}
        />
      )}
      <div className="space-y-6">
        <ImageSelector
          currentImageUrl={content}
          onImageUrlChange={setContent}
          onImageReadyToCrop={setImageToCrop}
          onAltTextSuggestion={handleAltSuggestion}
        />
        
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.altText}</label>
           <div className="flex border-b mb-2">
                <button onClick={() => setActiveLang('ro')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'ro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.romanian}</button>
                <button onClick={() => setActiveLang('en')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'en' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.english}</button>
            </div>
          <input
            type="text"
            value={alt[activeLang]}
            onChange={(e) => setAlt(prev => ({ ...prev, [activeLang]: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        {!hideSaveButton && (
            <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {t.saveChanges}
            </button>
            </div>
        )}
      </div>
    </>
  );
};

export default ImageEditor;