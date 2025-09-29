import React from 'react';
import Editable from '@/components/Editable';

interface AboutLayoutProps {
    sectionId: string;
    imageWidth?: number; // Not used in this layout, but kept for interface consistency
}

export const AboutLayoutImageTop: React.FC<AboutLayoutProps> = ({ sectionId }) => {
    return (
        <div className="flex flex-col gap-12 items-center">
            <div className="w-full md:w-3/4">
                <Editable sectionId={sectionId} elementId={`${sectionId}-image`} as="img" className="rounded-lg shadow-2xl w-full h-auto object-cover" />
            </div>
            <div className="text-center">
                <div className="title-underline">
                    <Editable sectionId={sectionId} elementId={`${sectionId}-title`} as="h2" className="text-4xl font-bold text-gray-800" />
                </div>
                <Editable sectionId={sectionId} elementId={`${sectionId}-text`} as="div" className="text-gray-600 leading-relaxed max-w-3xl mx-auto" />
            </div>
        </div>
    );
};