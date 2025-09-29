import React from 'react';
import Editable from '@/components/Editable';

export const ServiceCardDetailed: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg text-left h-full flex flex-col">
        <Editable sectionId={sectionId} elementId={`service-${item.id}-icon`} className="mb-4" />
        <Editable sectionId={sectionId} elementId={`service-${item.id}-title`} as="h3" className="text-xl font-semibold text-gray-900 mb-2" />
        <Editable sectionId={sectionId} elementId={`service-${item.id}-text`} as="p" className="text-gray-600 flex-grow" />
    </div>
);