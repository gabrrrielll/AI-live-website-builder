"use client";

import React, { useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { Eye, EyeOff, Trash2, Palette, ArrowUp, ArrowDown, LayoutGrid, Copy, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { useNavigate } from 'react-router-dom';

interface SectionControlsProps {
  sectionId: string;
}

const SECTIONS_WITH_LAYOUTS = ['Hero', 'About', 'Services', 'Stats', 'Team', 'Clients', 'Pricing', 'Testimonials', 'Blog', 'HowItWorks', 'Portfolio', 'FAQ'];

const SectionControls: React.FC<SectionControlsProps> = ({ sectionId }) => {
  const { siteConfig, isEditMode, toggleSectionVisibility, deleteSection, startEditingSectionStyles, moveSection, startEditingSectionLayout, duplicateSection, addArticle } = useSite();
  const { language } = useLanguage();
  const t = useMemo(() => translations[language].sectionControls, [language]);
  const navigate = useNavigate();

  if (!isEditMode || !siteConfig) return null;

  const section = siteConfig.sections[sectionId];
  if (!section) return null;

  const isVisible = section.visible;
  const isHeaderFooter = ['Header', 'Footer'].includes(section.component);
  const hasLayouts = SECTIONS_WITH_LAYOUTS.includes(section.component);
  const hidePalette = section.component === 'Hero';
  const canBeDuplicated = section.component === 'About' || section.component === 'Hero';
  const isDeletable = (section.component === 'About' && section.id.startsWith('about-clone-')) || (section.component === 'Hero' && section.id.startsWith('hero-clone-'));
  const isBlogSection = section.component === 'Blog';
  const isHeroSection = section.component === 'Hero';

  const sectionOrder = siteConfig.sectionOrder;
  const currentIndex = sectionOrder.indexOf(sectionId);
  const canMoveUp = currentIndex > 1; // Cannot move above header (index 0) or hero (index 1)
  const canMoveDown = currentIndex < sectionOrder.length - 2; // Cannot move below the section before the footer

  const handleAddArticle = () => {
    const newArticle = addArticle();
    if (newArticle) {
      navigate(`/blog/${newArticle.slug}`);
    }
  };

  return (
    <div className={`absolute z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md ${isHeaderFooter ? 'top-2 left-2 md:block hidden' : 'top-2 right-2'
      }`}>
      {isBlogSection && (
        <button
          onClick={handleAddArticle}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          title={t.addArticle}
        >
          <PlusCircle size={18} />
        </button>
      )}
      {canBeDuplicated && (
        <button
          onClick={() => duplicateSection(sectionId)}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          title={t.duplicateSection}
        >
          <Copy size={18} />
        </button>
      )}
      {hasLayouts && !isHeroSection && (
        <button
          onClick={() => startEditingSectionLayout(sectionId)}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          title={t.editLayout}
        >
          <LayoutGrid size={18} />
        </button>
      )}
      {isHeroSection && (
        <button
          onClick={() => startEditingSectionLayout(sectionId)}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          title={t.editLayout}
        >
          <LayoutGrid size={18} />
        </button>
      )}
      {!hidePalette && (
        <button
          onClick={() => startEditingSectionStyles(sectionId)}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          title={t.editStyle}
        >
          <Palette size={18} />
        </button>
      )}
      {!isHeaderFooter && (
        <button
          onClick={() => toggleSectionVisibility(sectionId)}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          title={isVisible ? t.hideSection : t.showSection}
        >
          {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
      {!isHeaderFooter && (
        <>
          <button
            onClick={() => moveSection(sectionId, 'up')}
            disabled={!canMoveUp}
            className="p-2 text-gray-700 hover:bg-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
            title={t.moveSectionUp}
          >
            <ArrowUp size={18} />
          </button>
          <button
            onClick={() => moveSection(sectionId, 'down')}
            disabled={!canMoveDown}
            className="p-2 text-gray-700 hover:bg-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
            title={t.moveSectionDown}
          >
            <ArrowDown size={18} />
          </button>
          {isDeletable && (
            <button
              onClick={() => deleteSection(sectionId)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full"
              title={t.deleteSection}
            >
              <Trash2 size={18} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SectionControls;