import type { Metadata } from "next";
import { SiteProvider } from "@/context/SiteContext";
import { SiteModeProvider } from "@/context/SiteModeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TestModeProvider } from "@/context/TestModeContext";
import { Toaster } from 'sonner';
import ErrorBoundary from "@/components/ErrorBoundary";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

import "./globals.css";
import 'react-image-crop/dist/ReactCrop.css';
import 'react-quill/dist/quill.snow.css';

export const metadata: Metadata = {
  title: "AI-Powered Live Website Editor",
  description: "An interactive website builder that allows for real-time, in-browser editing of text and images. All changes are saved locally, with AI-powered content generation features to assist in creation.",
  manifest: "/manifest.json",
  openGraph: {
    title: 'AI-Powered Live Website Editor',
    description: 'Create and edit your website in real-time with the power of AI.',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/og-image/1200/630',
        width: 1200,
        height: 630,
        alt: 'AI Website Editor Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Live Website Editor',
    description: 'Create and edit your website in real-time with the power of AI.',
    images: ['https://picsum.photos/seed/og-image/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <LanguageProvider>
            <TestModeProvider>
              <SiteModeProvider>
                <SiteProvider>
                  {children}
                  <Toaster richColors position="top-right" closeButton />
                </SiteProvider>
              </SiteModeProvider>
            </TestModeProvider>
          </LanguageProvider>
        </ErrorBoundary>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}