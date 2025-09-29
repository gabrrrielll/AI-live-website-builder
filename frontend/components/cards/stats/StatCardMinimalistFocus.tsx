

import React from 'react';
import Editable from '@/components/Editable';
import { StatNumber } from './StatNumber';

export const StatCardMinimalistFocus: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="p-6 rounded-lg" style={style}>
        <StatNumber sectionId={sectionId} elementId={`stat-${item.id}-number`} />
        <div className="flex items-center justify-center space-x-2 mt-2">
             <Editable sectionId={sectionId} elementId={`stat-${item.id}-icon`} />
             <Editable as="p" sectionId={sectionId} elementId={`stat-${item.id}-label`} className="text-gray-600 font-semibold tracking-widest uppercase text-sm" />
        </div>
    </div>
);