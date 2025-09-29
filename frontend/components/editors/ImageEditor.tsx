"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const { storeImage, getImageUrl } = useSite();
  const [content, setContent] = useState(element.content);
  const [alt, setAlt] = useState<LocalizedString>(element.alt);
  const [activeLang, setActiveLang] = useState<Language>('ro');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  // Handle URL changes from ImageSelector
  const handleUrlChange = useCallback(async (newUrl: string) => {
    // If it's a new base64 image, we need to store it
    if (newUrl.startsWith('data:image')) {
      try {
        const imageId = await storeImage(newUrl);
        setContent(imageId);
      } catch (error) {
        console.error('🖼️ [ImageEditor] Failed to store image:', error);
        toast.error('Failed to save image');
        return;
      }
    } else {
      // It's a regular URL or existing local ID
      setContent(newUrl);
    }
  }, [storeImage]);

  // Get the display URL (base64 for local images, original URL for others)
  const displayUrl = useMemo(() => {
    if (content.startsWith('local-img-')) {
      return getImageUrl(content) || content;
    }
    return content;
  }, [content, getImageUrl]);

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

  const handleCropSave = async (croppedImageUrl: string) => {
    try {
      const imageId = await storeImage(croppedImageUrl);
      setContent(imageId);
      setImageToCrop(null);
      toast.success("Image cropped successfully!");
    } catch (error) {
      console.error('🖼️ [ImageEditor] Failed to store cropped image:', error);
      toast.error('Failed to save cropped image');
    }
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
      <div className="space-y-6 pb-20">
        <ImageSelector
          currentImageUrl={displayUrl}
          onImageUrlChange={handleUrlChange}
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
        )}
      </div>
    </>
  );
};

export default ImageEditor;