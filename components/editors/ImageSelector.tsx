"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Sparkles, Loader, UploadCloud, Search } from 'lucide-react';
import { searchUnsplashPhotos, UnsplashPhoto } from '@/services/unsplashService';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { generateImage } from '@/services/aiService';
import { useTestMode } from '@/context/TestModeContext';

export type AspectRatio = 'square' | 'landscape' | 'portrait' | '16:9' | '4:3' | '1:1';

interface ImageSelectorProps {
  currentImageUrl: string;
  onImageUrlChange: (url: string) => void;
  onImageReadyToCrop: (url: string) => void;
  onAltTextSuggestion: (alt: string) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  currentImageUrl,
  onImageUrlChange,
  onImageReadyToCrop,
  onAltTextSuggestion,
}) => {
  const { canUseImageGen, useImageGen, showLimitModal } = useTestMode();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stockPhotoQuery, setStockPhotoQuery] = useState('');
  const [stockPhotos, setStockPhotos] = useState<UnsplashPhoto[]>([]);
  const [isSearchingStockPhotos, setIsSearchingStockPhotos] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File is too large. Please upload an image under 5MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type. Please upload an image (PNG, JPG, etc.).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageReadyToCrop(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageReadyToCrop]);

  const handleStockPhotoSearch = async () => {
    if (!stockPhotoQuery.trim()) {
      toast.error("Please enter a search term.");
      return;
    }
    setIsSearchingStockPhotos(true);
    setStockPhotos([]);
    try {
      const results = await searchUnsplashPhotos(stockPhotoQuery);
      setStockPhotos(results);
      if (results.length === 0) {
        toast.info(t.noImagesFound);
      }
    } catch (error) {
      toast.error(`Error searching Unsplash photos:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSearchingStockPhotos(false);
    }
  };

  const handleStockPhotoSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleStockPhotoSearch(); } };

  const handleStockPhotoSelect = (photo: UnsplashPhoto) => {
    onImageReadyToCrop(photo.urls.full);
    onAltTextSuggestion(photo.alt_description);
  };

  const handleGenerateImage = async () => {
    if (!canUseImageGen()) {
      toast.error("Ați atins limita de utilizare pentru această funcționalitate în versiunea de test.");
      return;
    }

    if (!aiPrompt.trim()) {
      toast.error(t.aiPromptError);
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Generating image with AI... This can take a moment.");

    try {
      const result = await generateImage(aiPrompt);

      onImageReadyToCrop(result);
      onAltTextSuggestion(aiPrompt);
      toast.success("AI image generated!", { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to generate image.", { id: toastId, description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleGenerateImage(); } };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        onClick={() => document.getElementById('image-upload-input')?.click()}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600"><span className="font-semibold text-blue-600">{t.uploadInstructions}</span></p>
        <p className="text-xs text-gray-500">{t.uploadConstraints}</p>
        <input id="image-upload-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.imageUrl}</label>
        <input type="text" value={currentImageUrl} onChange={(e) => onImageUrlChange(e.target.value)} placeholder={t.imageUrlPlaceholder} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>

      {currentImageUrl && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{t.imagePreview}</p>
          <img src={currentImageUrl} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-md border" />
        </div>
      )}

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center"><Search className="mr-2 text-blue-500" size={20} /> {t.stockPhotoSearch}</h3>
        <div className="flex space-x-2">
          <input type="text" value={stockPhotoQuery} onChange={(e) => setStockPhotoQuery(e.target.value)} onKeyDown={handleStockPhotoSearchKeyDown} placeholder={t.stockPhotoPlaceholder} className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm" />
          <button onClick={handleStockPhotoSearch} disabled={isSearchingStockPhotos} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center min-w-[100px]">{isSearchingStockPhotos ? <Loader size={20} className="animate-spin" /> : t.search}</button>
        </div>
        {stockPhotos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4 max-h-60 overflow-y-auto p-1 border rounded-md">
            {stockPhotos.map(photo => (
              <button key={photo.id} onClick={() => handleStockPhotoSelect(photo)} className="aspect-video block overflow-hidden rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <img src={photo.urls.small} alt={photo.alt_description} className="w-full h-full object-cover transition-transform hover:scale-110" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center"><Sparkles className="mr-2 text-purple-500" size={20} /> {t.aiImageGeneration}</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={handleAiInputKeyDown}
            placeholder={t.aiImagePlaceholder}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
          <div className="flex space-x-2">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="p-2 border border-gray-300 rounded-md shadow-sm bg-white flex-grow"
              aria-label="Aspect Ratio"
            >
              <option value="16:9">Landscape (16:9)</option>
              <option value="1:1">Square (1:1)</option>
              <option value="9:16">Portrait (9:16)</option>
              <option value="4:3">Standard (4:3)</option>
              <option value="3:4">Tall (3:4)</option>
            </select>
            <button onClick={handleGenerateImage} disabled={isGenerating} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center min-w-[100px]">{isGenerating ? <Loader size={20} className="animate-spin" /> : t.generate}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;