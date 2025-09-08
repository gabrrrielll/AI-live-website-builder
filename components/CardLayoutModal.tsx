"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { X, Check, Edit2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import * as icons from 'lucide-react';
import ColorPicker from './editors/ColorPicker';
import SectionBackgroundEditor from './editors/SectionBackgroundEditor';

const shadowPresets = {
    'none': 'shadowNone',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)': 'shadowSmall',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)': 'shadowMedium',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)': 'shadowLarge',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)': 'shadowXl',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)': 'shadow2xl',
};

// PREVIEW COMPONENTS START

const AboutTemplateImageLeft = () => (
    <div className="p-2 border rounded-md bg-white flex items-center space-x-2 h-24">
        <div className="w-1/3 h-full bg-gray-300 rounded"></div>
        <div className="w-2/3 space-y-2">
            <div className="h-4 bg-gray-400 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
    </div>
);
const AboutTemplateImageRight = () => (
    <div className="p-2 border rounded-md bg-white flex items-center space-x-2 h-24">
        <div className="w-2/3 space-y-2">
            <div className="h-4 bg-gray-400 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="w-1/3 h-full bg-gray-300 rounded"></div>
    </div>
);
const AboutTemplateImageTop = () => (
    <div className="p-2 border rounded-md bg-white space-y-2 h-24">
        <div className="h-1/2 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-400 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
    </div>
);
const AboutTemplateOverlay = () => (
    <div className="p-2 border rounded-md bg-gray-300 relative h-24 flex items-center justify-center">
        <div className="bg-black/50 p-2 rounded w-4/5 space-y-1">
            <div className="h-3 bg-white/80 rounded w-full"></div>
            <div className="h-2 bg-white/70 rounded w-full"></div>
            <div className="h-2 bg-white/70 rounded w-3/4"></div>
        </div>
    </div>
);

const ServiceTemplateDefault: React.FC = () => (
    <div className="p-4 border rounded-md bg-white text-center space-y-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto flex items-center justify-center"><icons.BotMessageSquare size={16} className="text-gray-500" /></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);
const ServiceTemplateIconLeft: React.FC = () => (
    <div className="p-4 border rounded-md bg-white flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center"><icons.BotMessageSquare size={16} className="text-gray-500" /></div>
        <div className="w-full space-y-2">
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            <div className="w-full h-3 bg-gray-200 rounded"></div>
            <div className="w-full h-3 bg-gray-200 rounded"></div>
        </div>
    </div>
);
const ServiceTemplateTopBorder: React.FC = () => (
    <div className="p-4 border rounded-md bg-white space-y-2 border-t-4 border-gray-400">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><icons.BotMessageSquare size={16} className="text-gray-500" /></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);
const ServiceTemplateCircularIcon: React.FC = () => (
    <div className="p-4 border rounded-md bg-white text-center space-y-2">
        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto flex items-center justify-center"><icons.BotMessageSquare size={24} className="text-gray-500" /></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);
const ServiceTemplateMinimalist: React.FC = () => (
    <div className="p-4 border rounded-md bg-white space-y-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><icons.BotMessageSquare size={16} className="text-gray-500" /></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);
const ServiceTemplateDetailed: React.FC = () => (
    <div className="p-4 border rounded-md bg-white space-y-2 flex flex-col h-full">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><icons.BotMessageSquare size={16} className="text-gray-500" /></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded flex-grow"></div>
    </div>
);

const TeamTemplateDefault: React.FC = () => (
    <div className="p-4 border rounded-md bg-white text-center space-y-2">
        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto"></div>
        <div className="w-2/3 h-4 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/2 h-3 bg-gray-300 rounded mx-auto"></div>
    </div>
);

const TeamTemplateImageLeft: React.FC = () => (
    <div className="p-4 border rounded-md bg-white flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="w-full space-y-2">
            <div className="w-2/3 h-4 bg-gray-400 rounded"></div>
            <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
        </div>
    </div>
);

const TeamTemplateOverlay: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-300 relative h-24 flex items-end justify-center">
        <div className="w-full text-center bg-black/50 p-1 rounded-b-md">
            <div className="w-2/3 h-2 bg-white/70 rounded mx-auto mb-1"></div>
            <div className="w-1/2 h-2 bg-white/60 rounded mx-auto"></div>
        </div>
    </div>
);

const TeamTemplateSocial: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-1">
        <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto"></div>
        <div className="w-2/3 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/2 h-2 bg-gray-300 rounded mx-auto"></div>
        <div className="flex justify-center space-x-1 mt-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);

const TeamTemplateBio: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-1">
        <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto"></div>
        <div className="w-2/3 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/2 h-2 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-2 bg-gray-200 rounded mt-1"></div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
    </div>
);

