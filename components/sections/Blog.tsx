"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { blogTemplateMap } from '@/components/cards/templateMaps';
import { BlogCardDefault } from '@/components/cards/blog';
import type { Article } from '@/types';
import { Link } from 'react-router-dom';

interface BlogProps {
    sectionId: string;
}

export const Blog: React.FC<BlogProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];

    // Get all articles and sort them by creation date, newest first
    const articles = [...(siteConfig?.articles || [])]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!section) return null;

    const { layout = { template: 'default', itemCount: 3 } } = section;
    const CardComponent = blogTemplateMap[layout.template as keyof typeof blogTemplateMap] || BlogCardDefault;

    // Display the latest articles based on itemCount, or fewer if not available
    const itemCount = Math.min(layout.itemCount || 3, 9); // Cap at 9 articles maximum

    // Create additional articles if needed
    let displayedArticles = [...articles];
    if (displayedArticles.length < itemCount) {
        const additionalNeeded = itemCount - displayedArticles.length;
        for (let i = 0; i < additionalNeeded; i++) {
            const newArticle: Article = {
                id: `auto-generated-${i + 1}`,
                slug: `articol-auto-generat-${i + 1}`,
                title: {
                    ro: `Articol Auto-Generat ${i + 1}`,
                    en: `Auto-Generated Article ${i + 1}`
                },
                excerpt: {
                    ro: `Acesta este un articol auto-generat pentru a completa secțiunea de blog.`,
                    en: `This is an auto-generated article to complete the blog section.`
                },
                content: {
                    ro: `<p>Conținut auto-generat pentru articolul ${i + 1}.</p>`,
                    en: `<p>Auto-generated content for article ${i + 1}.</p>`
                },
                imageUrl: `https://picsum.photos/seed/auto-blog-${i + 1}/800/450`,
                imageAlt: {
                    ro: `Imagine placeholder pentru articolul ${i + 1}`,
                    en: `Placeholder image for article ${i + 1}`
                },
                createdAt: new Date(Date.now() - (i * 86400000)).toISOString(), // Each article 1 day older
                updatedAt: new Date(Date.now() - (i * 86400000)).toISOString(),
                metaTitle: {
                    ro: `Articol Auto-Generat ${i + 1}`,
                    en: `Auto-Generated Article ${i + 1}`
                },
                metaDescription: {
                    ro: `Articol auto-generat pentru completarea secțiunii de blog.`,
                    en: `Auto-generated article to complete the blog section.`
                }
            };
            displayedArticles.push(newArticle);

            // Add to siteConfig permanently so routing works
            if (siteConfig && siteConfig.articles && !siteConfig.articles.find(a => a.id === newArticle.id)) {
                siteConfig.articles.push(newArticle);
                // Save to localStorage to persist the changes
                localStorage.setItem('site-config', JSON.stringify(siteConfig));
            }
        }
    }

    displayedArticles = displayedArticles.slice(0, itemCount);

    // Calculate width classes based on item count (max 3 per row)
    let widthClass = 'lg:w-1/3'; // Default for 3 columns
    if (itemCount === 1) {
        widthClass = 'lg:w-full max-w-2xl';
    } else if (itemCount === 2) {
        widthClass = 'lg:w-1/2';
    } else if (itemCount === 3) {
        widthClass = 'lg:w-1/3';
    } else if (itemCount === 4) {
        widthClass = 'lg:w-1/2'; // 2 per row
    } else if (itemCount === 5) {
        widthClass = 'lg:w-1/3'; // 3 on first row, 2 centered on second
    } else if (itemCount === 6) {
        widthClass = 'lg:w-1/3'; // 3 per row
    } else if (itemCount === 7) {
        widthClass = 'lg:w-1/3'; // 3 on first row, 3 on second row, 1 on third
    } else if (itemCount === 8) {
        widthClass = 'lg:w-1/3'; // 3 on first row, 3 on second row, 2 on third
    } else if (itemCount === 9) {
        widthClass = 'lg:w-1/3'; // 3 per row
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center title-underline">
                    <Link to="/blog" className="block">
                        <Editable as="h2" sectionId={sectionId} elementId="blog-title" className="text-4xl font-bold hover:text-[#c29a47] transition-colors cursor-pointer" />
                    </Link>
                </div>
                <Editable as="div" sectionId={sectionId} elementId="blog-subtitle" className="text-lg max-w-3xl mx-auto mb-16 text-center" />
                <div className="flex flex-wrap justify-center -m-4">
                    {displayedArticles.map((article, index) => (
                        <div key={article.id} className={`w-full sm:w-1/2 p-4 ${widthClass}`}>
                            <Link to={`/blog/${article.slug}`} className="block h-full">
                                <CardComponent article={article} style={section.cardStyles} />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* View all articles button */}
                <div className="text-center mt-12">
                    <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-[#c29a47] text-white rounded-lg hover:bg-[#a67c3a] transition-colors font-semibold">
                        Vezi toate articolele
                    </Link>
                </div>
            </div>
        </section>
    );
};