"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { serviceTemplateMap } from '@/components/cards/templateMaps';
import { ServiceCardDefault } from '@/components/cards/services';
import { ScrollAnimation } from '@/components/animations/ScrollAnimation';

interface ServicesProps {
    sectionId: string;
}

export const Services: React.FC<ServicesProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 3 }, cardStyles } = section;
    const CardComponent = serviceTemplateMap[layout.template as keyof typeof serviceTemplateMap] || ServiceCardDefault;

    const itemCount = items.length;
    let widthClass = 'lg:w-1/3'; // Default for 3+ items
    if (itemCount === 1) {
        widthClass = 'lg:w-full max-w-sm';
    } else if (itemCount === 2) {
        widthClass = 'lg:w-1/2';
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <ScrollAnimation direction="up" distance={60} delay={0.1}>
                    <div className="text-center title-underline">
                        <Editable as="h2" sectionId={sectionId} elementId="services-title" className="text-4xl font-bold text-gray-800" />
                    </div>
                </ScrollAnimation>
                <div className="flex flex-wrap justify-center -m-4">
                    {items.map((item, index) => (
                        <ScrollAnimation
                            key={item.id}
                            direction="up"
                            distance={50}
                            delay={0.3 + (index * 0.15)}
                            className={`w-full sm:w-1/2 p-4 ${widthClass}`}
                        >
                            <CardComponent sectionId={sectionId} item={item} style={cardStyles} />
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
};