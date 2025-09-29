import React from 'react';
import Editable from '@/components/Editable';

interface AboutLayoutProps {
    sectionId: string;
    imageWidth?: number;
}

export const AboutLayoutImageLeft: React.FC<AboutLayoutProps> = ({ sectionId, imageWidth = 50 }) => {
    const textWidth = 100 - imageWidth;
    
    return (
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div style={{ flexBasis: `${imageWidth}%` }}>
                <Editable sectionId={sectionId} elementId={`${sectionId}-image`} as="img" className="rounded-lg shadow-2xl w-full h-auto object-cover" />
            </div>
            <div style={{ flexBasis: `${textWidth}%` }}>
                <div className="title-underline-left">
                    <Editable sectionId={sectionId} elementId={`${sectionId}-title`} as="h2" className="text-4xl font-bold text-gray-800" />
                </div>
                <Editable sectionId={sectionId} elementId={`${sectionId}-text`} as="div" className="text-gray-600 leading-relaxed" />
            </div>
        </div>
    );
};