"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import { aboutTemplateMap } from '@/components/cards/templateMaps';
import { AboutLayoutImageLeft } from '@/components/layouts/about';
import { ScrollAnimation } from '@/components/animations/ScrollAnimation';

interface AboutProps {
    sectionId: string;
}

export const About: React.FC<AboutProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { layout = { template: 'image-left', imageWidth: 50 } } = section;
    const LayoutComponent = aboutTemplateMap[layout.template as keyof typeof aboutTemplateMap] || AboutLayoutImageLeft;

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <ScrollAnimation direction="up" distance={80} delay={0.2}>
                    <LayoutComponent sectionId={sectionId} imageWidth={layout.imageWidth} />
                </ScrollAnimation>
            </div>
        </section>
    );
};