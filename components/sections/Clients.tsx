"use client";

import React from 'react';
import Editable from '@/components/Editable';
import { useSite } from '@/context/SiteContext';
import { clientTemplateMap } from '@/components/cards/templateMaps';
import { ClientCardDefault } from '@/components/cards/clients';

interface ClientsProps {
    sectionId: string;
}

export const Clients: React.FC<ClientsProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default' }, cardStyles } = section;
    const template = layout.template || 'default';

    const renderCarousel = () => (
        <div className="scrolling-container">
            <div className="scrolling-wrapper">
                {[...items, ...items].map((item, index) => ( // Duplicate items for a seamless loop
                    <div key={`${item.id}-${index}`} className="flex-shrink-0 w-48 mx-8 flex items-center justify-center">
                        <Editable
                            sectionId={sectionId}
                            elementId={`client-${item.id}-logo`}
                            as="img"
                            className="max-h-12 w-auto"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGrid = () => {
        const CardComponent = clientTemplateMap[template as keyof typeof clientTemplateMap] || ClientCardDefault;
        return (
            <div className="flex flex-wrap justify-center items-center gap-8">
                {items.map(item => (
                    <div key={item.id} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[12%]">
                        <CardComponent sectionId={sectionId} item={item} style={cardStyles} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center title-underline">
                    <Editable as="h2" sectionId={sectionId} elementId="clients-title" className="text-4xl font-bold text-gray-800" />
                </div>
                {template === 'carousel' ? renderCarousel() : renderGrid()}
            </div>
        </section>
    );
};