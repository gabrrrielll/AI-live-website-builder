"use client";

import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ChevronRight, Home } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                    <p className="mt-4 text-gray-600">Se încarcă pagina...</p>
                </div>
            </div>
        );
    }

    const headerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Header');

    const footerSection = siteConfig.sectionOrder
        .map(id => siteConfig.sections[id])
        .find(section => section?.component === 'Footer');

    const footerStyles = resolveBackgroundImage(footerSection?.styles, getImageUrl);

    return (
        <App>
            <>
                {headerSection && <Header sectionId={headerSection.id} />}
                <main>
                    {/* Breadcrumb */}
                    <div className="container mx-auto px-6 py-4">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/" className="flex items-center hover:text-[#c29a47] transition-colors">
                                <Home size={16} className="mr-1" />
                                Acasă
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-800 font-medium">
                                Politica de Confidențialitate
                            </span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <Shield className="w-8 h-8 text-blue-600 mr-3" />
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Politica de Confidențialitate
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
                                Introducere
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Respectăm confidențialitatea ta și ne angajăm să protejăm datele tale personale.
                                Această politică de confidențialitate explică cum colectăm, folosim și protejăm
                                informațiile tale când vizitezi site-ul nostru.
                            </p>
                        </section>

                        {/* Datele colectate */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Database className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Ce date colectăm
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Date colectate automat:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Adresa IP și informații despre browser</li>
                                        <li>Pagini vizitate și timpul petrecut pe site</li>
                                        <li>Referrer (site-ul de unde ai ajuns la noi)</li>
                                        <li>Informații despre dispozitivul și browser-ul folosit</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Date pe care ni le furnizezi voluntar:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Nume și adresă de email (când completezi formulare)</li>
                                        <li>Mesaje trimise prin formularele de contact</li>
                                        <li>Preferințe de cookie-uri</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Cum folosim datele */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Eye className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Cum folosim datele tale
                                </h2>
                            </div>

                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Pentru a îmbunătăți funcționalitatea și experiența pe site</li>
                                <li>Pentru a răspunde la întrebările și solicitările tale</li>
                                <li>Pentru a analiza utilizarea site-ului și a genera statistici</li>
                                <li>Pentru a respecta obligațiile legale</li>
                                <li>Pentru a preveni frauda și a asigura securitatea</li>
                            </ul>
                        </section>

                        {/* Cookie-uri */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Users className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Cookie-uri
                                </h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Folosim cookie-uri pentru a îmbunătăți experiența ta pe site.
                                Poți gestiona preferințele pentru cookie-uri în{' '}
                                <Link href="/cookie-settings" className="text-blue-600 hover:underline">
                                    setările de cookie-uri
                                </Link>.
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-800 mb-2">Tipuri de cookie-uri folosite:</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    <li><strong>Cookie-uri necesare:</strong> Pentru funcționarea de bază a site-ului</li>
                                    <li><strong>Cookie-uri de analiză:</strong> Pentru a înțelege cum folosești site-ul</li>
                                    <li><strong>Cookie-uri funcționale:</strong> Pentru funcționalități avansate</li>
                                    <li><strong>Cookie-uri de marketing:</strong> Pentru reclame personalizate</li>
                                </ul>
                            </div>
                        </section>

                        {/* Securitatea datelor */}
                        <section>
                            <div className="flex items-center mb-4">
                                <Lock className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Securitatea datelor
                                </h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Implementăm măsuri de securitate tehnice și organizaționale pentru a proteja
                                datele tale împotriva accesului neautorizat, modificării, divulgării sau distrugerii.
                            </p>

                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Criptarea datelor în tranzit și la rest</li>
                                <li>Acces restricționat la datele personale</li>
                                <li>Monitorizarea regulată a sistemelor de securitate</li>
                                <li>Formarea personalului privind protecția datelor</li>
                            </ul>
                        </section>

                        {/* Drepturile tale */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Drepturile tale GDPR
                            </h2>

                            <p className="text-gray-600 mb-4">
                                Conform GDPR, ai următoarele drepturi privind datele tale personale:
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">Dreptul de acces</h3>
                                    <p className="text-blue-800 text-sm">
                                        Poți solicita informații despre datele tale personale pe care le procesăm.
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-green-900 mb-2">Dreptul de rectificare</h3>
                                    <p className="text-green-800 text-sm">
                                        Poți solicita corectarea datelor inexacte sau incomplete.
                                    </p>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-red-900 mb-2">Dreptul de ștergere</h3>
                                    <p className="text-red-800 text-sm">
                                        Poți solicita ștergerea datelor tale în anumite circumstanțe.
                                    </p>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-yellow-900 mb-2">Dreptul de portabilitate</h3>
                                    <p className="text-yellow-800 text-sm">
                                        Poți solicita transferul datelor către alt operator.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Contact
                            </h2>

                            <p className="text-gray-600 mb-4">
                                Pentru întrebări despre această politică de confidențialitate sau pentru a-ți exercita drepturile GDPR,
                                ne poți contacta la:
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@example.com<br />
                                    <strong>Telefon:</strong> +40 XXX XXX XXX<br />
                                    <strong>Adresă:</strong> Strada Exemplu, Nr. 1, București, România
                                </p>
                            </div>
                        </section>

                        {/* Modificări */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Modificări ale politicii
                            </h2>

                            <p className="text-gray-600">
                                Ne rezervăm dreptul de a actualiza această politică de confidențialitate.
                                Orice modificări vor fi publicate pe această pagină cu data actualizării.
                                Te încurajăm să consulți periodic această pagină pentru a fi la curent cu modificările.
                            </p>
                        </section>
                            </div>
                        </div>
                    </div>
                </main>
                {footerSection && (
                    <div id={footerSection.id} style={footerStyles}>
                        <Footer sectionId={footerSection.id} />
                    </div>
                )}
            </>
        </App>
    );
};

export default PrivacyPolicyPage;
