"use client";

import React, { useState, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Editable from '@/components/Editable';
import { toast } from 'sonner';
import { ConditionalAnimation } from '@/components/animations/ConditionalAnimation';

interface FAQItemProps {
    sectionId: string;
    itemId: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ sectionId, itemId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isEditMode } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].sectionControls, [language]);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.info('Funcționalitate în dezvoltare');
    };

    return (
        <div className="border-b relative group/item">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <Editable as="span" sectionId={sectionId} elementId={`faq-${itemId}-question`} className="text-lg font-medium text-gray-800 pr-24" />
                <Editable as="span" sectionId={sectionId} elementId="faq-chevron-icon" className={`transition-transform transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isEditMode && (
                <button
                    onClick={handleRemove}
                    className="absolute top-1/2 -translate-y-1/2 right-10 bg-red-100 text-red-600 px-2 py-1 text-xs rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity"
                    title={t.removeItem}
                >
                    - {t.removeItem}
                </button>
            )}
            {isOpen && (
                <div className="pb-4 pr-8">
                    <Editable as="div" sectionId={sectionId} elementId={`faq-${itemId}-answer`} className="text-gray-600" />
                </div>
            )}
        </div>
    );
};

interface FAQProps {
    sectionId: string;
}

export const FAQ: React.FC<FAQProps> = ({ sectionId }) => {
    const { siteConfig, isEditMode } = useSite();
    const faqSection = siteConfig?.sections[sectionId];
    const faqItems = faqSection?.items || [];

    return (
        <section className="py-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center title-underline">
                    <Editable as="h2" sectionId={sectionId} elementId="faq-title" className="text-4xl font-bold text-gray-800" />
                </div>
                <div className="space-y-4">
                    {faqItems.map((item: any) => <FAQItem key={item.id} sectionId={sectionId} itemId={item.id} />)}
                </div>
                {isEditMode && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => toast.info('Funcționalitate în dezvoltare')}
                            className="bg-[#c29a47] hover:bg-[#b58b3c] text-white font-semibold py-2 px-6 rounded-md transition-colors"
                        >
                            Adaugă +
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};