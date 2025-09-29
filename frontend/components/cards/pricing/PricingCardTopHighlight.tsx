

import React from 'react';
import Editable from '@/components/Editable';

export const PricingCardTopHighlight: React.FC<{ sectionId: string, item: { id: number, popular?: boolean }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className={`relative p-8 rounded-lg text-center border-t-8 ${item.popular ? 'border-[#c29a47]' : 'border-gray-200'}`}>
        <Editable sectionId={sectionId} elementId={`plan-${item.id}-title`} as="h3" className="text-2xl font-bold text-gray-900 mb-4" />
        <div className="flex justify-center items-baseline mb-6">
            <Editable sectionId={sectionId} elementId={`plan-${item.id}-price`} as="span" className="text-5xl font-extrabold text-[#0a284e]" />
            <Editable sectionId={sectionId} elementId={`plan-${item.id}-period`} as="span" className="text-gray-500 ml-1" />
        </div>
        <div className="text-left mb-8 space-y-2 text-gray-600 pricing-features">
            <Editable sectionId={sectionId} elementId={`plan-${item.id}-features`} as="div" />
        </div>
        <Editable as="button" sectionId={sectionId} elementId={`plan-${item.id}-cta`} className={`w-full py-3 rounded-full font-semibold transition-colors ${item.popular ? 'bg-[#c29a47] text-white hover:bg-[#b58b3c]' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`} />
    </div>
);