const TeamTemplateMinimal: React.FC = () => (
    <div className="p-2 border-2 border-gray-300 rounded-md bg-white text-center space-y-1">
        <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto"></div>
        <div className="w-2/3 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/2 h-2 bg-gray-300 rounded mx-auto"></div>
    </div>
);

const HowItWorksTemplateDefault: React.FC = () => (
    <div className="p-4 border rounded-md bg-white text-center space-y-2 relative pt-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-400 text-white text-xs font-bold rounded-full flex items-center justify-center">1</div>
        <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);
const HowItWorksTemplateLeft: React.FC = () => (
    <div className="p-4 border rounded-md bg-white flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-400 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">1</div>
        <div className="w-full space-y-2">
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            <div className="w-full h-3 bg-gray-200 rounded"></div>
        </div>
    </div>
);
const HowItWorksTemplateMinimalist: React.FC = () => (
    <div className="p-4 border rounded-md bg-white space-y-2">
        <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-400">01.</span>
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded ml-10"></div>
    </div>
);
const HowItWorksTemplateConnected: React.FC = () => (
    <div className="p-4 border rounded-md bg-white relative flex items-start space-x-3">
        <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-6 h-6 bg-gray-400 rounded-full z-10"></div>
            <div className="w-px h-10 bg-gray-300"></div>
        </div>
        <div className="w-full space-y-2 mt-1">
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            <div className="w-full h-3 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const HowItWorksTemplateTilted: React.FC = () => (
    <div className="p-4 border rounded-md bg-white text-center space-y-2 relative pt-6 -rotate-2">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-400 text-white text-xs font-bold rounded-full flex items-center justify-center">1</div>
        <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);
const HowItWorksTemplateIconFocus: React.FC = () => (
    <div className="p-4 border rounded-md bg-white text-center space-y-2 relative">
        <div className="absolute top-1 left-1 text-gray-300 text-[8px] font-bold">STEP 1</div>
        <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto flex items-center justify-center"><icons.Target size={20} className="text-gray-500" /></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);

const DefaultTemplate: React.FC = () => (
    <div className="p-4 border rounded-md bg-white space-y-2">
        <div className="w-full h-12 bg-gray-200 rounded"></div>
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
);

const BlogTemplateImageLeft: React.FC = () => (
    <div className="p-2 border rounded-md bg-white flex items-start space-x-2 h-full">
        <div className="w-1/3 h-full bg-gray-200 rounded flex-shrink-0"></div>
        <div className="w-full space-y-2">
            <div className="w-full h-3 bg-gray-300 rounded"></div>
            <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
            <div className="w-full h-2 bg-gray-200 rounded mt-2"></div>
            <div className="w-full h-2 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const BlogTemplateOverlay: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-300 relative h-24 flex flex-col justify-end">
        <div className="w-2/3 h-3 bg-white/70 rounded mb-1"></div>
        <div className="w-full h-2 bg-white/60 rounded"></div>
    </div>
);

const BlogTemplateMinimalist: React.FC = () => (
    <div className="p-3 border rounded-md bg-white space-y-2 border-t-4 border-gray-400 h-full">
        <div className="w-1/2 h-3 bg-gray-400 rounded"></div>
        <div className="w-full h-3 bg-gray-300 rounded mt-2"></div>
        <div className="w-2/3 h-2 bg-gray-200 rounded mt-2"></div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
    </div>
);

const BlogTemplateCentered: React.FC = () => (
    <div className="p-2 border rounded-md bg-white space-y-2 text-center">
        <div className="w-full h-12 bg-gray-200 rounded"></div>
        <div className="w-2/3 h-3 bg-gray-300 rounded mx-auto"></div>
        <div className="w-full h-2 bg-gray-200 rounded mx-auto mt-2"></div>
    </div>
);

// Previews for Testimonials
const TestimonialTemplateDefault: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-500 text-center space-y-1">
        <div className="flex justify-center space-x-0.5"><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div></div>
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="w-1/2 h-3 bg-white/70 rounded mx-auto mt-2"></div>
    </div>
);
const TestimonialTemplateImageLeft: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-500 flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-400 rounded-full flex-shrink-0"></div>
        <div className="w-full space-y-1">
            <div className="w-full h-2 bg-gray-400 rounded"></div>
            <div className="w-1/2 h-3 bg-white/70 rounded mt-1"></div>
        </div>
    </div>
);
const TestimonialTemplateCenteredImage: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-500 text-center space-y-1">
        <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto"></div>
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="w-1/2 h-3 bg-white/70 rounded mx-auto mt-1"></div>
    </div>
);
const TestimonialTemplateSimpleQuote: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-500 text-center space-y-1">
        <icons.Quote size={16} className="text-gray-400 mx-auto" />
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="w-1/2 h-3 bg-white/70 rounded mx-auto mt-1"></div>
    </div>
);
const TestimonialTemplateBoxed: React.FC = () => (
    <div className="p-2 border-2 border-gray-400 rounded-md bg-gray-500 text-center space-y-1">
        <div className="flex justify-center space-x-0.5"><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div><div className="w-2 h-2 bg-yellow-300 rounded-full"></div></div>
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="w-1/2 h-3 bg-white/70 rounded mx-auto mt-2"></div>
    </div>
);
const TestimonialTemplateModern: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-500 flex flex-col justify-between h-full">
        <div className="w-full h-2 bg-gray-400 rounded"></div>
        <div className="flex items-center space-x-2 mt-2">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex-shrink-0"></div>
            <div className="w-1/2 h-3 bg-white/70 rounded"></div>
        </div>
    </div>
);

