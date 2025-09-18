"use client";

import React from 'react';
import * as icons from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

// Function to transform HTML links to React Router links
const transformHtmlLinks = (htmlContent: string): string => {
  let transformedContent = htmlContent;

  // Transform page: links (e.g., page:terms-page -> /terms-and-conditions)
  transformedContent = transformedContent.replace(
    /<a\s+href="page:([^"]*)"([^>]*)>([^<]*)<\/a>/gi,
    (match, pageType, attributes, text) => {
      let route = '';
      switch (pageType) {
        case 'terms-page':
          route = '/terms-and-conditions';
          break;
        case 'privacy-page':
          route = '/privacy-policy';
          break;
        case 'cookie-page':
          route = '/cookie-policy';
          break;
        default:
          route = `/${pageType}`;
      }

      const cleanAttributes = attributes.replace(/href="[^"]*"/g, '').trim();
      return `<a data-react-router-link="${route}"${cleanAttributes ? ' ' + cleanAttributes : ''}>${text}</a>`;
    }
  );

  // Transform anchor links to scroll to sections on home page
  transformedContent = transformedContent.replace(
    /<a\s+href="#([^"]*)"([^>]*)>([^<]*)<\/a>/gi,
    (match, anchor, attributes, text) => {
      const cleanAttributes = attributes.replace(/href="[^"]*"/g, '').trim();
      return `<a data-scroll-to="#${anchor}"${cleanAttributes ? ' ' + cleanAttributes : ''}>${text}</a>`;
    }
  );

  // Transform internal links to use React Router
  transformedContent = transformedContent.replace(
    /<a\s+href="\/([^"]*)"([^>]*)>([^<]*)<\/a>/gi,
    (match, path, attributes, text) => {
      // Skip external links or special protocols
      if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
        return match;
      }

      // Transform internal links to use React Router Link component
      const cleanAttributes = attributes.replace(/href="[^"]*"/g, '').trim();
      return `<a data-react-router-link="/${path}"${cleanAttributes ? ' ' + cleanAttributes : ''}>${text}</a>`;
    }
  );

  return transformedContent;
};

// Function to render transformed content with React Router links
const renderWithRouterLinks = (htmlContent: string, navigate: (path: string) => void) => {
  const transformedContent = transformHtmlLinks(htmlContent);

  // Parse and render the content, replacing data-react-router-link and data-scroll-to with actual components
  const parts = transformedContent.split(/(<a[^>]*(?:data-react-router-link|data-scroll-to)="[^"]*"[^>]*>.*?<\/a>)/gi);

  return parts.map((part, index) => {
    const routerLinkMatch = part.match(/<a[^>]*data-react-router-link="([^"]*)"([^>]*)>([^<]*)<\/a>/i);
    const scrollLinkMatch = part.match(/<a[^>]*data-scroll-to="#([^"]*)"([^>]*)>([^<]*)<\/a>/i);

    if (routerLinkMatch) {
      const [, path, attributes, text] = routerLinkMatch;
      const classNameMatch = attributes.match(/class="([^"]*)"/);
      const className = classNameMatch ? classNameMatch[1] : '';

      return (
        <Link key={index} to={path} className={className}>
          {text}
        </Link>
      );
    }

    if (scrollLinkMatch) {
      const [, anchor, attributes, text] = scrollLinkMatch;
      const classNameMatch = attributes.match(/class="([^"]*)"/);
      const className = classNameMatch ? classNameMatch[1] : '';

      const handleScrollClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If not on home page, navigate to home first, then scroll to section
          navigate('/');
          // Use setTimeout to ensure navigation completes before scrolling
          setTimeout(() => {
            const element = document.getElementById(anchor);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      };

      return (
        <a
          key={index}
          href={`#${anchor}`}
          onClick={handleScrollClick}
          className={className}
        >
          {text}
        </a>
      );
    }

    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
  });
};

const Editable: React.FC<EditableProps> = ({ sectionId, elementId, as: Component = 'div', className, ...props }) => {
  const { getElement, isEditMode, getImageUrl } = useSite();
  const { language } = useLanguage();
  const navigate = useNavigate();

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
          {...props}
        >
          {renderWithRouterLinks(content, navigate)}
        </Component>
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