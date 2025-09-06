

import React from 'react';
import Editable from '@/components/Editable';

export const PricingCardSplit: React.FC<{ sectionId: string, item: { id: number, popular?: boolean }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className={`relative rounded-lg text-left h-full flex flex-col overflow-hidden ${item.popular ? 'ring-2 ring-[#c29a47]' : ''}`}>
        <div className="p-8">
            <Editable sectionId={sectionId} elementId={`plan-${item.id}-title`} as="h3" className="text-2xl font-bold text-gray-900 mb-4" />
            <div className="mb-8 space-y-2 text-gray-600 pricing-features flex-grow">
                <Editable sectionId={sectionId} elementId={`plan-${item.id}-features`} as="div" />
            </div>
        </div>
        <div className={`mt-auto p-8 text-white ${item.popular ? 'bg-[#c29a47]' : 'bg-[#0a284e]'}`}>
             <div className="flex items-baseline mb-6">
                <Editable sectionId={sectionId} elementId={`plan-${item.id}-price`} as="span" className="text-5xl font-extrabold" />
                <Editable sectionId={sectionId} elementId={`plan-${item.id}-period`} as="span" className="opacity-80 ml-1" />
            </div>
            <Editable as="button" sectionId={sectionId} elementId={`plan-${item.id}-cta`} className="w-full py-3 rounded-full font-semibold bg-white/90 hover:bg-white text-gray-900 transition-colors" />
        </div>
    </div>
);