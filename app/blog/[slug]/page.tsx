import ArticlePageClient from './ArticlePageClient';
import type { Metadata } from 'next';
import type { Article, SiteConfig } from '@/types';
import { APP_CONFIG, SITE_CONFIG_API_URL } from '@/constants.js';

// Funcție simplificată pentru generarea parametrilor statici (opțională fără output: export)
export async function generateStaticParams() {
    // Fără output: 'export', această funcție este opțională
    // Next.js va folosi SSR pentru slug-uri necunoscute
    return [];
}

// Funcție pentru generarea meta tags SEO pentru articolele dinamice
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;

    try {
        // Încarcă configurația din API pentru a găsi articolul
        const response = await fetch(SITE_CONFIG_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Cache pentru 5 minute pentru performanță
            next: { revalidate: 300 }
        });

        if (response.ok) {
            const config: SiteConfig = await response.json();
            const article = config.articles.find((a: Article) => a.slug === slug);

            if (article) {
                return {
                    title: article.metaTitle.ro || article.title.ro,
                    description: article.metaDescription.ro || article.excerpt.ro,
                    keywords: [
                        article.title.ro,
                        article.excerpt.ro,
                        'blog',
                        'articol',
                        'tehnologie',
                        'web design',
                        'AI'
                    ].join(', '),
                    authors: [{ name: 'AI Live Website Editor' }],
                    openGraph: {
                        title: article.metaTitle.ro || article.title.ro,
                        description: article.metaDescription.ro || article.excerpt.ro,
                        images: [
                            {
                                url: article.imageUrl,
                                width: 800,
                                height: 450,
                                alt: article.imageAlt.ro || article.title.ro,
                            }
                        ],
                        type: 'article',
                        publishedTime: article.createdAt,
                        modifiedTime: article.updatedAt,
                        authors: ['AI Live Website Editor'],
                        section: 'Blog',
                        tags: [article.title.ro, 'tehnologie', 'web design', 'AI'],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: article.metaTitle.ro || article.title.ro,
                        description: article.metaDescription.ro || article.excerpt.ro,
                        images: [article.imageUrl],
                        creator: '@ailiveeditor',
                    },
                    alternates: {
                        canonical: `${APP_CONFIG.BASE_SITE_URL}/blog/${slug}`,
                        languages: {
                            'ro': `/blog/${slug}`,
                            'en': `/blog/${slug}`,
                        },
                    },
                    robots: {
                        index: true,
                        follow: true,
                        googleBot: {
                            index: true,
                            follow: true,
                            'max-video-preview': -1,
                            'max-image-preview': 'large',
                            'max-snippet': -1,
                        },
                    },
                    other: {
                        'article:author': 'AI Live Website Editor',
                        'article:section': 'Blog',
                        'article:tag': article.title.ro,
                    },
                };
            }
        }
    } catch (error) {
        console.error('Error loading article metadata:', error);
    }

    // Fallback pentru articolele care nu se găsesc
    return {
        title: 'Articol Negăsit | AI Live Website Editor',
        description: 'Articolul pe care îl cauți nu există sau a fost mutat.',
        robots: {
            index: false,
            follow: false,
        },
    };
}

// Server-side component pentru încărcarea inițială
export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Fără output: 'export', toate slug-urile sunt gestionate dinamic
    // Folosim client-side loading pentru toate articolele
    return <ArticlePageClient article={null} siteConfig={null} slug={slug} />;
}