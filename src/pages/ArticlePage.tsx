import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import ArticleEditor from '@/components/ArticleEditor';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { translations } from '@/utils/translations';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article, SiteConfig } from '@/types';
import { SITE_CONFIG_API_URL } from '@/constants.js';

const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { siteConfig: currentSiteConfig, getImageUrl } = useSite();
    const { language } = useLanguage();
    const t = translations[language];

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load article from localStorage or API
    useEffect(() => {
        const loadArticle = async () => {
            if (!slug) {
                setError('Article slug not found');
                setLoading(false);
                return;
            }

            try {
                // Try localStorage first
                const localConfig = localStorage.getItem('site-config');
                if (localConfig) {
                    const config = JSON.parse(localConfig);
                    const foundArticle = config.articles?.find((a: Article) => a.slug === slug);
                    if (foundArticle) {
                        setArticle(foundArticle);
                        setLoading(false);
                        return;
                    }
                }

                // Fallback to API
                const response = await fetch(SITE_CONFIG_API_URL);
                if (response.ok) {
                    const config = await response.json();
                    const foundArticle = config.articles?.find((a: Article) => a.slug === slug);
                    if (foundArticle) {
                        setArticle(foundArticle);
                    } else {
                        setError('Article not found');
                    }
                } else {
                    setError('Failed to load article');
                }
            } catch (error) {
                console.error('Error loading article:', error);
                setError('Error loading article');
            } finally {
                setLoading(false);
            }
        };

        loadArticle();
    }, [slug]);

    const currentArticle = useMemo(() => {
        return article || currentSiteConfig?.articles?.find((a: Article) => a.slug === slug);
    }, [article, currentSiteConfig, slug]);

    if (loading) {
        return (
            <PageWrapper
                title="Loading Article..."
                description="Loading article content..."
                url={`/blog/${slug}`}
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                        <p className="mt-4 text-gray-600">Se încarcă articolul...</p>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    if (error || !currentArticle) {
        return (
            <PageWrapper
                title="Article Not Found"
                description="The requested article could not be found"
                url={`/blog/${slug}`}
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Articol negăsit</h1>
                        <p className="text-gray-600 mb-6">{error || 'Articolul solicitat nu a fost găsit.'}</p>
                        <Link
                            to="/blog"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Înapoi la blog
                        </Link>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    const siteConfig = currentSiteConfig || JSON.parse(localStorage.getItem('site-config') || '{}');

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    // SEO data for the article
    const articleTitle = typeof currentArticle.title === 'string' ? currentArticle.title : currentArticle.title[language];
    const articleDescription = typeof currentArticle.excerpt === 'string' ? currentArticle.excerpt : currentArticle.excerpt?.[language] || 'Articol din blog-ul nostru despre tehnologie și web design.';

    return (
        <PageWrapper
            title={articleTitle}
            description={articleDescription}
            url={`/blog/${slug}`}
            type="article"
            publishedTime={currentArticle.createdAt}
            modifiedTime={currentArticle.updatedAt}
            tags={currentArticle.tags || []}
        >
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
                            <Link to="/blog" className="hover:text-[#c29a47] transition-colors">
                                {t.breadcrumbBlog}
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-800 font-medium truncate max-w-xs">
                                {articleTitle}
                            </span>
                        </nav>
                    </div>
                    <ArticleEditor article={currentArticle} />
                </main>
                {footerSection && (
                    <div style={footerStyles}>
                        <Footer sectionId={footerSection.id} />
                    </div>
                )}
            </>
        </PageWrapper>
    );
};

export default ArticlePage;


