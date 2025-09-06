



"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { slugify } from '@/utils/slugify';
import type { Article, Language, LocalizedString } from '@/types';
import RichTextEditor from '@/components/editors/RichTextEditor';
import { Save, Trash2, ArrowLeft, Globe, Loader, Sparkles } from 'lucide-react';
import { translations } from '@/utils/translations';
import ArticleImageEditorModal from './editors/ArticleImageEditorModal';
import { generateTextWithRetry, generateText, canUseRebuild, useRebuild } from '@/services/aiService';
import { searchUnsplashPhotos } from '@/services/unsplashService';

interface ArticleEditorProps {
    article: Article;
    onBlogPageSave?: (updatedArticle: Article) => void;
    onBlogPageClose?: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article: initialArticle, onBlogPageSave, onBlogPageClose }) => {
    const { isEditMode, updateArticle, deleteArticle, getImageUrl, storeImage } = useSite();
    const { language } = useLanguage();
    const router = useRouter();
    const t = useMemo(() => translations[language].articleEditor, [language]);
    const editorsT = useMemo(() => translations[language].editors, [language]);

    const [article, setArticle] = useState<Article>(initialArticle);
    const [activeLang, setActiveLang] = useState<Language>(language);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [wordCount, setWordCount] = useState(500);

    // Check if this is the blog page article
    const isBlogPage = article.id === 'blog-page';

    useEffect(() => {
        if (initialArticle.id !== article.id || new Date(initialArticle.updatedAt) > new Date(article.updatedAt)) {
            setArticle(initialArticle);
        }
    }, [initialArticle, article.id, article.updatedAt]);

    const handleLocalizedFieldChange = (
        field: 'title' | 'excerpt' | 'imageAlt' | 'metaTitle' | 'metaDescription',
        value: string
    ) => {
        setArticle(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeLang]: value },
        }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSlug = slugify(e.target.value);
        setArticle(prev => ({ ...prev, slug: newSlug }));
    };

    const generateSlugFromTitle = () => {
        const newSlug = slugify(article.title[activeLang]);
        setArticle(prev => ({ ...prev, slug: newSlug }));
        toast.success(t.slugGenerated);
    };

    const handleSave = async () => {
        let articleToSave = { ...article };

        // For blog page, don't save to articles array, just update the virtual article
        if (isBlogPage) {
            // Update the virtual article state
            setArticle(articleToSave);
            // Call the callback to save to parent component
            if (onBlogPageSave) {
                onBlogPageSave(articleToSave);
            }
            toast.success('Pagina de blog salvată!');
            // Exit edit mode and return to blog page
            if (onBlogPageClose) {
                onBlogPageClose();
            }
            return;
        }

        if (articleToSave.imageUrl.startsWith('data:image')) {
            try {
                const imageId = await storeImage(articleToSave.imageUrl);
                articleToSave.imageUrl = imageId;
            } catch {
                toast.error("Failed to save new image.");
                return;
            }
        }

        if (articleToSave.slug !== initialArticle.slug) {
            setIsRedirecting(true);
            console.log('🔄 Starting URL rename process:', {
                oldSlug: initialArticle.slug,
                newSlug: articleToSave.slug,
                articleId: articleToSave.id
            });

            const onUpdateComplete = (newSlug: string) => {
                console.log('✅ updateArticle callback executed with slug:', newSlug);

                // Navighează direct după un mic delay pentru a permite propagarea state-ului
                setTimeout(() => {
                    console.log('🚀 Proceeding with navigation to:', newSlug);
                    toast.success(t.articleSaved);
                    toast.info(t.urlChangedRedirect);
                    setIsRedirecting(false);
                    router.push(`/blog/${newSlug}`);
                }, 200);
            };

            updateArticle(articleToSave.id, articleToSave, onUpdateComplete);

            // Fallback timeout simplificat
            setTimeout(() => {
                if (isRedirecting) {
                    console.error('❌ Fallback timeout reached, showing error');
                    setIsRedirecting(false);
                    toast.error('Eroare la actualizarea URL-ului. Te rugăm să încerci din nou.');
                }
            }, 3000); // 3 secunde timeout
        } else {
            updateArticle(articleToSave.id, articleToSave);
            toast.success(t.articleSaved);
        }
    };

    const handleDelete = () => {
        if (isBlogPage) {
            toast.error('Nu poți șterge pagina de blog!');
            return;
        }

        if (window.confirm(t.deleteArticleConfirm)) {
            deleteArticle(article.id);
            router.push('/');
        }
    };

    const handleImageSaveFromModal = (newImageUrl: string, newImageAlt: LocalizedString) => {
        setArticle(prev => ({
            ...prev,
            imageUrl: newImageUrl,
            imageAlt: newImageAlt
        }));
        setIsImageModalOpen(false); // Close the modal
    };

    const handleContentChange = (newContent: LocalizedString) => {
        setArticle(prev => ({ ...prev, content: newContent }));
    };


    const handleGenerateCompleteArticle = async () => {
        if (!aiPrompt.trim()) {
            toast.error("Te rugăm să introduci un prompt pentru generarea articolului.");
            return;
        }

        // Verifică limitările pentru test mode
        if (!canUseRebuild()) {
            toast.error("Ați atins limita de utilizare pentru această funcționalitate în versiunea de test.");
            return;
        }

        // Incrementează contorul pentru test mode
        useRebuild();

        setIsGeneratingArticle(true);
        const toastId = toast.loading(t.generatingCompleteArticle);

        try {
            // Generate content for both languages with retry logic
            const romanianPrompt = `Generate a complete blog article in Romanian based on this topic: "${aiPrompt}".

            Requirements:
            - Title: max 80 characters, engaging and SEO-friendly
            - Excerpt: max 200 characters, compelling summary
            - Content: exactly ${wordCount} words with proper HTML formatting (use <h1>, <h2>, <p>, <ul>, <li> tags)
            - Meta title: max 60 characters for SEO
            - Meta description: max 160 characters for SEO
            - Image keywords: 2-3 keywords for image search
            
            CRITICAL: Return ONLY valid JSON in this exact format:
            {
                "title": "Titlul articolului",
                "excerpt": "Rezumatul articolului",
                "content": "<h1>Titlu</h1><p>Conținutul articolului...</p>",
                "metaTitle": "Meta titlu pentru SEO",
                "metaDescription": "Meta descriere pentru SEO",
                "imageKeywords": "cuvinte cheie pentru imagine"
            }`;

            const englishPrompt = `Generate a complete blog article in English based on this topic: "${aiPrompt}".

            Requirements:
            - Title: max 80 characters, engaging and SEO-friendly
            - Excerpt: max 200 characters, compelling summary
            - Content: exactly ${wordCount} words with proper HTML formatting (use <h1>, <h2>, <p>, <ul>, <li> tags)
            - Meta title: max 60 characters for SEO
            - Meta description: max 160 characters for SEO
            - Image keywords: 2-3 keywords for image search
            
            CRITICAL: Return ONLY valid JSON in this exact format:
            {
                "title": "Article Title",
                "excerpt": "Article excerpt",
                "content": "<h1>Title</h1><p>Article content...</p>",
                "metaTitle": "Meta title for SEO",
                "metaDescription": "Meta description for SEO",
                "imageKeywords": "keywords for image"
            }`;

            // Generate content for both languages with retry logic
            const [romanianResult, englishResult] = await Promise.all([
                generateTextWithRetry(romanianPrompt, 'json', 3, toastId),
                generateTextWithRetry(englishPrompt, 'json', 3, toastId)
            ]);

            // Parse the results with better error handling
            let roData, enData;
            try {
                roData = JSON.parse(romanianResult);
                enData = JSON.parse(englishResult);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Romanian result:', romanianResult);
                console.error('English result:', englishResult);
                throw new Error(`Eroare la parsarea răspunsului AI: ${parseError.message}`);
            }

            // Search for a relevant image on Unsplash
            const imageKeywords = (roData.imageKeywords || enData.imageKeywords || aiPrompt).toString();
            let selectedImage = '';

            try {
                const unsplashResults = await searchUnsplashPhotos(imageKeywords);
                if (unsplashResults.length > 0) {
                    selectedImage = unsplashResults[0].urls.full;
                } else {
                    // Fallback to a default image if no results found
                    selectedImage = `https://picsum.photos/seed/${encodeURIComponent(imageKeywords)}/800/450`;
                }
            } catch (unsplashError) {
                console.warn("Unsplash search failed, using fallback image:", unsplashError);
                // Fallback to a default image if Unsplash fails
                selectedImage = `https://picsum.photos/seed/${encodeURIComponent(imageKeywords)}/800/450`;
            }

            // Update the article with all generated content
            const updatedArticle = {
                ...article,
                title: { ro: roData.title, en: enData.title },
                excerpt: { ro: roData.excerpt, en: enData.excerpt },
                content: { ro: roData.content, en: enData.content },
                metaTitle: { ro: roData.metaTitle, en: enData.metaTitle },
                metaDescription: { ro: roData.metaDescription, en: enData.metaDescription },
                imageUrl: selectedImage,
                imageAlt: { ro: roData.imageKeywords?.toString() || '', en: enData.imageKeywords?.toString() || '' },
                slug: slugify(roData.title)
            };

            setArticle(updatedArticle);
            toast.success(t.completeArticleGenerated, { id: toastId });
            setAiPrompt(''); // Clear the prompt

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

            // Check if it's a Gemini API overload error
            if (errorMessage.includes('overloaded') || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
                toast.error(t.geminiOverloadedError, {
                    id: toastId,
                    description: t.geminiOverloadedDescription
                });
            }
            // Check if it's an Unsplash API error and provide a helpful message
            else if (errorMessage.includes('Unsplash') || errorMessage.includes('Failed to fetch')) {
                toast.error(t.unsplashError, {
                    id: toastId,
                    description: t.unsplashErrorDescription
                });
            } else {
                toast.error(t.completeArticleError, { id: toastId, description: errorMessage });
            }
        } finally {
            setIsGeneratingArticle(false);
        }
    };

    const handleAiPromptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGenerateCompleteArticle();
        }
    };

    const resolvedImageUrl = useMemo(() => {
        if (!article.imageUrl) return '';
        if (article.imageUrl.startsWith('local-img-')) {
            return getImageUrl(article.imageUrl) || '';
        }
        return article.imageUrl;
    }, [article.imageUrl, getImageUrl]);

    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <Loader size={48} className="animate-spin text-[#c29a47] mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800">{t.redirectingTitle}</h2>
                <p className="text-gray-600">{t.redirectingMessage}</p>
            </div>
        );
    }

    if (!isEditMode) {
        return (
            <article className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{article.title[language]}</h1>
                <p className="text-lg text-gray-600 mb-8">{article.excerpt[language]}</p>
                {resolvedImageUrl && (
                    <img src={resolvedImageUrl} alt={article.imageAlt[language]} className="w-full h-auto rounded-lg shadow-lg mb-8" />
                )}
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content[language] }} />
            </article>
        );
    }

    return (
        <div id="article-editor" className="bg-gray-50 min-h-screen">
            {/* Sticky Header with Action Buttons */}
            <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex justify-between items-center py-4">
                        <button onClick={() => router.push('/')} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={18} className="mr-2" /> {t.backToHome}
                        </button>
                        <div className="flex items-center space-x-2">
                            {!isBlogPage && (
                                <button onClick={handleDelete} className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-md" title={t.deleteArticle}>
                                    <Trash2 size={20} />
                                </button>
                            )}
                            <button onClick={handleSave} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
                                <Save size={18} className="mr-2" /> {isBlogPage ? 'Salvează' : t.saveArticle}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        {/* AI Generation Section - Only for regular articles */}
                        {!isBlogPage && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Sparkles className="mr-2 text-purple-500" size={24} />
                                    {t.generateCompleteArticle}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {t.generateCompleteArticleDescription}
                                </p>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        onKeyDown={handleAiPromptKeyDown}
                                        placeholder={t.generateCompleteArticlePlaceholder}
                                        className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                        disabled={isGeneratingArticle}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                            {t.wordCount}:
                                        </label>
                                        <input
                                            type="number"
                                            value={wordCount}
                                            onChange={(e) => setWordCount(parseInt(e.target.value) || 500)}
                                            min="100"
                                            max="2000"
                                            className="w-20 p-2 border border-gray-300 rounded-md text-center"
                                            disabled={isGeneratingArticle}
                                        />
                                    </div>
                                    <button
                                        onClick={handleGenerateCompleteArticle}
                                        disabled={isGeneratingArticle || !aiPrompt.trim()}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center font-semibold"
                                    >
                                        {isGeneratingArticle ? (
                                            <>
                                                <Loader size={20} className="animate-spin mr-2" />
                                                {t.generating}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} className="mr-2" />
                                                {t.generateCompleteArticleButton}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex border-b mb-6">
                            <button onClick={() => setActiveLang('ro')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'ro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{editorsT.romanian}</button>
                            <button onClick={() => setActiveLang('en')} className={`px-4 py-2 text-sm font-medium ${activeLang === 'en' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>{editorsT.english}</button>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.title}</label>
                                <input
                                    type="text"
                                    value={article.title[activeLang]}
                                    onChange={(e) => handleLocalizedFieldChange('title', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md text-2xl font-bold"
                                />
                            </div>

                            {/* URL Slug - Only for regular articles */}
                            {!isBlogPage && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.urlSlug}</label>
                                    <div className="flex items-center">
                                        <span className="text-gray-500 text-sm mr-1">/blog/</span>
                                        <input
                                            type="text"
                                            value={article.slug}
                                            onChange={handleSlugChange}
                                            className="flex-grow p-2 border border-gray-300 rounded-md"
                                        />
                                        <button onClick={generateSlugFromTitle} className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-md" title={t.generateSlug}>
                                            <Globe size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.excerpt}</label>
                                <textarea
                                    value={article.excerpt[activeLang]}
                                    onChange={(e) => handleLocalizedFieldChange('excerpt', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows={3}
                                />
                            </div>

                            {/* Featured Image - Only for regular articles */}
                            {!isBlogPage && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.featuredImage}</label>
                                    <div className="p-4 border rounded-lg space-y-4 bg-white">
                                        <div className="flex items-start space-x-4">
                                            {resolvedImageUrl ? (
                                                <img
                                                    src={resolvedImageUrl}
                                                    alt="Current preview"
                                                    className="w-40 h-auto object-contain rounded-md border flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-40 h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">No Image</div>
                                            )}
                                            <div className="flex-grow">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">{editorsT.imageUrl}</label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={article.imageUrl}
                                                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsImageModalOpen(true)}
                                            className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-semibold"
                                        >
                                            {t.changeImageButton}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.mainContent}</label>
                                <RichTextEditor
                                    element={{ type: 'rich-text', content: article.content }}
                                    onSave={() => { }} // onSave is handled by the main button
                                    onChange={handleContentChange}
                                    hideSaveButton={true}
                                />
                            </div>

                            <div className="border-t pt-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">{t.seoSettings}</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.metaTitle}</label>
                                    <input
                                        type="text"
                                        value={article.metaTitle[activeLang]}
                                        onChange={(e) => handleLocalizedFieldChange('metaTitle', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.metaDescription}</label>
                                    <textarea
                                        value={article.metaDescription[activeLang]}
                                        onChange={(e) => handleLocalizedFieldChange('metaDescription', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ArticleImageEditorModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSave={handleImageSaveFromModal}
                article={article}
            />
        </div>
    );
};

export default ArticleEditor;