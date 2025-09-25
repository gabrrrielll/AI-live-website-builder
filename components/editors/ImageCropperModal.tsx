"use client";

import React, { useState, useRef, useMemo } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

interface ImageCropperModalProps {
  src: string;
  onSave: (croppedImageUrl: string) => void;
  onClose: () => void;
}

const ASPECT_RATIO = 16 / 9;
const MIN_WIDTH = 150;

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ src, onSave, onClose }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].editors, [language]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, ASPECT_RATIO);
    setCrop(crop);
  }

  async function handleSaveCrop() {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      throw new Error('Crop details not available');
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    onSave(base64Image);
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden" style={{ width: '90%', height: '80%', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{t.cropImage}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 flex-grow overflow-auto flex items-center justify-center">
          {src && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={ASPECT_RATIO}
              minWidth={MIN_WIDTH}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={src}
                onLoad={onImageLoad}
                style={{ maxHeight: '70vh' }}
                crossOrigin="anonymous"
              />
            </ReactCrop>
          )}
        </div>
        <div className="flex justify-end p-3 sm:p-4 border-t space-x-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm sm:text-base">
            {t.cancel}
          </button>
          <button onClick={handleSaveCrop} className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base">
            {t.cropImage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;