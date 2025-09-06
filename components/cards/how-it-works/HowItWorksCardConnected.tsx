

import React from 'react';
import Editable from '@/components/Editable';

export const HowItWorksCardConnected: React.FC<{ sectionId: string, item: { id: number }, isLast?: boolean, style?: React.CSSProperties }> = ({ sectionId, item, isLast, style }) => (
    <div className="relative flex items-start">
        <div className="flex-shrink-0 flex flex-col items-center mr-6">
            <div className="w-12 h-12 bg-[#c29a47] text-white text-2xl font-bold rounded-full flex items-center justify-center shadow-lg z-10">
                {item.id}
            </div>
            {!isLast && <div className="w-0.5 h-full min-h-24 bg-gray-300 mt-2"></div>}
        </div>
        <div style={style} className="p-6 rounded-lg w-full mt-2">
            <Editable as="h3" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-title`} className="text-xl font-semibold text-gray-900 mb-2" />
            <Editable as="p" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-description`} className="text-gray-600" />
        </div>
    </div>
);