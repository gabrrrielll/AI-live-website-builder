"use client";

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import ColorPicker from './ColorPicker';
import ImageSelector from './ImageSelector';
import ImageCropperModal from './ImageCropperModal';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { useSite } from '@/context/SiteContext';

interface SectionBackgroundEditorProps {
  initialStyles: React.CSSProperties;
  onSave: (updatedStyles: React.CSSProperties) => void;
}

type BackgroundType = 'color' | 'gradient' | 'image';

interface ParsedBackground {
  type: BackgroundType;
  color: string;
  color1: string;
  color2: string;
  imageUrl: string;
  overlayColor: string;
}

const SectionBackgroundEditor: React.FC<SectionBackgroundEditorProps> = ({ initialStyles, onSave }) => {
  const { storeImage, getImageUrl } = useSite();
  const [styles, setStyles] = useState<React.CSSProperties>(initialStyles);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const parseBackground = (bg: string | undefined): ParsedBackground => {
    if (!bg) return { type: 'color', color: '#ffffff', color1: '#ffffff', color2: '#000000', imageUrl: '', overlayColor: 'rgba(0,0,0,0)' };

    const imageUrlMatch = bg.match(/url\((['"]?)(.*?)\1\)/);
    const gradientMatch = bg.match(/linear-gradient\((.+)\)/);

    if (imageUrlMatch) {
      const overlayMatch = bg.match(/rgba?\(.+?\)/);
      let imageUrl = imageUrlMatch[2];
      // Resolve local ID to data URL for display in the editor
      if (imageUrl.startsWith('local-img-')) {
        imageUrl = getImageUrl(imageUrl) || imageUrl;
      }
      return {
        type: 'image',
        imageUrl: imageUrl,
        overlayColor: overlayMatch ? overlayMatch[0] : 'rgba(0,0,0,0)',
        color: '#ffffff', color1: '#ffffff', color2: '#000000'
      };
    }
    if (gradientMatch) {
      const colors = bg.match(/(rgba?\(.+?\)|#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}))/g) || ['#ffffff', '#000000'];
      return {
        type: 'gradient',
        color1: colors[0],
        color2: colors[1],
        imageUrl: '', overlayColor: 'rgba(0,0,0,0)', color: '#ffffff'
      };
    }
    return {
      type: 'color',
      color: bg,
      color1: '#ffffff', color2: '#000000', imageUrl: '', overlayColor: 'rgba(0,0,0,0)'
    };
  };

  const initialParsed = parseBackground((initialStyles.background || initialStyles.backgroundColor) as string | undefined);

  const [backgroundType, setBackgroundType] = useState<BackgroundType>(initialParsed.type);
  const [gradientColors, setGradientColors] = useState({ color1: initialParsed.color1, color2: initialParsed.color2 });
  const [imageUrl, setImageUrl] = useState(initialParsed.imageUrl);
  const [overlayColor, setOverlayColor] = useState(initialParsed.overlayColor);

  const handleSave = async () => {
    let finalStyles = styles;
    const bg = styles.background as string;

    // Check if the background is a new Base64 image that needs to be stored
    if (bg && bg.includes('url(\'data:image')) {
      const urlMatch = bg.match(/url\((['"]?)(data:image.+?)\1\)/);
      if (urlMatch && urlMatch[2]) {
        try {
          const base64Url = urlMatch[2];
          const imageId = await storeImage(base64Url);
          const newBg = bg.replace(base64Url, imageId);
          finalStyles = { ...styles, background: newBg };
        } catch (error) {
          return; // Error is already toasted by storeImage
        }
      }
    }
    onSave(finalStyles);
    toast.success(t.backgroundUpdated);
  };

  const updateImageStyles = (url: string, overlay: string) => {
    setStyles({
      background: `linear-gradient(${overlay}, ${overlay}), url('${url}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    });
  };

  const handleBackgroundTypeChange = (type: BackgroundType) => {
    setBackgroundType(type);
    if (type === 'color') {
      setStyles({ backgroundColor: '#ffffff' });
    } else if (type === 'image') {
      const url = imageUrl || 'https://picsum.photos/1600/900';
      setImageUrl(url);
      updateImageStyles(url, overlayColor);
    } else if (type === 'gradient') {
      const { color1, color2 } = gradientColors;
      setStyles({ background: `linear-gradient(to right, ${color1}, ${color2})` });
    }
  };

  const handleGradientColorChange = (colorKey: 'color1' | 'color2', value: string) => {
    const newColors = { ...gradientColors, [colorKey]: value };
    setGradientColors(newColors);
    setStyles({ background: `linear-gradient(to right, ${newColors.color1}, ${newColors.color2})` });
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    updateImageStyles(url, overlayColor);
  };

  const handleOverlayColorChange = (color: string) => {
    setOverlayColor(color);
    updateImageStyles(imageUrl, color);
  };

  const handleCropSave = async (croppedImageUrl: string) => {
    try {
      const imageId = await storeImage(croppedImageUrl);
      handleImageUrlChange(imageId);
      setImageToCrop(null);
      toast.success("Image cropped successfully!");
    } catch (error) {
      console.error('🖼️ [SectionBackgroundEditor] Failed to store cropped image:', error);
      toast.error('Failed to save cropped image');
    }
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
        <div className="flex justify-center space-x-2 border border-gray-200 rounded-lg p-1 bg-gray-100">
          {(['color', 'gradient', 'image'] as BackgroundType[]).map(type => (
            <button
              key={type}
              onClick={() => handleBackgroundTypeChange(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-full ${backgroundType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {t[type as keyof typeof t]}
            </button>
          ))}
        </div>

        {backgroundType === 'color' && (
          <ColorPicker
            label={t.backgroundColor}
            color={styles.backgroundColor as string || '#ffffff'}
            onChange={(newColor) => setStyles({ backgroundColor: newColor })}
          />
        )}

        {backgroundType === 'gradient' && (
          <div className="space-y-4">
            <ColorPicker
              label={t.color1}
              color={gradientColors.color1}
              onChange={(newColor) => handleGradientColorChange('color1', newColor)}
            />
            <ColorPicker
              label={t.color2}
              color={gradientColors.color2}
              onChange={(newColor) => handleGradientColorChange('color2', newColor)}
            />
          </div>
        )}

        {backgroundType === 'image' && (
          <div className="space-y-4">
            <ImageSelector
              currentImageUrl={imageUrl}
              onImageUrlChange={handleImageUrlChange}
              onImageReadyToCrop={setImageToCrop}
              onAltTextSuggestion={() => { }} // Not needed for background
            />
            <div className="border-t pt-4">
              <ColorPicker
                label={t.overlayColor}
                color={overlayColor}
                onChange={handleOverlayColorChange}
              />
            </div>
          </div>
        )}

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
    </>
  );
};

export default SectionBackgroundEditor;