const StatsTemplateDefault: React.FC = () => (
    <div className="p-2 border-2 border-dashed border-gray-300 rounded-md bg-white text-center space-y-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto"></div>
        <div className="w-1/2 h-4 bg-gray-400 rounded mx-auto"></div>
        <div className="w-2/3 h-3 bg-gray-300 rounded mx-auto"></div>
    </div>
);

const StatsTemplateContained: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-100 text-center space-y-1">
        <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto"></div>
        <div className="w-1/2 h-4 bg-gray-400 rounded mx-auto"></div>
        <div className="w-2/3 h-3 bg-gray-300 rounded mx-auto"></div>
    </div>
);

const StatsTemplateLeftAligned: React.FC = () => (
    <div className="p-2 border rounded-md bg-white flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        <div className="w-full space-y-1">
            <div className="w-1/2 h-4 bg-gray-400 rounded"></div>
            <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
        </div>
    </div>
);
const StatsTemplateTopBorder: React.FC = () => (
    <div className="p-2 border rounded-md bg-white space-y-1 border-t-4 border-gray-400">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        <div className="w-1/2 h-4 bg-gray-400 rounded"></div>
        <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
    </div>
);

const StatsTemplateCircularIcon: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-1">
        <div className="w-10 h-10 bg-gray-400 rounded-full mx-auto flex items-center justify-center"><div className="w-4 h-4 bg-gray-300 rounded-full"></div></div>
        <div className="w-1/2 h-4 bg-gray-400 rounded mx-auto"></div>
        <div className="w-2/3 h-3 bg-gray-300 rounded mx-auto"></div>
    </div>
);
const StatsTemplateMinimalistFocus: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-1">
        <div className="w-1/2 h-4 bg-gray-400 rounded mx-auto"></div>
        <div className="flex justify-center items-center space-x-1 mt-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
        </div>
    </div>
);

const PortfolioTemplateDefault: React.FC = () => <div className="p-2 border rounded-md bg-white h-full flex items-center justify-center"><div className="w-full h-1/2 bg-gray-300 rounded"></div></div>;
const PortfolioTemplateHover: React.FC = () => <div className="p-2 border rounded-md bg-gray-300 relative h-full flex items-center justify-center"><div className="w-2/3 h-4 bg-white/80 rounded"></div></div>;
const PortfolioTemplateTextBelow: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-full flex flex-col">
        <div className="h-2/3 bg-gray-300 rounded"></div>
        <div className="h-1/3 pt-2 space-y-1">
            <div className="w-2/3 h-3 bg-gray-400 rounded"></div>
            <div className="w-full h-2 bg-gray-300 rounded"></div>
        </div>
    </div>
);
const PortfolioTemplateOverlay: React.FC = () => (
    <div className="p-2 border rounded-md bg-gray-300 relative h-full flex flex-col justify-end">
        <div className="p-1 bg-black/50 rounded-sm">
            <div className="w-1/3 h-2 bg-white/70 rounded mb-1"></div>
            <div className="w-2/3 h-3 bg-white/80 rounded"></div>
        </div>
    </div>
);
const PortfolioTemplateMinimalist: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-full flex flex-col">
        <div className="h-2/3 border-2 border-gray-300 rounded p-1"><div className="bg-gray-200 h-full w-full rounded-sm"></div></div>
        <div className="h-1/3 pt-2 text-center">
            <div className="w-2/3 h-3 bg-gray-400 rounded mx-auto"></div>
        </div>
    </div>
);
const PortfolioTemplateDetailed: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-full flex flex-col">
        <div className="h-1/2 bg-gray-300 rounded"></div>
        <div className="h-1/2 pt-2 space-y-1">
            <div className="w-1/3 h-2 bg-gray-400 rounded"></div>
            <div className="w-2/3 h-3 bg-gray-400 rounded"></div>
            <div className="w-full h-2 bg-gray-300 rounded"></div>
            <div className="w-1/4 h-2 bg-gray-400 rounded mt-1"></div>
        </div>
    </div>
);

