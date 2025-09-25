"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { howItWorksTemplateMap } from '@/components/cards/templateMaps';
import { HowItWorksCardDefault } from '@/components/cards/how-it-works';
import { ConditionalAnimation } from '@/components/animations/ConditionalAnimation';

interface HowItWorksProps {
    sectionId: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 3 }, cardStyles } = section;
    const CardComponent = howItWorksTemplateMap[layout.template as keyof typeof howItWorksTemplateMap] || HowItWorksCardDefault;

    const isConnected = layout.template === 'connected';

    // Handle the unique vertical layout for the 'connected' template
    if (isConnected) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-2xl">
                    <div className="text-center title-underline">
                        <Editable as="h2" sectionId={sectionId} elementId="how-it-works-title" className="text-4xl font-bold text-gray-800" />
                    </div>
                    <Editable as="div" sectionId={sectionId} elementId="how-it-works-subtitle" className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 text-center" />
                    <div className="grid grid-cols-1 gap-0">
                        {items.map((item, index) => (
                            <CardComponent key={item.id} sectionId={sectionId} item={item} isLast={index === items.length - 1} style={cardStyles} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Equitable & Responsive Grid Logic using Flexbox for all other templates
    const itemCount = items.length;
    let widthClass = 'lg:w-1/4'; // Default for 4 columns (for 4, 7, 8 items)
    if (itemCount === 1) {
        widthClass = 'lg:w-full max-w-md';
    } else if (itemCount === 2) {
        widthClass = 'lg:w-1/2';
    } else if (itemCount === 3 || itemCount === 5 || itemCount === 6) {
        widthClass = 'lg:w-1/3';
    }


    return (
        <section className="py-20">
            <div className="container mx-auto px-6 text-center">
                <div className="title-underline">
                    <Editable as="h2" sectionId={sectionId} elementId="how-it-works-title" className="text-4xl font-bold text-gray-800" />
                </div>
                <Editable as="div" sectionId={sectionId} elementId="how-it-works-subtitle" className="text-lg text-gray-600 max-w-3xl mx-auto mb-16" />
                <div className="flex flex-wrap justify-center -m-4">
                    {items.map((item, index) => (
                        <div key={item.id} className={`w-full sm:w-1/2 p-4 ${widthClass}`}>
                            <CardComponent sectionId={sectionId} item={item} isLast={index === items.length - 1} style={cardStyles} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};