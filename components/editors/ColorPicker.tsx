"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

const parseColor = (colorStr: string | undefined): { r: number, g: number, b: number, a: number } => {
    if (!colorStr) return { r: 0, g: 0, b: 0, a: 1 };

    const rgbaMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1], 10),
            g: parseInt(rgbaMatch[2], 10),
            b: parseInt(rgbaMatch[3], 10),
            a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
        };
    }

    if (colorStr.startsWith('#')) {
        let hex = colorStr.slice(1);
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 6) {
            const bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255,
                a: 1,
            };
        }
    }

    return { r: 0, g: 0, b: 0, a: 1 }; // Fallback
};

const toHex = (r: number, g: number, b: number) => {
    const toHexPart = (c: number) => ('0' + Math.round(c).toString(16)).slice(-2);
    return `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}`.toUpperCase();
};


const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
    const [rgba, setRgba] = useState(() => parseColor(color));
    const [hex, setHex] = useState(() => toHex(rgba.r, rgba.g, rgba.b));
    const { language } = useLanguage();
    const t = useMemo(() => translations[language].editors, [language]);

    useEffect(() => {
        const newRgba = parseColor(color);
        setRgba(newRgba);
        setHex(toHex(newRgba.r, newRgba.g, newRgba.b));
    }, [color]);

    const triggerChange = useCallback((newRgba: { r: number, g: number, b: number, a: number }) => {
        onChange(`rgba(${Math.round(newRgba.r)}, ${Math.round(newRgba.g)}, ${Math.round(newRgba.b)}, ${newRgba.a})`);
    }, [onChange]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        setHex(newHex);
        if (/^#([A-Fa-f0-9]{6})$/i.test(newHex)) {
            const newRgb = parseColor(newHex);
            const newRgba = { ...rgba, ...newRgb };
            setRgba(newRgba);
            triggerChange(newRgba);
        }
    };

    const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        const newRgb = parseColor(newHex);
        const newRgba = { ...rgba, ...newRgb };
        setRgba(newRgba);
        setHex(newHex);
        triggerChange(newRgba);
    };

    const handleRgbaPartChange = (part: 'r' | 'g' | 'b' | 'a', value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        let clampedValue = numValue;
        if (part === 'a') {
            clampedValue = Math.max(0, Math.min(1, numValue));
        } else {
            clampedValue = Math.max(0, Math.min(255, Math.round(numValue)));
        }

        const newRgba = { ...rgba, [part]: clampedValue };
        setRgba(newRgba);
        setHex(toHex(newRgba.r, newRgba.g, newRgba.b));
        triggerChange(newRgba);
    };

    const checkerboardBg = {
        backgroundImage: 'conic-gradient(#ccc 0.25turn, #fff 0.25turn 0.5turn, #ccc 0.5turn 0.75turn, #fff 0.75turn)',
        backgroundSize: '16px 16px',
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center space-x-2">
                <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-300 flex-shrink-0" style={checkerboardBg}>
                    <input
                        type="color"
                        value={hex}
                        onChange={handleNativePickerChange}
                        className="w-full h-full p-0 border-none cursor-pointer absolute top-0 left-0 opacity-0"
                    />
                    <div
                        className="w-full h-full"
                        style={{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }}
                    ></div>
                </div>
                <input
                    type="text"
                    value={hex}
                    onChange={handleHexChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="#000000"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">{t.transparency}</label>
                <div className="flex items-center space-x-2">
                    <div className="flex-grow h-6 rounded" style={{ ...checkerboardBg, position: 'relative' }}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={rgba.a}
                            onChange={(e) => handleRgbaPartChange('a', e.target.value)}
                            className="w-full h-full appearance-none bg-transparent cursor-pointer absolute inset-0"
                            style={{ background: `linear-gradient(to right, transparent, ${hex})` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {(['r', 'g', 'b', 'a'] as const).map(part => (
                    <div key={part}>
                        <label className="block text-xs font-medium text-gray-500 text-center uppercase">{part}</label>
                        <input
                            type="number"
                            min={part === 'a' ? 0 : 0}
                            max={part === 'a' ? 1 : 255}
                            step={part === 'a' ? 0.01 : 1}
                            value={rgba[part]}
                            onChange={(e) => handleRgbaPartChange(part, e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-md shadow-sm text-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;