"use client";

import React, { useState, useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, Eye, EyeOff } from 'lucide-react';
import Editable from '@/components/Editable';
import SectionControls from '@/components/SectionControls';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface HeaderProps {
    sectionId: string;
}

export const Header: React.FC<HeaderProps> = ({ sectionId }) => {
    const { siteConfig, isEditMode, toggleNavLinkVisibility } = useSite();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showHamburger, setShowHamburger] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isArticlePage = pathname.startsWith('/blog/');

    const headerSection = siteConfig?.sections[sectionId];

    // Refs for layout measurement
    const navContainerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const dynamicElementsMeasureRef = useRef<HTMLDivElement>(null); // For measuring links + switcher

    const navItems = useMemo(() => {
        return siteConfig?.sectionOrder
          .map(id => siteConfig.sections[id])
          .filter(section => section && section.elements[`${section.id}-nav-title`] && (section.visible || isEditMode)) || [];
    }, [siteConfig, isEditMode]);

    const NavLinks: React.FC<{ inPanel?: boolean; forMeasurement?: boolean }> = ({ inPanel = false, forMeasurement = false }) => (
      <>
        {navItems.map(item => {
            const isLinkVisible = item.navLinkVisible !== false;
            const href = isArticlePage ? `/#${item.id}` : `#${item.id}`;

            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (inPanel) setIsMenuOpen(false);
                if (isArticlePage) {
                    e.preventDefault();
                    router.push(href);
                }
            };

            // For measurement, only include links that are meant to be visible in the main nav.
            if (forMeasurement && !isLinkVisible) {
                return null;
            }

            // In preview mode, completely hide links that are not visible.
            if (!isLinkVisible && !isEditMode) {
                return null;
            }
            
            return (
              <div key={item.id} className="relative group/nav-item">
                <a
                  href={href}
                  onClick={handleClick}
                  className={`whitespace-nowrap text-gray-600 hover:text-[#c29a47] transition-colors
                      ${!item.visible && isEditMode ? 'opacity-50 italic' : ''}
                      ${!isLinkVisible && isEditMode ? 'line-through text-red-500/70' : ''}`}
                >
                  <Editable sectionId={item.id} elementId={`${item.id}-nav-title`} as="div" className="px-1 py-2"/>
                </a>
                {isEditMode && (
                    <button
                        onClick={() => toggleNavLinkVisibility(item.id)}
                        className="absolute top-1/2 -translate-y-1/2 -right-7 p-1 text-gray-500 hover:bg-gray-200 rounded-full opacity-0 group-hover/nav-item:opacity-100"
                        title={isLinkVisible ? "Hide Nav Link" : "Show Nav Link"}
                    >
                        {isLinkVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                )}
              </div>
            );
        })}
      </>
    );

    const checkWidth = useCallback(() => {
        const navElement = navContainerRef.current;
        const logoElement = logoRef.current;
        const dynamicElements = dynamicElementsMeasureRef.current;

        if (!navElement || !logoElement || !dynamicElements) {
            return;
        }

        const navStyle = window.getComputedStyle(navElement);
        const paddingLeft = parseFloat(navStyle.paddingLeft);
        const paddingRight = parseFloat(navStyle.paddingRight);
        const navContentWidth = navElement.clientWidth - paddingLeft - paddingRight;
        const logoWidth = logoElement.offsetWidth;
        const requiredNavWidth = dynamicElements.scrollWidth;
        const minimumGap = 32;
        const totalRequiredWidth = logoWidth + requiredNavWidth + minimumGap;
        const shouldShowHamburger = totalRequiredWidth > navContentWidth;

        setShowHamburger(current => {
            if (current !== shouldShowHamburger) {
                if (shouldShowHamburger) setIsMenuOpen(false);
                return shouldShowHamburger;
            }
            return current;
        });

    }, []);

    useLayoutEffect(() => {
        const navElement = navContainerRef.current;
        if (!navElement) return;
        const observer = new ResizeObserver(checkWidth);
        observer.observe(navElement);
        const timeoutId = setTimeout(checkWidth, 100);
        return () => { clearTimeout(timeoutId); observer.disconnect(); };
    }, [checkWidth, siteConfig]);
    
    return (
        <header className={`bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 relative group ${headerSection && !headerSection.visible && isEditMode ? 'opacity-50' : ''}`}>
            {isEditMode && <SectionControls sectionId={sectionId} />}

            <div ref={dynamicElementsMeasureRef} className="absolute invisible -top-96 flex items-center whitespace-nowrap">
                <div className="flex items-center space-x-4">
                    <NavLinks forMeasurement={true} />
                </div>
                <div className="ml-4">
                    <LanguageSwitcher />
                </div>
            </div>

            <nav ref={navContainerRef} className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div ref={logoRef}>
                    <Link href="/" aria-label="Back to Homepage">
                      <Editable sectionId={sectionId} elementId="header-logo" />
                    </Link>
                </div>
                
                {!showHamburger ? (
                    <div className="flex items-center ml-auto">
                        <div className="flex items-center space-x-4">
                            <NavLinks />
                        </div>
                        <div className="ml-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <button onClick={() => setIsMenuOpen(p => !p)} className="text-gray-800 ml-8">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                )}
            </nav>

            {isMenuOpen && showHamburger && (
                <div className="bg-white/95 backdrop-blur-md py-4 absolute w-full shadow-lg">
                    <div className="flex flex-col items-center space-y-4">
                        <NavLinks inPanel={true} />
                        <LanguageSwitcher />
                    </div>
                </div>
            )}
        </header>
    );
};