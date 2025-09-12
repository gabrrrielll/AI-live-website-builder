"use client";

import React, { useState, useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { sendContactForm } from '@/utils/api';
import type { FormConfigElement, Section } from '@/types';
import Editable from '@/components/Editable';
import { Loader, Trash2, Eye, EyeOff, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContactProps {
    sectionId: string;
}

const ContactInfoItem: React.FC<{
    section: Section;
    item: { id: number; iconVisible: boolean };
}> = ({ section, item }) => {
    const { isEditMode } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].sectionControls, [language]);

    return (
        <div className="flex items-start space-x-4 relative group">
            {item.iconVisible && (
                <Editable sectionId={section.id} elementId={`contact-item-${item.id}-icon`} className="mt-1 flex-shrink-0" />
            )}
            <div className="flex-grow">
                <Editable as="h3" sectionId={section.id} elementId={`contact-item-${item.id}-title`} className="text-lg font-semibold text-gray-900" />
                <Editable as="p" sectionId={section.id} elementId={`contact-item-${item.id}-text`} className="text-gray-600" />
            </div>
            {isEditMode && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => toast.info('Funcționalitate în dezvoltare')}
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full"
                        title={item.iconVisible ? t.hideIcon : t.showIcon}
                    >
                        {item.iconVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                        onClick={() => toast.info('Funcționalitate în dezvoltare')}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-full"
                        title={t.removeItem}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};


export const Contact: React.FC<ContactProps> = ({ sectionId }) => {
    const { siteConfig, getElement, isEditMode } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].contactForm, [language]);
    const sectionControlsT = useMemo(() => translations[language].sectionControls, [language]);

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const section = siteConfig?.sections[sectionId];

    const mapElement = getElement(sectionId, 'map-embed');
    let mapSrc = '';
    if (mapElement && mapElement.type === 'map') {
        const match = mapElement.content.match(/src="([^"]+)"/);
        if (match && match[1]) {
            mapSrc = match[1];
        }
    }

    const getPlaceholder = (id: string) => (getElement(sectionId, id) as any)?.content[language] || '';
    const namePlaceholder = getPlaceholder('contact-form-name-placeholder');
    const emailPlaceholder = getPlaceholder('contact-form-email-placeholder');
    const phonePlaceholder = getPlaceholder('contact-form-phone-placeholder');
    const messagePlaceholder = getPlaceholder('contact-form-message-placeholder');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formConfig = getElement(sectionId, 'contact-form-config') as FormConfigElement | undefined;

        if (!formConfig) {
            toast.error(t.notConfigured);
            setIsSubmitting(false);
            return;
        }

        try {
            await sendContactForm(formData, {
                recipientEmail: formConfig.recipientEmail,
            });
            toast.success(t.submissionSuccess);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t.submissionError;
            toast.error(t.submissionError, { description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!section) return null;
    const { items = [] } = section;

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center title-underline">
                    <Editable as="h2" sectionId={sectionId} elementId="contact-title" className="text-4xl font-bold text-gray-800" />
                </div>
                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-8">
                        {items.map((item: any) => (
                            <ContactInfoItem key={item.id} section={section} item={item} />
                        ))}
                        {isEditMode && (
                            <div className="pt-4 flex items-center justify-center space-x-4">
                                <button onClick={() => toast.info('Funcționalitate în dezvoltare')} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                                    <PlusCircle size={18} className="mr-2" /> {sectionControlsT.addItemWithIcon}
                                </button>
                                <button onClick={() => toast.info('Funcționalitate în dezvoltare')} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                                    <PlusCircle size={18} className="mr-2" /> {sectionControlsT.addTextOnlyItem}
                                </button>
                            </div>
                        )}
                    </div>
                    <div
                        className={`bg-white p-8 rounded-lg shadow-lg relative ${isEditMode ? 'editable-outline' : ''}`}
                        {...(isEditMode && {
                            'data-editable': 'true',
                            'data-section-id': sectionId,
                            'data-element-id': 'contact-form-config',
                        })}
                    >
                        <Editable as="h3" sectionId={sectionId} elementId="contact-form-title" className="text-2xl font-bold text-gray-800 mb-6" />
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder={namePlaceholder} value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />
                            <input type="email" name="email" placeholder={emailPlaceholder} value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />
                            <input type="tel" name="phone" placeholder={phonePlaceholder} value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
                            <textarea name="message" placeholder={messagePlaceholder} rows={4} value={formData.message} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md"></textarea>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-[#c29a47] text-white py-3 rounded-md font-semibold hover:bg-[#b58b3c] disabled:bg-gray-400 flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <Loader size={20} className="animate-spin mr-2" />
                                        {t.submitting}
                                    </>
                                ) : (
                                    <Editable as="span" sectionId={sectionId} elementId="contact-form-submit-button" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border">
                    {isEditMode && (
                        <div
                            data-editable="true"
                            data-section-id={sectionId}
                            data-element-id="map-embed"
                            className="absolute inset-0 z-10 cursor-pointer"
                            title="Double-click to edit map"
                        ></div>
                    )}
                    <iframe
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        className={isEditMode ? 'pointer-events-none' : ''}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};