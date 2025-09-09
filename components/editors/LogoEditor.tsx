"use client";

import React, { useState, useCallback, useMemo } from 'react';
import type { LogoElement, Language, LocalizedString } from '@/types';
import { toast } from 'sonner';
import { UploadCloud, Sparkles, Loader } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';
import ColorPicker from './ColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { useSite } from '@/context/SiteContext';
import { generateImage, canUseImageGen, useImageGen } from '@/services/aiService';

interface LogoEditorProps {
  element: LogoElement;
  onSave: (updatedElement: Partial<LogoElement>) => void;
}

const LogoEditor: React.FC<LogoEditorProps> = ({ element, onSave }) => {
  const { storeImage, getImageUrl } = useSite();
  const { canUseImageGen, useImageGen, showLimitModal } = useTestMode();
  const [logoType, setLogoType] = useState<'text' | 'image'>(element.logoType);
  const [content, setContent] = useState<LocalizedString>(element.content);
  const [imageUrl, setImageUrl] = useState(element.imageUrl);
  const [alt, setAlt] = useState<LocalizedString>(element.alt);
  const [styles, setStyles] = useState(element.styles || {});
  const [activeLang, setActiveLang] = useState<Language>('ro');
  const [isDragging, setIsDragging] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const resolvedImageUrl = useMemo(() => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('local-img-')) {
      return getImageUrl(imageUrl) || '';
    }
    return imageUrl;
  }, [imageUrl, getImageUrl]);

  const handleSave = async () => {
    let finalImageUrl = imageUrl;
    if (logoType === 'image' && imageUrl.startsWith('data:image')) {
      try {
        finalImageUrl = await storeImage(imageUrl);
      } catch {
        return; // Error is already toasted
      }
    }
    onSave({ logoType, content, imageUrl: finalImageUrl, alt, styles });
    toast.success(t.logoUpdated);
  };

  const handleStyleChange = (prop: keyof React.CSSProperties, value: any) => {
    setStyles(prev => ({ ...prev, [prop]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for logos
        toast.error("File is too large. Please upload an image under 2MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type. Please upload an image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setImageToCrop(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedImageUrl: string) => {
    setImageUrl(croppedImageUrl);
    setImageToCrop(null);
    toast.success("Image cropped successfully!");
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
  }, []);

  const handleGenerateLogo = async () => {
    if (!canUseImageGen()) {
      toast.error("Ați atins limita de utilizare pentru această funcționalitate în versiunea de test.");
      return;
    }

    if (!aiPrompt.trim()) {
      toast.error(t.aiPromptError);
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Generating logo with AI... This can take a moment.");

    try {
      console.log('🖼️ [LogoEditor] Starting AI logo generation...');
      console.log('🖼️ [LogoEditor] AI Prompt:', aiPrompt);

      const result = await generateImage(aiPrompt);

      console.log('🖼️ [LogoEditor] Logo generation successful!');
      console.log('🖼️ [LogoEditor] Result type:', typeof result);
      console.log('🖼️ [LogoEditor] Result length:', result?.length || 0);

      setImageToCrop(result);
      setAlt({ ro: aiPrompt, en: aiPrompt });
      toast.success("AI logo generated! You can now crop it.", { id: toastId });
    } catch (error) {
      console.error('❌ [LogoEditor] Logo generation failed:');
      console.error('❌ [LogoEditor] Error:', error);
      console.error('❌ [LogoEditor] Error type:', typeof error);
      console.error('❌ [LogoEditor] Error message:', error instanceof Error ? error.message : 'Unknown error');

      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to generate logo.", { id: toastId, description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerateLogo();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-2 border border-gray-200 rounded-lg p-1 bg-gray-100">
        {(['text', 'image'] as const).map(type => (
          <button
            key={type}
            onClick={() => setLogoType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-full ${logoType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            {type === 'text' ? t.logoType : t.imageType}
          </button>
        ))}
      </div>

      {logoType === 'text' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.logoText}</label>
            <div className="flex border-b mb-2">
              <button onClick={() => setActiveLang('ro')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'ro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.romanian}</button>
              <button onClick={() => setActiveLang('en')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'en' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{t.english}</button>
            </div>
            <input
              type="text"
              value={content[activeLang]}
              onChange={(e) => setContent(prev => ({ ...prev, [activeLang]: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <ColorPicker
            label={t.textColor}
            color={styles.color as string || '#000000'}
            onChange={(newColor) => handleStyleChange('color', newColor)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => document.getElementById('logo-upload-input')?.click()}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{t.uploadLogo}</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">{t.logoConstraints}</p>
            <input id="logo-upload-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <Sparkles className="mr-2 text-purple-500" size={20} /> {t.aiLogoGeneration}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={handleAiInputKeyDown}
                placeholder={t.aiLogoPlaceholder}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm bg-white col-span-2 text-gray-900"
                  aria-label="Aspect Ratio"
                >
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="1:1">Square (1:1)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="4:3">Standard (4:3)</option>
                  <option value="3:4">Tall (3:4)</option>
                </select>
                <button
                  onClick={handleGenerateLogo}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center"
                >
                  {isGenerating ? <Loader size={20} className="animate-spin" /> : t.generate}
                </button>
              </div>
            </div>
          </div>

          {resolvedImageUrl && <img src={resolvedImageUrl} alt="Logo preview" className="mx-auto max-h-24 w-auto border rounded-md" />}
          <div>
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
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {t.saveChanges}
        </button>
      </div>
      {imageToCrop && (
        <ImageCropperModal
          src={imageToCrop}
          onSave={handleCropSave}
          onClose={() => setImageToCrop(null)}
        />
      )}
    </div>
  );
};

export default LogoEditor;