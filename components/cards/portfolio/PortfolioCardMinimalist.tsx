import React from 'react';
import Editable from '@/components/Editable';

export const PortfolioCardMinimalist: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group h-full flex flex-col" style={style}>
        <div className="flex-grow overflow-hidden rounded-lg border-2 border-gray-200 p-1 bg-white">
             <Editable sectionId={sectionId} elementId={`portfolio-${item.id}-image`} as="img" className="w-full h-full object-cover rounded" />
        </div>
        <div className="pt-4 text-center flex-shrink-0">
            <Editable as="h3" sectionId={sectionId} elementId={`portfolio-${item.id}-title`} className="text-lg font-semibold text-gray-800 truncate" />
        </div>
    </div>
);