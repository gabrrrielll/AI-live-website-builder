import React from 'react';
import Editable from '@/components/Editable';

export const PortfolioCardDetailed: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group h-full flex flex-col rounded-lg overflow-hidden bg-white" style={style}>
        <div className="h-1/2 flex-shrink-0 overflow-hidden">
             <Editable sectionId={sectionId} elementId={`portfolio-${item.id}-image`} as="img" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <Editable as="p" sectionId={sectionId} elementId={`portfolio-${item.id}-category`} className="text-xs uppercase font-semibold text-[#c29a47]" />
            <Editable as="h3" sectionId={sectionId} elementId={`portfolio-${item.id}-title`} className="text-lg font-bold text-gray-800 truncate" />
            <Editable as="p" sectionId={sectionId} elementId={`portfolio-${item.id}-description`} className="text-sm text-gray-600 my-2 flex-grow" />
            <Editable as="button" sectionId={sectionId} elementId={`portfolio-${item.id}-cta`} className="mt-auto text-sm font-semibold text-[#c29a47] hover:text-[#b58b3c] self-start" />
        </div>
    </div>
);