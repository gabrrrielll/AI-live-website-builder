"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { BlogListing } from '@/components/sections/BlogListing';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SiteConfig } from '@/types';

interface BlogListingClientProps {
    siteConfig: SiteConfig;
}

export default function BlogListingClient({ siteConfig }: BlogListingClientProps) {
    const { getImageUrl } = useSite();
    const { language } = useLanguage();
    const t = translations[language].blogPage;

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    return (
        <>
            {headerSection && <Header sectionId={headerSection.id} />}
            <main>
                {/* Breadcrumb */}
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link to="/" className="flex items-center hover:text-[#c29a47] transition-colors">
                            <Home size={16} className="mr-1" />
                            {t.breadcrumbHome}
                        </Link>
                        <ChevronRight size={16} />
                        <span className="text-gray-800 font-medium">
                            {t.breadcrumbBlog}
                        </span>
                    </nav>
                </div>
                <BlogListing />
            </main>
            {footerSection && (
                <div id={footerSection.id} style={footerStyles}>
                    <Footer sectionId={footerSection.id} />
                </div>
            )}
        </>
    );
}

