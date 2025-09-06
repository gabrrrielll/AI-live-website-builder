

import React from 'react';
import Editable from '@/components/Editable';

export const HowItWorksCardMinimalist: React.FC<{ sectionId: string, item: { id: number }, isLast?: boolean, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-6 rounded-lg text-left h-full">
        <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-[#c29a47]">0{item.id}.</span>
            <Editable as="h3" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-title`} className="text-xl font-semibold text-gray-900" />
        </div>
        <Editable as="p" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-description`} className="text-gray-600 mt-2 pl-12" />
    </div>
);