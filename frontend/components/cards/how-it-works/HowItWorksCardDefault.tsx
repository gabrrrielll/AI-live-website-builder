

import React from 'react';
import Editable from '@/components/Editable';

export const HowItWorksCardDefault: React.FC<{ sectionId: string, item: { id: number }, isLast?: boolean, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg relative h-full">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#c29a47] text-white text-2xl font-bold rounded-full flex items-center justify-center shadow-lg">
            {item.id}
        </div>
        <Editable as="h3" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-title`} className="text-xl font-semibold text-gray-900 mb-2 mt-8 text-center" />
        <Editable as="p" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-description`} className="text-gray-600" />
    </div>
);