"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { BlogListing } from '@/components/sections/BlogListing';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import type { SiteConfig } from '@/types';

interface BlogListingClientProps {
    siteConfig: SiteConfig;
}

export default function BlogListingClient({ siteConfig }: BlogListingClientProps) {
    const { getImageUrl } = useSite();

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    return (
        <App>
            <>
                {headerSection && <Header sectionId={headerSection.id} />}
                <main>
                    <BlogListing />
                </main>
                {footerSection && (
                    <div id={footerSection.id} style={footerStyles}>
                        <Footer sectionId={footerSection.id} />
                    </div>
                )}
            </>
        </App>
    );
}