const PricingTemplateDefault: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-2 relative border-t-2 border-gray-400">
        <div className="w-1/2 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/3 h-5 bg-gray-500 rounded mx-auto"></div>
        <div className="w-full h-2 bg-gray-300 rounded"></div>
        <div className="w-full h-2 bg-gray-300 rounded"></div>
        <div className="w-full h-4 bg-gray-400 rounded mt-2"></div>
    </div>
);
const PricingTemplateDetailed: React.FC = () => (
    <div className="p-2 border-2 border-gray-400 rounded-md bg-white text-center space-y-2 relative h-full flex flex-col">
        <div className="w-1/2 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/3 h-5 bg-gray-500 rounded mx-auto"></div>
        <div className="space-y-1 flex-grow mt-2">
            <div className="w-full h-2 bg-gray-300 rounded"></div>
            <div className="w-full h-2 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full h-4 bg-gray-400 rounded mt-2"></div>
    </div>
);
const PricingTemplateTopHighlight: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-2 relative border-t-4 border-gray-400">
        <div className="w-1/2 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/3 h-5 bg-gray-500 rounded mx-auto"></div>
        <div className="w-full h-2 bg-gray-300 rounded"></div>
        <div className="w-full h-2 bg-gray-300 rounded"></div>
        <div className="w-full h-4 bg-gray-400 rounded mt-2"></div>
    </div>
);
const PricingTemplateSimple: React.FC = () => (
    <div className="p-2 border border-gray-300 rounded-md bg-white space-y-2">
        <div className="w-1/2 h-3 bg-gray-400 rounded"></div>
        <div className="w-1/3 h-5 bg-gray-500 rounded"></div>
        <div className="w-full h-2 bg-gray-300 rounded"></div>
        <div className="w-full h-4 bg-gray-500 rounded mt-2"></div>
    </div>
);
const PricingTemplateClean: React.FC = () => (
    <div className="p-2 border rounded-md bg-white text-center space-y-2 relative h-full flex flex-col">
        <div className="w-1/2 h-3 bg-gray-400 rounded mx-auto"></div>
        <div className="w-1/3 h-5 bg-gray-500 rounded mx-auto"></div>
        <div className="space-y-1 flex-grow mt-2">
            <div className="w-full h-2 bg-gray-300 rounded"></div>
        </div>
        <div className="w-full h-4 bg-gray-400 rounded mt-2"></div>
    </div>
);
const PricingTemplateSplit: React.FC = () => (
    <div className="border rounded-md bg-white h-full flex flex-col overflow-hidden">
        <div className="p-2 space-y-1">
            <div className="w-1/2 h-3 bg-gray-400 rounded"></div>
            <div className="w-full h-2 bg-gray-300 rounded"></div>
        </div>
        <div className="mt-auto bg-gray-400 p-2 space-y-1">
            <div className="w-1/3 h-4 bg-white/80 rounded"></div>
            <div className="w-full h-4 bg-white/90 rounded"></div>
        </div>
    </div>
);

const ClientTemplateDefault: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-16 flex items-center justify-center">
        <div className="w-12 h-6 bg-gray-300 rounded-md"></div>
    </div>
);

const ClientTemplateBoxed: React.FC = () => (
    <div className="p-2 border rounded-lg bg-gray-100 h-16 flex items-center justify-center">
        <div className="w-12 h-6 bg-gray-300 rounded-md"></div>
    </div>
);
const ClientTemplateMinimalist: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-16 flex items-center justify-center">
        <div className="w-12 h-6 bg-gray-300 rounded-md opacity-70"></div>
    </div>
);
const ClientTemplateCarousel: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-16 flex items-center justify-center">
        <div className="w-12 h-6 bg-gray-300 rounded-md"></div>
    </div>
);

