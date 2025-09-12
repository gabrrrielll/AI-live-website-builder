"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { blogTemplateMap } from '@/components/cards/templateMaps';
import { BlogCardDefault } from '@/components/cards/blog';
import type { Article } from '@/types';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlusCircle, LayoutGrid, Palette, Edit3 } from 'lucide-react';
import Editable from '@/components/Editable';
import ArticleEditor from '@/components/ArticleEditor';

export const BlogListing: React.FC = () => {
    const { siteConfig, isEditMode, startEditingSectionLayout, startEditingSectionStyles, addArticle } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].blogPage, [language]);
    const [isEditingPage, setIsEditingPage] = useState(false);

    // Create a virtual "blog page" article for editing
    const [blogPageArticle, setBlogPageArticle] = useState<Article>({
        id: 'blog-page',
        slug: 'blog',
        title: { ro: 'Blog', en: 'Blog' },
        excerpt: { ro: 'Descoperă toate articolele noastre', en: 'Discover all our articles' },
        content: { ro: '<p>Pagina principală a blogului</p>', en: '<p>Main blog page</p>' },
        imageUrl: '',
        imageAlt: { ro: 'Blog', en: 'Blog' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metaTitle: { ro: 'Blog - Articole și Noutăți', en: 'Blog - Articles and News' },
        metaDescription: { ro: 'Descoperă toate articolele noastre despre tehnologie, design și dezvoltare web.', en: 'Discover all our articles about technology, design and web development.' }
    });

    // Load saved blog page data from localStorage
    useEffect(() => {
        const savedBlogPage = localStorage.getItem('blog-page-data');
        if (savedBlogPage) {
            try {
                const parsed = JSON.parse(savedBlogPage);
                setBlogPageArticle(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading blog page data:', error);
            }
        }
    }, []);

    // Function to update blog page article
    const updateBlogPageArticle = (updatedArticle: Article) => {
        setBlogPageArticle(updatedArticle);
        // Save to localStorage
        localStorage.setItem('blog-page-data', JSON.stringify(updatedArticle));
    };

    // Get all articles and sort them by creation date, newest first
    const allArticles = [...(siteConfig?.articles || [])]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 9; // Same as max items in home blog section

    // Calculate pagination
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = allArticles.slice(startIndex, endIndex);

    // Get blog section configuration for styling
    const blogSection = siteConfig?.sections['blog'];
    const { layout = { template: 'default' }, cardStyles } = blogSection || {};
    const CardComponent = blogTemplateMap[layout.template as keyof typeof blogTemplateMap] || BlogCardDefault;

    // Calculate width classes based on item count (max 3 per row)
    const itemCount = currentArticles.length;
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

    // Reset to first page when articles change
    useEffect(() => {
        setCurrentPage(1);
    }, [allArticles.length]);

    const handleAddArticle = () => {
        const newArticle = addArticle();
        if (newArticle) {
            window.location.href = `/blog/${newArticle.slug}`;
        }
    };

    // If editing page, show ArticleEditor
    if (isEditingPage) {
        return <ArticleEditor
            article={blogPageArticle}
            onBlogPageSave={updateBlogPageArticle}
            onBlogPageClose={() => setIsEditingPage(false)}
        />;
    }

    return (
        <section className="py-20 group relative">
            {/* Custom controls for blog page */}
            {isEditMode && (
                <div className="absolute z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md top-2 right-2">
                    <button
                        onClick={() => setIsEditingPage(true)}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
                        title="Editează pagina de blog"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={handleAddArticle}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
                        title="Adaugă articol nou"
                    >
                        <PlusCircle size={18} />
                    </button>
                    <button
                        onClick={() => startEditingSectionLayout('blog')}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
                        title="Editează aranjamentul"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => startEditingSectionStyles('blog')}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
                        title="Editează stilul"
                    >
                        <Palette size={18} />
                    </button>
                </div>
            )}

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center title-underline mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {blogPageArticle.title[language]}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {blogPageArticle.excerpt[language]}
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="flex flex-wrap justify-center -m-4 mb-12">
                    {currentArticles.map((article, index) => (
                        <div key={article.id} className={`w-full sm:w-1/2 p-4 ${widthClass}`}>
                            <Link href={`/blog/${article.slug}`} passHref legacyBehavior>
                                <a className="block h-full">
                                    <CardComponent article={article} style={cardStyles} />
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            {t?.previousPage || 'Anterior'}
                        </button>

                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-md ${currentPage === page
                                        ? 'bg-[#c29a47] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t?.nextPage || 'Următor'}
                            <ChevronRight size={20} className="ml-2" />
                        </button>
                    </div>
                )}

                {/* Article count info */}
                <div className="text-center mt-8 text-gray-600">
                    {t?.showingArticles?.replace('{start}', (startIndex + 1).toString()).replace('{end}', endIndex.toString()).replace('{total}', allArticles.length.toString()) ||
                        `Articole ${startIndex + 1}-${endIndex} din ${allArticles.length}`}
                </div>
            </div>
        </section>
    );
};
