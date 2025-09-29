import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSite } from '@/context/SiteContext';

interface AnimationToggleProps {
    sectionId: string;
    className?: string;
}

export const AnimationToggle: React.FC<AnimationToggleProps> = ({ sectionId, className = '' }) => {
    const { siteConfig, updateSiteConfig } = useSite();

    const section = siteConfig?.sections[sectionId];
    const animationsEnabled = section?.animations?.enabled ?? true; // Default enabled

    const toggleAnimations = (enabled: boolean) => {
        if (!siteConfig) return;

        const newConfig = { ...siteConfig };
        if (!newConfig.sections[sectionId]) {
            newConfig.sections[sectionId] = {
                id: sectionId,
                component: 'Unknown',
                visible: true,
                elements: {}
            };
        }

        if (!newConfig.sections[sectionId].animations) {
            newConfig.sections[sectionId].animations = {};
        }

        newConfig.sections[sectionId].animations.enabled = enabled;
        updateSiteConfig(newConfig);
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <Switch
                id={`animations-${sectionId}`}
                checked={animationsEnabled}
                onCheckedChange={toggleAnimations}
                className="data-[state=checked]:bg-[#c29a47]"
            />
            <Label
                htmlFor={`animations-${sectionId}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
            >
                Animații {animationsEnabled ? 'Active' : 'Dezactivate'}
            </Label>
        </div>
    );
};
