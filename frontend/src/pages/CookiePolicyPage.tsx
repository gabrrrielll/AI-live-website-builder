import React from 'react';
import { SEO } from '../components/SEO';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { Cookie, Settings, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const CookiePolicyPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <>
                <SEO
                    title="Politica de Cookie-uri"
                    description="Informații despre cookie-urile folosite pe site-ul nostru"
                    url="/cookie-policy"
                />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                        <p className="mt-4 text-gray-600">Se încarcă pagina...</p>
                    </div>
                </div>
            </>
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
        <>
            <SEO
                title="Politica de Cookie-uri"
                description="Informații despre cookie-urile folosite pe site-ul nostru"
                url="/cookie-policy"
            />

            <App>
                <>
                    {headerSection && <Header sectionId={headerSection.id} />}
                    <main className="bg-gray-50 min-h-screen">
                        {/* Breadcrumb */}
                        <div className="container mx-auto px-6 py-4">
                            <nav className="flex items-center space-x-2 text-sm text-gray-600">
                                <Link to="/" className="flex items-center hover:text-[#c29a47] transition-colors">
                                    <Home size={16} className="mr-1" />
                                    Acasă
                                </Link>
                                <ChevronRight size={16} />
                                <span className="text-gray-800 font-medium">Politica de Cookie-uri</span>
                            </nav>
                        </div>

                        <div className="container mx-auto px-6 py-12">
                            {/* Header */}
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                    <Cookie className="w-8 h-8 text-[#c29a47]" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    Politica de Cookie-uri
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Informații despre cookie-urile pe care le folosim și cum le puteți gestiona.
                                </p>
                                <div className="mt-6 text-sm text-gray-500">
                                    Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="max-w-4xl mx-auto">
                                {/* What are cookies */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Info className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Ce sunt cookie-urile?
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Cookie-urile sunt fișiere text mici care sunt stocate pe dispozitivul dumneavoastră
                                        atunci când vizitați un site web. Ele permit site-ului să-și amintească acțiunile
                                        și preferințele dumneavoastră pe o perioadă de timp.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        Cookie-urile ne ajută să vă oferim o experiență mai bună și mai personalizată
                                        atunci când utilizați serviciile noastre.
                                    </p>
                                </div>

                                {/* Types of cookies */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Tipuri de cookie-uri pe care le folosim
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="border-l-4 border-[#c29a47] pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie-uri esențiale</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Acestea sunt necesare pentru funcționarea de bază a site-ului și nu pot fi dezactivate.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Cookie-uri de sesiune pentru navigare</li>
                                                <li>Cookie-uri de securitate</li>
                                                <li>Cookie-uri pentru preferințe de limbă</li>
                                                <li>Cookie-uri pentru gestionarea formularelor</li>
                                            </ul>
                                        </div>
                                        <div className="border-l-4 border-blue-500 pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie-uri de performanță</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Acestea ne ajută să înțelegem cum interacționați cu site-ul nostru.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Cookie-uri de analiză și statistici</li>
                                                <li>Cookie-uri pentru monitorizarea performanței</li>
                                                <li>Cookie-uri pentru optimizarea încărcării</li>
                                            </ul>
                                        </div>
                                        <div className="border-l-4 border-green-500 pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie-uri funcționale</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Acestea îmbunătățesc funcționalitatea site-ului și experiența utilizatorului.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Cookie-uri pentru preferințe de utilizator</li>
                                                <li>Cookie-uri pentru personalizarea interfeței</li>
                                                <li>Cookie-uri pentru setările editorului</li>
                                            </ul>
                                        </div>
                                        <div className="border-l-4 border-purple-500 pl-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie-uri de marketing</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Acestea sunt folosite pentru a vă afișa conținut relevant și personalizat.
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                <li>Cookie-uri pentru publicitate țintită</li>
                                                <li>Cookie-uri pentru rețelele sociale</li>
                                                <li>Cookie-uri pentru tracking-ul conversiilor</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookie management */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Settings className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Gestionarea cookie-urilor
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed">
                                            Puteți controla și gestiona cookie-urile în mai multe moduri:
                                        </p>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Setările browser-ului</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Majoritatea browserelor vă permit să:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Vedeți ce cookie-uri aveți și să le ștergeți individual</li>
                                                <li>Blocați cookie-urile de la anumite site-uri</li>
                                                <li>Blocați cookie-urile de la terți</li>
                                                <li>Blocați toate cookie-urile</li>
                                                <li>Ștergeți toate cookie-urile când închideți browserul</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Setările noastre</h3>
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Puteți gestiona preferințele cookie-urilor folosind:
                                            </p>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <Link
                                                    to="/cookie-settings"
                                                    className="inline-flex items-center px-4 py-2 bg-[#c29a47] text-white rounded-lg hover:bg-[#a67c00] transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Gestionează cookie-urile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Third party cookies */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Cookie-uri de la terți
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Site-ul nostru poate conține cookie-uri de la servicii terțe pentru:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Analiză și statistici</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                                                <li>Google Analytics</li>
                                                <li>Hotjar</li>
                                                <li>Facebook Pixel</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Servicii externe</h3>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                                                <li>Google Fonts</li>
                                                <li>CDN-uri pentru resurse</li>
                                                <li>Servicii de mapare</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy and security */}
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Shield className="w-6 h-6 text-[#c29a47] mr-3" />
                                        Confidențialitate și securitate
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Ne angajăm să protejăm confidențialitatea dumneavoastră și să folosim cookie-urile
                                        în mod responsabil și transparent.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                                        <li>Cookie-urile noastre nu conțin informații personale identificabile</li>
                                        <li>Nu vindem sau partajăm informațiile colectate prin cookie-uri</li>
                                        <li>Implementăm măsuri de securitate pentru a proteja datele</li>
                                        <li>Respectăm regulamentul GDPR și legislația aplicabilă</li>
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div className="bg-gradient-to-r from-[#c29a47] to-[#a67c00] rounded-lg p-8 text-white">
                                    <h2 className="text-2xl font-semibold mb-4">Întrebări despre cookie-uri?</h2>
                                    <p className="mb-6">
                                        Dacă aveți întrebări despre politica noastră de cookie-uri, ne puteți contacta la:
                                    </p>
                                    <div className="space-y-2">
                                        <p><strong>Email:</strong> privacy@yourdomain.com</p>
                                        <p><strong>Telefon:</strong> +40 XXX XXX XXX</p>
                                        <p><strong>Adresă:</strong> Strada Exemplu, Nr. 1, București, România</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    {footerSection && (
                        <div style={footerStyles}>
                            <Footer sectionId={footerSection.id} />
                        </div>
                    )}
                </>
            </App>
        </>
    );
};

export default CookiePolicyPage;


