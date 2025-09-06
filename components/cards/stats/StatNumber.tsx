"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCountUp } from '@/hooks/useCountUp';

export const StatNumber: React.FC<{ sectionId: string, elementId: string }> = ({ sectionId, elementId }) => {
    const { getElement, isEditMode } = useSite();
    const { language } = useLanguage();
    const numberElement = getElement(sectionId, elementId);
    
    const plainTextContent = numberElement?.type === 'rich-text' 
      ? (numberElement.content[language] || '').replace(/<[^>]+>/g, '')
      : '0';

    const endValue = parseInt(plainTextContent.replace(/[^0-9]/g, ''), 10) || 0;
      
    const suffix = plainTextContent.replace(/[0-9,.]/g, '');

    const numberStyles = numberElement?.styles || {};
    const [count, ref] = useCountUp(endValue);
    
    return (
        <div 
          data-editable={isEditMode}
          data-section-id={sectionId}
          data-element-id={elementId}
          className={isEditMode ? 'editable-outline' : ''} 
          ref={ref}
          style={numberStyles}
        >
          {count.toLocaleString('ro-RO')}{suffix}
        </div>
    );
};