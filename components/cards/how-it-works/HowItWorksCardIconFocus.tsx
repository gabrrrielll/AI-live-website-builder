

import React from 'react';
import Editable from '@/components/Editable';

export const HowItWorksCardIconFocus: React.FC<{ sectionId: string, item: { id: number }, isLast?: boolean, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg relative h-full text-center">
        <span className="absolute top-4 left-4 text-sm font-bold text-gray-300">STEP {item.id}</span>
        <div className="mb-4 flex justify-center">
            <Editable sectionId={sectionId} elementId={`how-it-works-step-${item.id}-icon`} />
        </div>
        <Editable as="h3" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-title`} className="text-xl font-semibold text-gray-900 mb-2" />
        <Editable as="p" sectionId={sectionId} elementId={`how-it-works-step-${item.id}-description`} className="text-gray-600" />
    </div>
);