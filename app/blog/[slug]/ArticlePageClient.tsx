"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import ArticleEditor from '@/components/ArticleEditor';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import type { Article, SiteConfig } from '@/types';

interface ArticlePageClientProps {
    article: Article | null;
    siteConfig: SiteConfig | null;
    slug?: string;
}

export default function ArticlePageClient({ article, siteConfig, slug }: ArticlePageClientProps) {
    const { getImageUrl } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].blogPage, [language]);

    // Dacă articolul nu este furnizat, încarcă din localStorage sau API
    const [loadedArticle, setLoadedArticle] = useState<Article | null>(article);
    const [loadedSiteConfig, setLoadedSiteConfig] = useState<SiteConfig | null>(siteConfig);
    const [loading, setLoading] = useState(!article);

    useEffect(() => {
        if (!article && slug) {
            const loadArticle = async () => {
                try {
                    // Try localStorage first
                    const localConfig = localStorage.getItem('site-config');
                    if (localConfig) {
                        const config = JSON.parse(localConfig);
                        setLoadedSiteConfig(config);
                        const foundArticle = config.articles.find((a: Article) => a.slug === slug);
                        setLoadedArticle(foundArticle || null);
                    } else {
                        // Fallback to API
                        const response = await fetch('https://bibic.ro/api/api-site-config.php');
                        if (response.ok) {
                            const config = await response.json();
                            setLoadedSiteConfig(config);
                            const foundArticle = config.articles.find((a: Article) => a.slug === slug);
                            setLoadedArticle(foundArticle || null);
                        }
                    }
                } catch (error) {
                    console.error('Error loading article:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadArticle();
        }
    }, [article, slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                    <p className="mt-4 text-gray-600">Se încarcă articolul...</p>
                </div>
            </div>
        );
    }

    const currentArticle = loadedArticle || article;
    const currentSiteConfig = loadedSiteConfig || siteConfig;

    if (!currentArticle || !currentSiteConfig) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Articol Negăsit</h1>
                    <p className="text-gray-600">Articolul pe care îl cauți nu există sau a fost mutat.</p>
                </div>
            </div>
        );
    }

    const headerSection = currentSiteConfig.sectionOrder
        .map(id => currentSiteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = currentSiteConfig.sectionOrder
        .map(id => currentSiteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    return (
        <App>
            <>
                {headerSection && <Header sectionId={headerSection.id} />}
                <main>
                    {/* Breadcrumb */}
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/" passHref legacyBehavior>
                                <a className="flex items-center hover:text-[#c29a47] transition-colors">
                                    <Home size={16} className="mr-1" />
                                    {t.breadcrumbHome}
                                </a>
                            </Link>
                            <ChevronRight size={16} />
                            <Link href="/blog" passHref legacyBehavior>
                                <a className="hover:text-[#c29a47] transition-colors">
                                    {t.breadcrumbBlog}
                                </a>
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-800 font-medium truncate max-w-xs">
                                {currentArticle.title[language]}
                            </span>
                        </nav>
                    </div>
                    <ArticleEditor article={currentArticle} />
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