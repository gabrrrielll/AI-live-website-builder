import React from 'react';

const HeaderSkeleton: React.FC = () => (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="h-7 w-32 bg-gray-300 rounded"></div>
            <div className="hidden md:flex items-center space-x-6">
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
            </div>
        </div>
    </header>
);

const HeroSkeleton: React.FC = () => (
    <section className="bg-gray-300">
        <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="text-center p-4 max-w-3xl w-full">
                <div className="h-14 bg-gray-400 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-400 rounded w-full mx-auto mb-8"></div>
                <div className="h-12 w-40 bg-gray-400 rounded-full mx-auto"></div>
            </div>
        </div>
    </section>
);

const SectionSkeleton: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className={`h-80 bg-gray-300 rounded-lg`}></div>
            <div>
                <div className="h-10 w-3/4 bg-gray-300 rounded mb-4"></div>
                <div className="h-5 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-5 w-5/6 bg-gray-300 rounded"></div>
            </div>
        </div>
    </section>
);

const AppSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <HeaderSkeleton />
        <HeroSkeleton />
        <SectionSkeleton />
        <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="h-10 w-1/2 bg-gray-300 rounded mx-auto mb-12"></div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="h-48 bg-white rounded-lg shadow-lg"></div>
                    <div className="h-48 bg-white rounded-lg shadow-lg"></div>
                    <div className="h-48 bg-white rounded-lg shadow-lg"></div>
                </div>
            </div>
        </div>
        <footer className="bg-gray-800 py-8">
            <div className="container mx-auto px-6 text-center">
                <div className="h-5 w-1/3 bg-gray-700 rounded mx-auto"></div>
            </div>
        </footer>
    </div>
);

export default AppSkeleton;