const FAQTemplateDefault: React.FC = () => (
    <div className="p-2 border rounded-md bg-white h-16 flex flex-col justify-center space-y-2">
        <div className="w-full h-3 bg-gray-300 rounded"></div>
        <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
    </div>
);

// Hero Template Components
const HeroTemplateSlider: React.FC = () => (
    <div className="w-full h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            </div>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
    </div>
);

const HeroTemplateGradient: React.FC = () => (
    <div className="w-full h-20 bg-gradient-to-r from-red-400 via-blue-400 to-green-400 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute w-8 h-8 bg-red-300 rounded-full top-2 left-2 opacity-60 blur-sm"></div>
            <div className="absolute w-6 h-6 bg-blue-300 rounded-full top-4 right-4 opacity-50 blur-sm"></div>
            <div className="absolute w-10 h-10 bg-green-300 rounded-full bottom-2 left-1/3 opacity-40 blur-sm"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xs font-bold bg-black/20 px-2 py-1 rounded">Gradient Waves</div>
        </div>
    </div>
);

const templatePreviews: { [key: string]: { [key: string]: React.FC } } = {
    About: { 'image-left': AboutTemplateImageLeft, 'image-right': AboutTemplateImageRight, 'image-top': AboutTemplateImageTop, 'overlay': AboutTemplateOverlay },
    Services: { 'default': ServiceTemplateDefault, 'icon-left': ServiceTemplateIconLeft, 'top-border': ServiceTemplateTopBorder, 'circular-icon': ServiceTemplateCircularIcon, 'minimalist': ServiceTemplateMinimalist, 'detailed': ServiceTemplateDetailed },
    Stats: { 'default': StatsTemplateDefault, 'contained': StatsTemplateContained, 'left-aligned': StatsTemplateLeftAligned, 'top-border': StatsTemplateTopBorder, 'circular-icon': StatsTemplateCircularIcon, 'minimalist-focus': StatsTemplateMinimalistFocus },
    Portfolio: { 'default': PortfolioTemplateDefault, 'hover': PortfolioTemplateHover, 'text-below': PortfolioTemplateTextBelow, 'overlay': PortfolioTemplateOverlay, 'minimalist': PortfolioTemplateMinimalist, 'detailed': PortfolioTemplateDetailed },
    Team: { 'default': TeamTemplateDefault, 'image-left': TeamTemplateImageLeft, 'overlay': TeamTemplateOverlay, 'social': TeamTemplateSocial, 'bio': TeamTemplateBio, 'minimal': TeamTemplateMinimal },
    Pricing: { 'default': PricingTemplateDefault, 'detailed': PricingTemplateDetailed, 'top-highlight': PricingTemplateTopHighlight, 'simple': PricingTemplateSimple, 'clean': PricingTemplateClean, 'split': PricingTemplateSplit },
    Testimonials: { 'default': TestimonialTemplateDefault, 'image-left': TestimonialTemplateImageLeft, 'centered-image': TestimonialTemplateCenteredImage, 'simple-quote': TestimonialTemplateSimpleQuote, 'boxed': TestimonialTemplateBoxed, 'modern': TestimonialTemplateModern },
    Blog: { 'default': DefaultTemplate, 'image-left': BlogTemplateImageLeft, 'overlay': BlogTemplateOverlay, 'minimalist': BlogTemplateMinimalist, 'centered': BlogTemplateCentered },
    HowItWorks: { 'default': HowItWorksTemplateDefault, 'left': HowItWorksTemplateLeft, 'minimalist': HowItWorksTemplateMinimalist, 'connected': HowItWorksTemplateConnected, 'tilted': HowItWorksTemplateTilted, 'icon-focus': HowItWorksTemplateIconFocus },
    Clients: { 'default': ClientTemplateDefault, 'boxed': ClientTemplateBoxed, 'minimalist': ClientTemplateMinimalist, 'carousel': ClientTemplateCarousel },
    FAQ: { 'default': FAQTemplateDefault },
    Hero: { 'slider': HeroTemplateSlider, 'gradient-waves': HeroTemplateGradient },
};

