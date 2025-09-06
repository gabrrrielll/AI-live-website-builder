import React from 'react';
import Editable from '@/components/Editable';

interface AboutLayoutProps {
    sectionId: string;
    imageWidth?: number; // Not used in this layout
}

export const AboutLayoutOverlay: React.FC<AboutLayoutProps> = ({ sectionId }) => {
    return (
        <div className="relative rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center text-white text-center p-8">
            <Editable sectionId={sectionId} elementId={`${sectionId}-image`} as="img" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 max-w-3xl">
                <div className="title-underline">
                    <Editable sectionId={sectionId} elementId={`${sectionId}-title`} as="h2" className="text-4xl font-bold" />
                </div>
                <Editable sectionId={sectionId} elementId={`${sectionId}-text`} as="div" className="leading-relaxed" />
            </div>
        </div>
    );
};