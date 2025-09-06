"use client";

import React from 'react';
import * as icons from 'lucide-react';
import type { SiteElement, LogoElement, RichTextElement, IconElement } from '@/types';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';

interface EditableProps {
  sectionId: string;
  elementId: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  [x: string]: any; // for other props like href
}

const Editable: React.FC<EditableProps> = ({ sectionId, elementId, as: Component = 'div', className, ...props }) => {
  const { getElement, isEditMode, getImageUrl } = useSite();
  const { language } = useLanguage();

  const element = getElement(sectionId, elementId);

  const isCurrentlyEditable = isEditMode;

  if (!element) {
    // In edit mode, show a placeholder for missing elements to avoid crashes.
    if (isEditMode) {
      return <div className="text-red-500 p-2 bg-red-100 border border-red-500">Error: Element "{elementId}" not found in section "{sectionId}"</div>;
    }
    // In preview mode, render nothing if element is missing.
    return null;
  }

  const combinedClassName = `${className || ''} ${isCurrentlyEditable ? 'editable-outline' : ''}`.trim();

  const elementStyles = element.styles || {};

  switch (element.type) {
    case 'rich-text':
      const content = (element as RichTextElement).content[language] || (element as RichTextElement).content['ro']; // fallback to RO
      return (
        <Component
          data-editable={isCurrentlyEditable}
          data-section-id={sectionId}
          data-element-id={elementId}
          className={`${combinedClassName} prose-content`.trim()}
          style={elementStyles}
          dangerouslySetInnerHTML={{ __html: content }}
          {...props}
        />
      );

    case 'image':
      let imageUrl = element.content;
      if (imageUrl.startsWith('local-img-')) {
        imageUrl = getImageUrl(imageUrl) || '';
      }
      return (
        <Component
          data-editable={isCurrentlyEditable}
          data-section-id={sectionId}
          data-element-id={elementId}
          className={combinedClassName}
          style={elementStyles}
          src={imageUrl}
          alt={element.alt[language] || element.alt['ro']} // fallback to RO
          {...props}
        />
      );

    case 'logo':
      const logoElement = element as LogoElement;
      if (logoElement.logoType === 'image' && logoElement.imageUrl) {
        let logoUrl = logoElement.imageUrl;
        if (logoUrl.startsWith('local-img-')) {
          logoUrl = getImageUrl(logoUrl) || '';
        }
        return (
          <img
            data-editable={isCurrentlyEditable}
            data-section-id={sectionId}
            data-element-id={elementId}
            className={`${combinedClassName} object-cover`}
            style={{ ...elementStyles, width: '125px', height: '70px' }}
            src={logoUrl}
            alt={logoElement.alt[language] || logoElement.alt['ro']}
            {...props}
          />
        );
      }
      // Fallback to text logo
      return (
        <span
          data-editable={isCurrentlyEditable}
          data-section-id={sectionId}
          data-element-id={elementId}
          className={combinedClassName}
          style={elementStyles}
          {...props}
        >
          {logoElement.content[language] || logoElement.content['ro']}
        </span>
      );

    case 'icon':
      const iconElement = element as IconElement;
      // @ts-ignore
      const LucideIcon = icons[iconElement.iconName];
      if (!LucideIcon) {
        if (isEditMode) {
          return <div className="text-red-500 p-2 bg-red-100 border border-red-500">Error: Icon "{iconElement.iconName}" not found</div>;
        }
        return null;
      }
      return (
        <Component
          data-editable={isCurrentlyEditable}
          data-section-id={sectionId}
          data-element-id={elementId}
          className={combinedClassName}
          style={{ ...elementStyles, color: iconElement.color }}
          {...props}
        >
          <LucideIcon
            size={iconElement.size}
            style={element.styles}
          />
        </Component>
      );

    default:
      return null;
  }
};

export default Editable;