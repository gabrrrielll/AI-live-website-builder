import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SiteProvider } from '@/context/SiteContext';
import { SiteModeProvider } from '@/context/SiteModeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { TestModeProvider } from '@/context/TestModeContext';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';

// Import UI components
import { ModeToggle } from '@/components/ModeToggle';
import Toolbar from '@/components/Toolbar';
import GDPRBanner from '@/components/GDPRBanner';
import EditorModal from '@/components/EditorModal';
import SectionStyleEditorModal from '@/components/SectionStyleEditorModal';
import CardLayoutModal from '@/components/CardLayoutModal';
import SlideStyleEditorModal from '@/components/SlideStyleEditorModal';
import AIRebuildModal from '@/components/AIRebuildModal';

// Import pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CookieSettingsPage from './pages/CookieSettingsPage';
import EnglishPrivacyPolicyPage from './pages/en/PrivacyPolicyPage';
import EnglishTermsAndConditionsPage from './pages/en/TermsAndConditionsPage';
import EnglishCookiePolicyPage from './pages/en/CookiePolicyPage';
import EnglishCookieSettingsPage from './pages/en/CookieSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Import utility functions
import { isSiteEditable } from '@/services/plansService';

function App() {
    return (
        <ErrorBoundary>
            <LanguageProvider>
                <TestModeProvider>
                    <SiteModeProvider>
                        <SiteProvider>
                            <Routes>
                                {/* Home page */}
                                <Route path="/" element={<HomePage />} />

                                {/* Blog pages */}
                                <Route path="/blog" element={<BlogPage />} />
                                <Route path="/blog/:slug/*" element={<ArticlePage />} />

                                {/* Legal pages - Romanian */}
                                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                                <Route path="/cookie-settings" element={<CookieSettingsPage />} />

                                {/* Legal pages - English */}
                                <Route path="/en/privacy-policy" element={<EnglishPrivacyPolicyPage />} />
                                <Route path="/en/terms-and-conditions" element={<EnglishTermsAndConditionsPage />} />
                                <Route path="/en/cookie-policy" element={<EnglishCookiePolicyPage />} />
                                <Route path="/en/cookie-settings" element={<EnglishCookieSettingsPage />} />

                                {/* 404 page */}
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>

                            {/* Global UI Components */}
                            {isSiteEditable() && <ModeToggle />}
                            {isSiteEditable() && <Toolbar />}
                            <GDPRBanner />

                            {/* Editor Modals */}
                            <EditorModal />
                            <SectionStyleEditorModal />
                            <CardLayoutModal />
                            <SlideStyleEditorModal />
                            <AIRebuildModal />

                            <Toaster richColors position="top-right" closeButton />
                        </SiteProvider>
                    </SiteModeProvider>
                </TestModeProvider>
            </LanguageProvider>
            <ServiceWorkerRegistrar />
        </ErrorBoundary>
    );
}

export default App;