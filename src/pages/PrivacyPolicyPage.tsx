import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ArrowLeft, Shield, Eye, Database, Users, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <PageWrapper
                title="Politica de Confidențialitate"
                description="Politica de confidențialitate și protecția datelor personale"
                url="/privacy-policy"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c29a47]"></div>
                        <p className="mt-4 text-gray-600">Se încarcă pagina...</p>
                    </div>
                </div>
            </PageWrapper>
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
        <PageWrapper
            title="Politica de Confidențialitate"
            description="Politica de confidențialitate și protecția datelor personale"
            url="/privacy-policy"
        >
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
                            <span className="text-gray-800 font-medium">Politica de Confidențialitate</span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-6 py-12">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                <Shield className="w-8 h-8 text-[#c29a47]" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Politica de Confidențialitate
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Protejăm datele dumneavoastră personale și vă explicăm cum le folosim în conformitate cu GDPR.
                            </p>
                            <div className="mt-6 text-sm text-gray-500">
                                Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="max-w-4xl mx-auto">
                            {/* Introduction */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Eye className="w-6 h-6 text-[#c29a47] mr-3" />
                                    Introducere
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Această Politică de Confidențialitate descrie modul în care colectăm, folosim,
                                    protejăm și dezvăluim informațiile dumneavoastră atunci când utilizați serviciile noastre.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Respectăm drepturile dumneavoastră la confidențialitate și ne angajăm să protejăm
                                    datele dumneavoastră personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR).
                                </p>
                            </div>

                            {/* Data Collection */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Database className="w-6 h-6 text-[#c29a47] mr-3" />
                                    Datele pe care le colectăm
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Date de identificare</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Nume și prenume</li>
                                            <li>Adresa de email</li>
                                            <li>Număr de telefon (opțional)</li>
                                            <li>Adresa IP</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Date de utilizare</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Informații despre dispozitiv și browser</li>
                                            <li>Activități pe site (pagini vizitate, timpul petrecut)</li>
                                            <li>Preferințe și setări</li>
                                            <li>Conținut creat și editat</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Data Usage */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Users className="w-6 h-6 text-[#c29a47] mr-3" />
                                    Cum folosim datele dumneavoastră
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Servicii esențiale</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Furnizarea serviciilor noastre</li>
                                            <li>Personalizarea experienței utilizatorului</li>
                                            <li>Suport tehnic și comunicare</li>
                                            <li>Îmbunătățirea serviciilor</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Comunicare</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Răspunsuri la întrebări</li>
                                            <li>Notificări importante</li>
                                            <li>Actualizări despre servicii</li>
                                            <li>Newsletter (doar cu consimțământ)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Data Protection */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Lock className="w-6 h-6 text-[#c29a47] mr-3" />
                                    Protecția datelor
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        Implementăm măsuri de securitate tehnice și organizaționale pentru a proteja
                                        datele dumneavoastră împotriva accesului neautorizat, modificării, divulgării sau distrugerii.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>Criptare SSL/TLS pentru toate transmisiile</li>
                                        <li>Acces restricționat la date</li>
                                        <li>Monitorizare continuă a securității</li>
                                        <li>Backup-uri regulate și sigure</li>
                                        <li>Formare regulată a personalului</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Your Rights */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Drepturile dumneavoastră
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Acces și portabilitate</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Dreptul de acces la datele dumneavoastră</li>
                                            <li>Dreptul de a primi o copie a datelor</li>
                                            <li>Dreptul de portabilitate a datelor</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Control și ștergere</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Dreptul de rectificare</li>
                                            <li>Dreptul de ștergere ("dreptul de a fi uitat")</li>
                                            <li>Dreptul de restricționare</li>
                                            <li>Dreptul de opoziție</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="bg-gradient-to-r from-[#c29a47] to-[#a67c00] rounded-lg p-8 text-white">
                                <h2 className="text-2xl font-semibold mb-4">Contactați-ne</h2>
                                <p className="mb-6">
                                    Pentru întrebări despre această politică de confidențialitate sau pentru a exercita
                                    drepturile dumneavoastră, ne puteți contacta la:
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
        </PageWrapper>
    );
};

export default PrivacyPolicyPage;


