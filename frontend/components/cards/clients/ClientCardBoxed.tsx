import React from 'react';
import Editable from '@/components/Editable';

export const ClientCardBoxed: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="flex justify-center items-center p-6 rounded-lg h-24 transition-shadow duration-300">
         <Editable 
            sectionId={sectionId}
            elementId={`client-${item.id}-logo`} 
            as="img" 
            className="max-h-12 w-auto"
        />
    </div>
);