"use client";

import React from 'react';
import { ArrowLeft, Cookie, Clock, Shield, BarChart3, Target, Settings } from 'lucide-react';
import Link from 'next/link';

const CookiePolicyPage: React.FC = () => {
    const cookieTypes = [
        {
            type: 'Necesare',
            icon: Shield,
            color: 'green',
            description: 'Aceste cookie-uri sunt esențiale pentru funcționarea site-ului.',
            examples: [
                { name: 'session_id', purpose: 'Menține sesiunea utilizatorului', duration: 'Sesiune' },
                { name: 'language_pref', purpose: 'Salvează preferința de limbă', duration: '1 an' },
                { name: 'csrf_token', purpose: 'Protecție împotriva atacurilor CSRF', duration: 'Sesiune' }
            ],
            alwaysActive: true
        },
        {
            type: 'Analiză',
            icon: BarChart3,
            color: 'blue',
            description: 'Ne ajută să înțelegem cum interacționezi cu site-ul.',
            examples: [
                { name: '_ga', purpose: 'Google Analytics - identificare unică', duration: '2 ani' },
                { name: '_gid', purpose: 'Google Analytics - identificare sesiune', duration: '24 ore' },
                { name: 'page_views', purpose: 'Numărul de pagini vizitate', duration: '30 zile' }
            ],
            alwaysActive: false
        },
        {
            type: 'Funcționale',
            icon: Settings,
            color: 'purple',
            description: 'Permit funcționalități avansate și personalizare.',
            examples: [
                { name: 'theme_preference', purpose: 'Salvează tema aleasă (dark/light)', duration: '1 an' },
                { name: 'font_size', purpose: 'Mărimea fontului preferată', duration: '6 luni' },
                { name: 'sidebar_collapsed', purpose: 'Starea barei laterale', duration: 'Sesiune' }
            ],
            alwaysActive: false
        },
        {
            type: 'Marketing',
            icon: Target,
            color: 'orange',
            description: 'Folosite pentru reclame personalizate și măsurarea conversiilor.',
            examples: [
                { name: '_fbp', purpose: 'Facebook Pixel - tracking conversii', duration: '90 zile' },
                { name: 'ad_clicked', purpose: 'Tracking click-uri pe reclame', duration: '30 zile' },
                { name: 'campaign_source', purpose: 'Sursa campaniei de marketing', duration: '7 zile' }
            ],
            alwaysActive: false
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            green: 'bg-green-50 border-green-200 text-green-800',
            blue: 'bg-blue-50 border-blue-200 text-blue-800',
            purple: 'bg-purple-50 border-purple-200 text-purple-800',
            orange: 'bg-orange-50 border-orange-200 text-orange-800'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Înapoi la site
                        </Link>

                        <div className="flex items-center mb-4">
                            <Cookie className="w-8 h-8 text-blue-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Politica Cookie-urilor
                            </h1>
                        </div>

                        <p className="text-gray-600 text-lg">
                            Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">

                        {/* Introducere */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Ce sunt cookie-urile?
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Cookie-urile sunt fișiere text mici care sunt plasate pe dispozitivul tău când vizitezi un site web.
                                Ele sunt folosite pentru a face site-urile să funcționeze mai eficient și pentru a furniza informații
                                proprietarilor site-ului.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Folosim cookie-uri pentru a îmbunătăți experiența ta pe site, pentru analiză și pentru a furniza
                                funcționalități personalizate.
                            </p>
                        </section>

                        {/* Tipuri de cookie-uri */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Tipuri de cookie-uri pe care le folosim
                            </h2>

                            <div className="space-y-6">
                                {cookieTypes.map((cookieType, index) => {
                                    const IconComponent = cookieType.icon;
                                    const colorClasses = getColorClasses(cookieType.color);

                                    return (
                                        <div key={index} className={`border rounded-lg p-6 ${colorClasses}`}>
                                            <div className="flex items-center mb-4">
                                                <IconComponent className="w-6 h-6 mr-3" />
                                                <h3 className="text-xl font-semibold">
                                                    Cookie-uri {cookieType.type}
                                                </h3>
                                                {cookieType.alwaysActive && (
                                                    <span className="ml-3 px-2 py-1 text-xs font-medium bg-white bg-opacity-50 rounded-full">
                                                        Întotdeauna active
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mb-4 opacity-90">
                                                {cookieType.description}
                                            </p>

                                            <div>
                                                <h4 className="font-medium mb-3">Exemple de cookie-uri:</h4>
                                                <div className="space-y-2">
                                                    {cookieType.examples.map((example, exampleIndex) => (
                                                        <div key={exampleIndex} className="bg-white bg-opacity-50 p-3 rounded">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <span className="font-mono text-sm font-medium">
                                                                        {example.name}
                                                                    </span>
                                                                    <p className="text-sm opacity-80 mt-1">
                                                                        {example.purpose}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center text-xs opacity-70">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {example.duration}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Gestionarea cookie-urilor */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Cum poți gestiona cookie-urile
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">
                                        Prin banner-ul de consimțământ
                                    </h3>
                                    <p className="text-blue-800 text-sm">
                                        La prima vizită, vei vedea un banner care îți permite să alegi ce tipuri de cookie-uri să accepti.
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-green-900 mb-2">
                                        Prin setările de cookie-uri
                                    </h3>
                                    <p className="text-green-800 text-sm">
                                        Poți modifica preferințele oricând prin{' '}
                                        <Link href="/cookie-settings" className="underline">
                                            setările de cookie-uri
                                        </Link>.
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Prin browser-ul tău
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        Majoritatea browserelor îți permit să controlezi cookie-urile prin setările lor.
                                        Poți șterge cookie-urile existente sau să blochezi cookie-urile noi.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Cookie-uri terțe */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Cookie-uri de la terțe părți
                            </h2>

                            <p className="text-gray-600 mb-4">
                                Site-ul nostru poate conține cookie-uri de la terțe părți pentru servicii precum:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Google Analytics</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Pentru analiza traficului și comportamentului utilizatorilor.
                                    </p>
                                    <a
                                        href="https://policies.google.com/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Politica de confidențialitate Google
                                    </a>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Facebook Pixel</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Pentru tracking-ul conversiilor și reclame personalizate.
                                    </p>
                                    <a
                                        href="https://www.facebook.com/privacy/explanation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Politica de confidențialitate Facebook
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Impactul dezactivării */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Impactul dezactivării cookie-urilor
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Cookie-uri necesare:</strong>
                                        <span className="text-gray-600 ml-2">
                                            Site-ul nu va funcționa corect fără acestea.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Cookie-uri de analiză:</strong>
                                        <span className="text-gray-600 ml-2">
                                            Nu vom putea analiza utilizarea site-ului pentru îmbunătățiri.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Cookie-uri funcționale:</strong>
                                        <span className="text-gray-600 ml-2">
                                            Unele funcționalități personalizate nu vor fi disponibile.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                                    <div>
                                        <strong className="text-gray-900">Cookie-uri de marketing:</strong>
                                        <span className="text-gray-600 ml-2">
                                            Reclamele nu vor fi personalizate pentru preferințele tale.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Link-uri utile */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Link-uri utile
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Link
                                    href="/cookie-settings"
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900 mb-2">Setări Cookie-uri</h3>
                                    <p className="text-gray-600 text-sm">
                                        Gestionează preferințele tale pentru cookie-uri
                                    </p>
                                </Link>

                                <Link
                                    href="/privacy-policy"
                                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-medium text-gray-900 mb-2">Politica de Confidențialitate</h3>
                                    <p className="text-gray-600 text-sm">
                                        Informații complete despre protecția datelor
                                    </p>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicyPage;
