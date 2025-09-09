"use client";

import React from 'react';
import Editable from '@/components/Editable';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface FooterProps {
    sectionId: string;
}

export const Footer: React.FC<FooterProps> = ({ sectionId }) => (
    <footer className="pt-20 pb-8 text-white">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
                {/* Column 1: Logo and Description */}
                <div className="space-y-4">
                    <Editable sectionId={sectionId} elementId="footer-logo" />
                    <Editable sectionId={sectionId} elementId="footer-description" as="p" className="text-gray-400" />
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-4">
                    <Editable sectionId={sectionId} elementId="footer-links-1-title" as="h3" className="font-semibold uppercase tracking-wider" />
                    <Editable sectionId={sectionId} elementId="footer-links-1-content" as="div" className="footer-links" />
                </div>

                {/* Column 3: Legal Links */}
                <div className="space-y-4">
                    <Editable sectionId={sectionId} elementId="footer-links-2-title" as="h3" className="font-semibold uppercase tracking-wider" />
                    <Editable sectionId={sectionId} elementId="footer-links-2-content" as="div" className="footer-links" />
                </div>

                {/* Column 4: Contact */}
                <div className="space-y-4">
                    <Editable sectionId={sectionId} elementId="footer-contact-title" as="h3" className="font-semibold uppercase tracking-wider" />
                    <div className="space-y-2 text-gray-400">
                        <Editable sectionId={sectionId} elementId="footer-contact-address" as="p" />
                        <Editable sectionId={sectionId} elementId="footer-contact-phone" as="p" />
                        <Editable sectionId={sectionId} elementId="footer-contact-email" as="p" />
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-center">
                <Editable sectionId={sectionId} elementId="footer-copyright" as="p" className="text-gray-400 text-sm" />
                <div className="mt-4 sm:mt-0">
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    </footer>
);