const CardLayoutModal: React.FC = () => {
    const { siteConfig, editingSectionLayoutId, stopEditingSectionLayout, updateSectionLayout, startEditingSlideStyles } = useSite();
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].editors, [language]);

    const section = siteConfig?.sections[editingSectionLayoutId || ''];

    const [selectedTemplate, setSelectedTemplate] = useState(section?.layout?.variant || section?.layout?.template || 'default');
    const [itemCount, setItemCount] = useState(section?.layout?.itemCount || 1);
    const [imageWidth, setImageWidth] = useState(section?.layout?.imageWidth || 50);
    const [slideDuration, setSlideDuration] = useState(section?.layout?.duration || 5);
    const [cardBackgroundColor, setCardBackgroundColor] = useState(section?.cardStyles?.backgroundColor as string || '#ffffff');
    const [cardShadow, setCardShadow] = useState(section?.cardStyles?.boxShadow as string || 'none');
    const [isCarousel, setIsCarousel] = useState(section?.layout?.carousel || false);
    const [view, setView] = useState<'main' | 'slide-editor'>('main');

    // Hero specific state
    const [gradientColors, setGradientColors] = useState(section?.layout?.gradientColors || {
        color1: '#ff1744',
        color2: '#00e5ff',
        color3: '#ff6f00',
        color4: '#76ff03'
    });
    const [waveAnimation, setWaveAnimation] = useState(section?.layout?.waveAnimation || {
        speed: 1,
        intensity: 1.2,
        spacing: 0.1,
        diffusion: 50
    });

    useEffect(() => {
        if (section) {
            setSelectedTemplate(section.layout?.variant || section.layout?.template || 'default');
            setItemCount(section.layout?.itemCount || (section.items?.length || 1));
            setImageWidth(section.layout?.imageWidth || 50);
            setSlideDuration(section.layout?.duration || 5);
            setCardBackgroundColor(section.cardStyles?.backgroundColor as string || '#ffffff');
            setCardShadow(section.cardStyles?.boxShadow as string || 'none');
            setIsCarousel(section.layout?.carousel || false);
            setView('main');

            // Hero specific
            if (section.component === 'Hero') {
                setGradientColors(section.layout?.gradientColors || {
                    color1: '#ff1744',
                    color2: '#00e5ff',
                    color3: '#ff6f00',
                    color4: '#76ff03'
                });
                setWaveAnimation(section.layout?.waveAnimation || {
                    speed: 1,
                    intensity: 1.2,
                    spacing: 0.1,
                    diffusion: 50
                });
            }
        }
    }, [section]);

    if (!editingSectionLayoutId || !siteConfig || !section) return null;

    const { component: sectionComponent, id: sectionId } = section;
    const availableTemplates = templatePreviews[sectionComponent] || {};

    const handleApply = () => {
        const layoutChanges: any = { template: selectedTemplate };
        const cardStylesChanges: any = { backgroundColor: cardBackgroundColor, boxShadow: cardShadow };

        if (controls.itemCount) layoutChanges.itemCount = itemCount;
        if (controls.imageWidth) layoutChanges.imageWidth = imageWidth;
        if (controls.slideDuration) layoutChanges.duration = slideDuration;
        if (controls.carousel) layoutChanges.carousel = isCarousel;

        // Hero specific
        if (sectionComponent === 'Hero') {
            layoutChanges.variant = selectedTemplate;
            layoutChanges.gradientColors = gradientColors;
            layoutChanges.waveAnimation = waveAnimation;
        }

        updateSectionLayout(editingSectionLayoutId, layoutChanges, cardStylesChanges);
        stopEditingSectionLayout();
    };

    const getTranslationKey = (sectionComponent: string, template: string) => {
        const key = `template_${sectionComponent.toLowerCase().replace(/\s+/g, '_')}_${template}`;
        // Fallback for default templates
        if (!(key in t) && template === 'default') return 'template_default';
        return key;
    };

    const shadowValueToKey = (value: string) => {
        const key = Object.keys(shadowPresets).find(k => shadowPresets[k as keyof typeof shadowPresets] === value);
        return key ? shadowPresets[key as keyof typeof shadowPresets] : 'shadowMedium';
    };

    const shadowKeyToValue = (key: string) => {
        const presetKey = Object.keys(shadowPresets).find(k => shadowPresets[k as keyof typeof shadowPresets] === key);
        return presetKey || 'none';
    };

    const controls = {
        itemCount: ['Services', 'Stats', 'Team', 'Clients', 'Pricing', 'Testimonials', 'Blog', 'HowItWorks', 'Portfolio'].includes(sectionComponent),
        imageWidth: sectionComponent === 'About',
        cardStyling: !['About', 'Hero', 'FAQ'].includes(sectionComponent),
        slideDuration: sectionComponent === 'Hero',
        slideBackgrounds: sectionComponent === 'Hero',
        carousel: sectionComponent === 'Portfolio',
        heroGradient: sectionComponent === 'Hero'
    };

    const maxItems: { [key: string]: number } = {
        Services: 6, Stats: 5, Team: 12, Testimonials: 4, Blog: 9, HowItWorks: 6, Pricing: 5, Portfolio: 9, Clients: 15
    };

    const renderSlideEditor = () => (
        <>
            <div className="p-4 border-b flex items-center">
                <button onClick={() => setView('main')} className="p-2 mr-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
                <h3 className="text-lg font-semibold text-gray-800">{t.slideBackgrounds}</h3>
            </div>
            <div className="p-6 space-y-4">
                {section.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Slide #{item.id}</span>
                        <button onClick={() => { stopEditingSectionLayout(); startEditingSlideStyles(sectionId, item.id); }} className="flex items-center px-3 py-1.5 bg-white border rounded-md text-sm text-gray-600 hover:bg-gray-100">
                            <Edit2 size={14} className="mr-2" />
                            {t.editBackground}
                        </button>
                    </div>
                ))}
            </div>
        </>
    );

    const renderMainEditor = () => (
        <>
            <div className="p-6 space-y-6">
                {Object.keys(availableTemplates).length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.selectLayout}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(availableTemplates).map(([key, PreviewComponent]) => {
                                const translationKey = getTranslationKey(sectionComponent, key);
                                return (
                                    <div key={key} onClick={() => setSelectedTemplate(key)} className="cursor-pointer flex flex-col">
                                        <div className={`relative rounded-lg overflow-hidden border-2 h-full flex flex-col justify-center ${selectedTemplate === key ? 'border-blue-500' : 'border-transparent'}`}>
                                            <PreviewComponent />
                                            {selectedTemplate === key && (
                                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                    <Check size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-center text-sm mt-2 ${selectedTemplate === key ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                                            {t[translationKey as keyof typeof t] || key}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {controls.carousel && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium text-gray-700">{t.displayAsCarousel}</h4>
                                {section?.items && section.items.length <= 3 && <p className="text-xs text-gray-500">{t.carouselRequirement}</p>}
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isCarousel} onChange={(e) => setIsCarousel(e.target.checked)} disabled={section?.items && section.items.length <= 3} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                )}

                {controls.itemCount && (
                    <div className="border-t pt-4">
                        <label htmlFor="itemCount" className="block text-sm font-medium text-gray-700 mb-2">{t.itemCount}: <span className="font-bold">{itemCount}</span></label>
                        <input id="itemCount" type="range" min="1" max={maxItems[sectionComponent] || 6} value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} className="w-full" />
                    </div>
                )}

                {controls.imageWidth && (
                    <div className="border-t pt-4">
                        <label htmlFor="imageWidth" className="block text-sm font-medium text-gray-700 mb-2">{t.imageWidth}: <span className="font-bold">{imageWidth}%</span></label>
                        <input id="imageWidth" type="range" min="25" max="75" step="5" value={imageWidth} onChange={(e) => setImageWidth(Number(e.target.value))} className="w-full" />
                    </div>
                )}

                {controls.cardStyling && (
                    <div className="border-t pt-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">{t.cardStyling}</h3>
                        <ColorPicker
                            label={t.cardBackgroundColor}
                            color={cardBackgroundColor}
                            onChange={setCardBackgroundColor}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.cardShadow}</label>
                            <select value={shadowValueToKey(cardShadow)} onChange={(e) => setCardShadow(shadowKeyToValue(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                {Object.entries(shadowPresets).map(([value, key]) => (
                                    <option key={key} value={key}>{t[key as keyof typeof t]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {controls.slideDuration && selectedTemplate === 'slider' && (
                    <div className="border-t pt-4">
                        <label htmlFor="slideDuration" className="block text-sm font-medium text-gray-700 mb-2">{t.slideDuration}: <span className="font-bold">{slideDuration} {t.durationSeconds}</span></label>
                        <input id="slideDuration" type="range" min="2" max="15" step="1" value={slideDuration} onChange={(e) => setSlideDuration(Number(e.target.value))} className="w-full" />
                    </div>
                )}

                {controls.slideBackgrounds && selectedTemplate === 'slider' && (
                    <div className="border-t pt-4">
                        <button onClick={() => setView('slide-editor')} className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-gray-800">
                            {t.slideBackgrounds}
                        </button>
                    </div>
                )}

                {/* Hero Gradient Controls */}
                {controls.heroGradient && selectedTemplate === 'gradient-waves' && (
                    <div className="border-t pt-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Configurare Gradient Waves</h3>

                        {/* Gradient Colors */}
                        <div className="space-y-3">
                            <h4 className="text-md font-medium text-gray-700">Culori Gradient</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">Culoare 1</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={gradientColors.color1}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color1: e.target.value }))}
                                            className="w-8 h-8 rounded border border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={gradientColors.color1}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color1: e.target.value }))}
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">Culoare 2</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={gradientColors.color2}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color2: e.target.value }))}
                                            className="w-8 h-8 rounded border border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={gradientColors.color2}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color2: e.target.value }))}
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">Culoare 3</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={gradientColors.color3}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color3: e.target.value }))}
                                            className="w-8 h-8 rounded border border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={gradientColors.color3}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color3: e.target.value }))}
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-600">Culoare 4</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="color"
                                            value={gradientColors.color4}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color4: e.target.value }))}
                                            className="w-8 h-8 rounded border border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={gradientColors.color4}
                                            onChange={(e) => setGradientColors(prev => ({ ...prev, color4: e.target.value }))}
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Animation Settings */}
                        <div className="space-y-3">
                            <h4 className="text-md font-medium text-gray-700">Setări Animație</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Viteza Animație: <span className="font-bold">{waveAnimation.speed}x</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="3"
                                        step="0.1"
                                        value={waveAnimation.speed}
                                        onChange={(e) => setWaveAnimation(prev => ({ ...prev, speed: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Înălțime Valuri: <span className="font-bold">{waveAnimation.intensity}x</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="1.2"
                                        step="0.1"
                                        value={waveAnimation.intensity}
                                        onChange={(e) => setWaveAnimation(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        <span className="text-red-500">0.5</span> = Valuri joase |
                                        <span className="text-blue-500"> 0.85</span> = Înălțime medie |
                                        <span className="text-green-500"> 1.2</span> = Înălțime maximă
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Distanță Valuri: <span className="font-bold">{waveAnimation.spacing}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="10"
                                        step="0.1"
                                        value={waveAnimation.spacing || 0.1}
                                        onChange={(e) => setWaveAnimation(prev => ({ ...prev, spacing: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        <span className="text-red-500">0.1</span> = Valuri extrem de apropiate |
                                        <span className="text-blue-500"> 1</span> = Distanță medie |
                                        <span className="text-green-500"> 10</span> = Distanță maximă
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Umbră Valuri: <span className="font-bold">{waveAnimation.diffusion}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={waveAnimation.diffusion || 50}
                                        onChange={(e) => setWaveAnimation(prev => ({ ...prev, diffusion: Number(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        <span className="text-red-500">0%</span> = Valuri clare |
                                        <span className="text-blue-500"> 50%</span> = Umbră medie |
                                        <span className="text-green-500"> 100%</span> = Umbră intensă (întrepătrundere)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-2">
                            <h4 className="text-md font-medium text-gray-700">Preview</h4>
                            <div className="w-full h-16 rounded-lg relative overflow-hidden" style={{
                                background: `linear-gradient(135deg, ${gradientColors.color1}, ${gradientColors.color2}, ${gradientColors.color3}, ${gradientColors.color4})`,
                                backgroundSize: '300% 300%',
                                animation: `gradientShift ${6 / waveAnimation.speed}s ease infinite`
                            }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-xs font-bold bg-black/20 px-2 py-1 rounded">
                                        Gradient Waves Preview
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CSS for gradient animation */}
                        <style jsx>{`
                            @keyframes gradientShift {
                                0% { background-position: 0% 50%; }
                                25% { background-position: 100% 0%; }
                                50% { background-position: 100% 100%; }
                                75% { background-position: 0% 100%; }
                                100% { background-position: 0% 50%; }
                            }
                        `}</style>
                    </div>
                )}
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                <button onClick={handleApply} className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">{t.applyChanges}</button>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-28" onClick={stopEditingSectionLayout}>
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all flex flex-col max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                {view === 'main' ? (
                    <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                        <h2 className="text-xl font-semibold text-gray-800">{t.editSectionLayout} ({section.component})</h2>
                        <button onClick={stopEditingSectionLayout} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                ) : null}

                <div className="overflow-y-auto">
                    {view === 'main' ? renderMainEditor() : renderSlideEditor()}
                </div>
            </div>
        </div>
    );
};

export default CardLayoutModal;