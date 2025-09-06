import React from 'react';
import Editable from '@/components/Editable';

export const PortfolioCardTextBelow: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group h-full flex flex-col rounded-lg overflow-hidden bg-white" style={style}>
        <div className="flex-grow overflow-hidden">
            <Editable sectionId={sectionId} elementId={`portfolio-${item.id}-image`} as="img" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="p-4 flex-shrink-0">
            <Editable as="h3" sectionId={sectionId} elementId={`portfolio-${item.id}-title`} className="text-lg font-semibold text-gray-800 truncate" />
            <Editable as="p" sectionId={sectionId} elementId={`portfolio-${item.id}-description`} className="text-sm text-gray-600 truncate" />
        </div>
    </div>
);