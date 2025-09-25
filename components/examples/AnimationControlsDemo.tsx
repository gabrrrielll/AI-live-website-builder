import React from 'react';
import { AnimationToggle } from '@/components/controls/AnimationToggle';
import { ConditionalAnimation } from '@/components/animations/ConditionalAnimation';

interface AnimationControlsDemoProps {
    sectionId: string;
}

export const AnimationControlsDemo: React.FC<AnimationControlsDemoProps> = ({ sectionId }) => {
    return (
        <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Demo: Controale Animații</h3>

            {/* Control Panel */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
                <h4 className="text-lg font-semibold mb-3">Controale</h4>
                <AnimationToggle sectionId={sectionId} />
                <p className="text-sm text-gray-600 mt-2">
                    Folosește switch-ul de mai sus pentru a activa/dezactiva animațiile din această secțiune.
                </p>
            </div>

            {/* Animated Content */}
            <div className="space-y-6">
                <ConditionalAnimation
                    sectionId={sectionId}
                    direction="up"
                    distance={50}
                    delay={0.1}
                    className="p-6 bg-white rounded-lg shadow-sm"
                >
                    <h4 className="text-xl font-bold mb-2">Card 1</h4>
                    <p className="text-gray-600">
                        Acest card va apărea cu animație dacă animațiile sunt activate,
                        sau fără animație dacă sunt dezactivate.
                    </p>
                </ConditionalAnimation>

                <ConditionalAnimation
                    sectionId={sectionId}
                    direction="up"
                    distance={50}
                    delay={0.3}
                    className="p-6 bg-white rounded-lg shadow-sm"
                >
                    <h4 className="text-xl font-bold mb-2">Card 2</h4>
                    <p className="text-gray-600">
                        Al doilea card va apărea cu un delay, creând un efect de cascade.
                    </p>
                </ConditionalAnimation>

                <ConditionalAnimation
                    sectionId={sectionId}
                    direction="up"
                    distance={50}
                    delay={0.5}
                    className="p-6 bg-white rounded-lg shadow-sm"
                >
                    <h4 className="text-xl font-bold mb-2">Card 3</h4>
                    <p className="text-gray-600">
                        Al treilea card demonstrează cum funcționează animațiile în secvență.
                    </p>
                </ConditionalAnimation>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Instrucțiuni de utilizare:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Activează/dezactivează switch-ul pentru a controla animațiile</li>
                    <li>• În modul editare, vei vedea acest control în toolbar-ul fiecărei secțiuni</li>
                    <li>• Animațiile sunt activate implicit pentru toate secțiunile</li>
                    <li>• Setările sunt salvate în configurația site-ului</li>
                </ul>
            </div>
        </div>
    );
};
