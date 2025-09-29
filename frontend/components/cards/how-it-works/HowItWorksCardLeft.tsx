

import React from 'react';
import Editable from '@/components/Editable';

export const HowItWorksCardLeft: React.FC<{ sectionId: string, item: { id: number }, isLast?: boolean, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-6 rounded-lg flex items-start space-x-6 text-left h-full">
        <div className="flex-shrink-0 w-12 h-12 bg-[#c29a47] text-white text-2xl font-bold rounded-full flex items-center justify-center shadow-lg mt-1">
            {item.id}
        </div>
        <div>
            <Editable as="h3" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-title`} className="text-xl font-semibold text-gray-900 mb-2" />
            <Editable as="p" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-description`} className="text-gray-600" />
        </div>
    </div>
);