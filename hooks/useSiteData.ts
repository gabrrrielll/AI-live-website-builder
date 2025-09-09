

"use client";

import { useCallback } from 'react';
import { toast } from 'sonner';
import type { SiteConfig, SiteElement, RichTextElement, Section, Article } from '@/types';
import type { Translations } from '@/utils/translations';
import { createDefaultCardElements } from '@/utils/elementFactory';
import { modifyLayout, duplicateSectionInConfig } from '@/utils/configModifiers';
import { slugify } from '@/utils/slugify';

interface useSiteDataProps {
    setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    updateHistory: (newConfig: SiteConfig) => void;
    t: Translations;
}

export const useSiteData = ({ setSiteConfig, updateHistory, t }: useSiteDataProps) => {

    const updateElement = useCallback((sectionId: string, elementId: string, newElement: SiteElement) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;

            const newConfig = JSON.parse(JSON.stringify(prevConfig));

            if (newConfig.sections[sectionId]?.elements[elementId]) {
                newConfig.sections[sectionId].elements[elementId] = newElement;
                updateHistory(newConfig);
                return newConfig;
            }

            if (newConfig.pages?.[sectionId]?.elements[elementId]) {
                newConfig.pages[sectionId].elements[elementId] = newElement;
                updateHistory(newConfig);
                return newConfig;
            }

            return prevConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const updateSectionStyles = useCallback((sectionId: string, newStyles: React.CSSProperties) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.sections[sectionId]) return prevConfig;
            const newSections = {
                ...prevConfig.sections,
                [sectionId]: {
                    ...prevConfig.sections[sectionId],
                    styles: newStyles,
                }
            };
            const newConfig = { ...prevConfig, sections: newSections };
            updateHistory(newConfig);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const updateSlideItemStyles = useCallback((sectionId: string, itemId: number, newStyles: React.CSSProperties) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;
            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const section = newConfig.sections[sectionId];
            if (!section || !section.items) return prevConfig;

            const itemIndex = section.items.findIndex((item: any) => item.id === itemId);
            if (itemIndex === -1) return prevConfig;

            section.items[itemIndex].styles = newStyles;

            updateHistory(newConfig);
            toast.success(t.editors.slideBackgroundUpdated);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory, t.editors.slideBackgroundUpdated]);

    const toggleSectionVisibility = useCallback((sectionId: string) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.sections[sectionId]) return prevConfig;
            const newSections = { ...prevConfig.sections, [sectionId]: { ...prevConfig.sections[sectionId], visible: !prevConfig.sections[sectionId].visible } };
            const newConfig = { ...prevConfig, sections: newSections };
            updateHistory(newConfig);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const toggleNavLinkVisibility = useCallback((sectionId: string) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.sections[sectionId]) return prevConfig;

            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const section = newConfig.sections[sectionId];

            const currentVisibility = section.navLinkVisible !== false;
            section.navLinkVisible = !currentVisibility;

            updateHistory(newConfig);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const deleteSection = useCallback((sectionId: string) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.sections[sectionId]) {
                return prevConfig;
            }

            const newConfig = JSON.parse(JSON.stringify(prevConfig));

            delete newConfig.sections[sectionId];
            newConfig.sectionOrder = newConfig.sectionOrder.filter((id: string) => id !== sectionId);

            updateHistory(newConfig);
            toast.success(t.sectionControls.sectionDeleted);

            return newConfig;
        });
    }, [setSiteConfig, updateHistory, t]);

    const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;
            const { sectionOrder } = prevConfig;
            const index = sectionOrder.indexOf(sectionId);
            if (index === -1) return prevConfig;

            const newSectionOrder = [...sectionOrder];
            if (direction === 'up') {
                if (index <= 1) return prevConfig;
                [newSectionOrder[index - 1], newSectionOrder[index]] = [newSectionOrder[index], newSectionOrder[index - 1]];
            } else {
                if (index >= sectionOrder.length - 2) return prevConfig;
                [newSectionOrder[index], newSectionOrder[index + 1]] = [newSectionOrder[index + 1], newSectionOrder[index]];
            }

            const newConfig = { ...prevConfig, sectionOrder: newSectionOrder };
            updateHistory(newConfig);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const duplicateSection = useCallback((sectionId: string) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;
            const newConfig = duplicateSectionInConfig(prevConfig, sectionId);
            updateHistory(newConfig);
            toast.success(t.sectionControls.sectionDuplicated);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory, t.sectionControls.sectionDuplicated]);

    const addFaqItem = useCallback((sectionId: string) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.sections[sectionId]) return prevConfig;
            const faqSection = prevConfig.sections[sectionId];
            const items = faqSection.items || [];
            const newId = items.length > 0 ? Math.max(...items.map((item: any) => item.id)) + 1 : 1;

            const newQuestionElement: RichTextElement = { type: 'rich-text', content: { ro: 'Întrebare Nouă?', en: 'New Question?' } };
            const newAnswerElement: RichTextElement = { type: 'rich-text', content: { ro: '<p>Răspuns nou...</p>', en: '<p>New answer...</p>' } };

            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            if (!newConfig.sections[sectionId].items) newConfig.sections[sectionId].items = [];
            newConfig.sections[sectionId].items.push({ id: newId });
            newConfig.sections[sectionId].elements[`faq-${newId}-question`] = newQuestionElement;
            newConfig.sections[sectionId].elements[`faq-${newId}-answer`] = newAnswerElement;

            updateHistory(newConfig);
            toast.success("New FAQ item added.");
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const removeFaqItem = useCallback((sectionId: string, itemId: number) => {
        if (!window.confirm("Are you sure you want to remove this FAQ item?")) return;
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.sections[sectionId]) return prevConfig;

            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const faqSection = newConfig.sections[sectionId];

            faqSection.items = (faqSection.items || []).filter((item: any) => item.id !== itemId);
            delete faqSection.elements[`faq-${itemId}-question`];
            delete faqSection.elements[`faq-${itemId}-answer`];

            updateHistory(newConfig);
            toast.success("FAQ item removed.");
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const updateSectionLayout = useCallback((sectionId: string, layoutChanges: Partial<Section['layout']>, cardStyles: Section['cardStyles']) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;

            const newConfig = modifyLayout(prevConfig, sectionId, layoutChanges, cardStyles);

            updateHistory(newConfig);
            toast.success(t.sectionControls.layoutUpdated);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory, t]);

    const addContactItem = useCallback((sectionId: string, withIcon: boolean) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;
            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const section = newConfig.sections[sectionId];
            if (!section) return newConfig;

            if (!section.items) section.items = [];
            const newId = section.items.length > 0 ? Math.max(...section.items.map((item: any) => item.id)) + 1 : 1;

            section.items.push({ id: newId, iconVisible: withIcon });

            section.elements[`contact-item-${newId}-title`] = { type: 'rich-text', content: { ro: 'Titlu Nou', en: 'New Title' } };
            section.elements[`contact-item-${newId}-text`] = { type: 'rich-text', content: { ro: 'Text nou...', en: 'New text...' } };
            if (withIcon) {
                section.elements[`contact-item-${newId}-icon`] = { type: 'icon', iconName: 'Info', size: 24, color: '#c29a47' };
            }

            updateHistory(newConfig);
            toast.success("Contact item added.");
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const removeContactItem = useCallback((sectionId: string, itemId: number) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;
            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const section = newConfig.sections[sectionId];
            if (!section || !section.items) return newConfig;

            section.items = section.items.filter((item: any) => item.id !== itemId);
            delete section.elements[`contact-item-${itemId}-icon`];
            delete section.elements[`contact-item-${itemId}-title`];
            delete section.elements[`contact-item-${itemId}-text`];

            updateHistory(newConfig);
            toast.success("Contact item removed.");
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const toggleContactItemIcon = useCallback((sectionId: string, itemId: number) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;
            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const section = newConfig.sections[sectionId];
            if (!section || !section.items) return newConfig;

            const item = section.items.find((i: any) => i.id === itemId);
            if (item) {
                item.iconVisible = !item.iconVisible;
            }

            updateHistory(newConfig);
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    // Blog Article Management
    const addArticle = useCallback((): Article | null => {
        let newArticle: Article | null = null;
        setSiteConfig(prevConfig => {
            if (!prevConfig) return null;

            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            if (!newConfig.articles) newConfig.articles = [];

            const now = new Date().toISOString();
            const placeholderTitle = `Articol Nou ${newConfig.articles.length + 1}`;
            newArticle = {
                id: `article-${Date.now()}`,
                slug: slugify(placeholderTitle),
                title: { ro: placeholderTitle, en: `New Article ${newConfig.articles.length + 1}` },
                excerpt: { ro: 'Un scurt extras pentru noul articol...', en: 'A short excerpt for the new article...' },
                content: { ro: '<h1>Titlul Articolului</h1><p>Începe să scrii aici...</p>', en: '<h1>Article Title</h1><p>Start writing here...</p>' },
                imageUrl: 'https://picsum.photos/seed/new-article/800/450',
                imageAlt: { ro: 'Imagine reprezentativă', en: 'Placeholder image' },
                metaTitle: { ro: placeholderTitle, en: `New Article ${newConfig.articles.length + 1}` },
                metaDescription: { ro: 'Descriere meta pentru SEO', en: 'Meta description for SEO' },
                createdAt: now,
                updatedAt: now,
            };

            newConfig.articles.push(newArticle);
            updateHistory(newConfig);
            toast.success("Articol nou creat!");
            return newConfig;
        });
        return newArticle;
    }, [setSiteConfig, updateHistory]);

    const updateArticle = useCallback((articleId: string, updatedArticle: Article, onComplete?: (newSlug: string) => void) => {
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.articles) {
                console.error('❌ No config or articles found');
                return prevConfig;
            }

            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            const articleIndex = newConfig.articles.findIndex((a: Article) => a.id === articleId);

            if (articleIndex !== -1) {
                const finalArticle = { ...updatedArticle, updatedAt: new Date().toISOString() };
                newConfig.articles[articleIndex] = finalArticle;

                updateHistory(newConfig);

                // Apelează callback-ul într-un setTimeout pentru a permite propagarea state-ului
                if (onComplete) {
                    setTimeout(() => {
                        onComplete(finalArticle.slug);
                    }, 50);
                }
            } else {
                console.error('❌ Article not found with id:', articleId);
            }
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);

    const deleteArticle = useCallback((articleId: string) => {
        if (!window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
        setSiteConfig(prevConfig => {
            if (!prevConfig || !prevConfig.articles) return prevConfig;

            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            newConfig.articles = newConfig.articles.filter((a: Article) => a.id !== articleId);

            updateHistory(newConfig);
            toast.success("Articol șters.");
            return newConfig;
        });
    }, [setSiteConfig, updateHistory]);


    return {
        updateElement,
        updateSectionStyles,
        updateSlideItemStyles,
        toggleSectionVisibility,
        toggleNavLinkVisibility,
        deleteSection,
        moveSection,
        duplicateSection,
        addFaqItem,
        removeFaqItem,
        updateSectionLayout,
        addContactItem,
        removeContactItem,
        toggleContactItemIcon,
        addArticle,
        updateArticle,
        deleteArticle,
    };
};