"use client";

import React, { useEffect, ReactNode } from 'react';
import { useSite } from '@/context/SiteContext';
import { useSiteMode } from '@/context/SiteModeContext';
import { isSiteEditable } from '@/services/plansService';
import { ModeToggle } from '@/components/ModeToggle';
import EditorModal from '@/components/EditorModal';
import Toolbar from '@/components/Toolbar';
import GDPRBanner from '@/components/GDPRBanner';
import AppSkeleton from '@/components/skeletons/AppSkeleton';
import SectionControls from '@/components/SectionControls';
import SectionStyleEditorModal from '@/components/SectionStyleEditorModal';
import AIRebuildModal from '@/components/AIRebuildModal';
import CardLayoutModal from '@/components/CardLayoutModal';
import SlideStyleEditorModal from '@/components/SlideStyleEditorModal';
import * as Sections from '@/components/sections';
import { resolveBackgroundImage } from '@/utils/styleUtils';

const componentMap: { [key: string]: React.FC<any> } = {
    Header: Sections.Header,
    Hero: Sections.Hero,
    About: Sections.About,
    Services: Sections.Services,
    Stats: Sections.Stats,
    Portfolio: Sections.Portfolio,
    Team: Sections.Team,
    Clients: Sections.Clients,
    Pricing: Sections.Pricing,
    Testimonials: Sections.Testimonials,
    Blog: Sections.Blog,
    FAQ: Sections.FAQ,
    HowItWorks: Sections.HowItWorks,
    Contact: Sections.Contact,
    Footer: Sections.Footer,
};

const SiteContent: React.FC = () => {
    const { siteConfig, isLoading, error, getImageUrl, startEditing, retryLoad } = useSite();
    const { isEditMode } = useSiteMode();

    // Event listener pentru dublu-click pe elementele editabile
    useEffect(() => {
        if (!isEditMode) return;

        const handleDoubleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const editableElement = target.closest('[data-editable="true"]') as HTMLElement;

            if (editableElement) {
                e.preventDefault();
                e.stopPropagation();

                const sectionId = editableElement.getAttribute('data-section-id');
                const elementId = editableElement.getAttribute('data-element-id');

                if (sectionId && elementId) {
                    startEditing(sectionId, elementId);
                }
            }
        };

        document.addEventListener('dblclick', handleDoubleClick);
        return () => document.removeEventListener('dblclick', handleDoubleClick);
    }, [isEditMode, startEditing]);

    if (isLoading) {
        return <AppSkeleton />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Eroare la încărcarea site-ului</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={retryLoad}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Încearcă din nou
                    </button>
                </div>
            </div>
        );
    }

    if (!siteConfig) {
        return <AppSkeleton />;
    }

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const HeaderComponent = headerSection ? componentMap[headerSection.component] : null;

    const shouldShow = (section: (typeof siteConfig.sections)[string] | undefined) => {
        if (!section) return false;
        if (section.visible) return true;
        if (isEditMode) return true; // În mod editare, arată toate secțiunile
        return false;
    };

    return (
        <>
            {/* Render Header outside of main, without any wrappers */}
            {headerSection && HeaderComponent && shouldShow(headerSection) && <HeaderComponent sectionId={headerSection.id} />}

            <main>
                {siteConfig.sectionOrder.map(sectionId => {
                    const section = siteConfig.sections[sectionId];
                    // Skip header, it's rendered above
                    if (!section || section.component === 'Header') return null;

                    if (!shouldShow(section)) return null;

                    const Component = componentMap[section.component];
                    if (!Component) {
                        console.warn(`Component "${section.component}" not found in componentMap.`);
                        return null;
                    }

                    const resolvedStyles = resolveBackgroundImage(section.styles, getImageUrl);
                    const finalStyles = { ...(resolvedStyles || {}), scrollMarginTop: '110px' };

                    return (
                        <div key={section.id} id={section.id} className="relative group" style={finalStyles}>
                            {isEditMode && <SectionControls sectionId={section.id} />}
                            <div className={!section.visible && isEditMode ? 'opacity-50 border-2 border-dashed border-yellow-500' : ''}>
                                <Component sectionId={section.id} />
                            </div>
                        </div>
                    );
                })}
            </main>
        </>
    );
};

// FIX: Added children prop to allow wrapping other page content
interface AppProps {
    children?: ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
    const { isEditMode } = useSiteMode();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (!link) return;

            const href = link.getAttribute('href');

            if (href) {
                // Let Next.js handle its own routing for internal pages like /blog/[slug]
                if (href.startsWith('/')) {
                    return;
                }

                // Handle in-page anchor links
                else if (href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const elementId = href.substring(1);
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        };

        // Add event listener with passive option for better performance
        document.addEventListener('click', handleClick, { passive: false });

        // Cleanup function
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <>
            {/* FIX: Render children if provided, otherwise render default SiteContent */}
            {children || <SiteContent />}
            {isSiteEditable() && <ModeToggle />}
            {isSiteEditable() && <Toolbar />}
            <GDPRBanner />
            {isEditMode && (
                <>
                    <EditorModal />
                    <SectionStyleEditorModal />
                    <CardLayoutModal />
                    <SlideStyleEditorModal />
                    <AIRebuildModal />
                </>
            )}
        </>
    );
};

export default App;