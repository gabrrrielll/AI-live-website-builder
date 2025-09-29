import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useSite } from '@/context/SiteContext';
import BlogListingClient from '@/components/sections/BlogListingClient';

const BlogPage: React.FC = () => {
    const { siteConfig, isLoading } = useSite();

    if (isLoading) {
        return (
            <PageWrapper
                title="Blog"
                description="Articole despre tehnologie și web design"
                url="/blog"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                        <p className="mt-4 text-gray-600">Se încarcă blog-ul...</p>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    if (!siteConfig) {
        return (
            <PageWrapper
                title="Blog"
                description="Articole despre tehnologie și web design"
                url="/blog"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Eroare la încărcare</h1>
                        <p className="text-gray-600">Nu s-a putut încărca configurația site-ului.</p>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            title="Blog"
            description="Articole despre tehnologie și web design"
            url="/blog"
        >
            <BlogListingClient siteConfig={siteConfig} />
        </PageWrapper>
    );
};

export default BlogPage;


