import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { FileText, AlertTriangle, Scale, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return (
            <PageWrapper
                title="Termeni și Condiții"
                description="Termenii și condițiile de utilizare a serviciilor noastre"
                url="/terms-and-conditions"
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
            title="Termeni și Condiții"
            description="Termenii și condițiile de utilizare a serviciilor noastre"
            url="/terms-and-conditions"
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
                            <span className="text-gray-800 font-medium">Termeni și Condiții</span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-6 py-12">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c29a47] bg-opacity-10 rounded-full mb-6">
                                <FileText className="w-8 h-8 text-[#c29a47]" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Termeni și Condiții
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Termenii și condițiile de utilizare a serviciilor noastre de construire a site-urilor web.
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
                                    <Users className="w-6 h-6 text-[#c29a47] mr-3" />
                                    1. Acceptarea Termenilor
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Prin accesarea și utilizarea serviciilor noastre, vă angajați să respectați și să fiți legați
                                    de acești Termeni și Condiții. Dacă nu sunteți de acord cu oricare dintre termeni,
                                    vă rugăm să nu utilizați serviciile noastre.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Acești termeni se aplică tuturor vizitatorilor, utilizatorilor și altor persoane care accesează
                                    sau utilizează serviciul.
                                </p>
                            </div>

                            {/* Service Description */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    2. Descrierea Serviciilor
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Serviciile noastre includ:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>Constructor de site-uri web interactiv cu editare în timp real</li>
                                    <li>Funcționalități AI pentru generarea de conținut</li>
                                    <li>Instrumente de design și personalizare</li>
                                    <li>Gestionarea și editarea de articole de blog</li>
                                    <li>Suport tehnic și documentație</li>
                                </ul>
                            </div>

                            {/* User Responsibilities */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <AlertTriangle className="w-6 h-6 text-[#c29a47] mr-3" />
                                    3. Responsabilitățile Utilizatorului
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Utilizare responsabilă</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Nu utilizați serviciul pentru activități ilegale sau neautorizate</li>
                                            <li>Nu încercați să accesați conturi sau sisteme ale altor utilizatori</li>
                                            <li>Nu distribuiți malware, virusi sau cod dăunător</li>
                                            <li>Respectați drepturile de proprietate intelectuală</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Conținut creat</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Vă asumați responsabilitatea pentru conținutul creat</li>
                                            <li>Nu creați conținut ofensator, discriminatoriu sau ilegal</li>
                                            <li>Respectați drepturile de autor ale altor persoane</li>
                                            <li>Nu încărcați imagini sau conținut protejat de copyright</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Intellectual Property */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Scale className="w-6 h-6 text-[#c29a47] mr-3" />
                                    4. Proprietatea Intelectuală
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        Serviciul nostru și conținutul original, funcționalitățile și caracteristicile sunt și rămân
                                        proprietatea noastră și a licențiatorilor noștri.
                                    </p>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Conținutul dumneavoastră</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Păstrăm toate drepturile asupra conținutului pe care îl creați folosind serviciile noastre.
                                            Nu revendicăm proprietatea asupra conținutului dumneavoastră original.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Licența de utilizare</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Vă acordăm o licență limitată, non-exclusivă, non-transferabilă pentru a utiliza
                                            serviciul nostru în conformitate cu acești termeni.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Limitation of Liability */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    5. Limitarea Răspunderii
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Serviciul nostru este furnizat "așa cum este" și "conform disponibilității".
                                    Nu garantăm că serviciul va fi neîntrerupt, sigur sau lipsit de erori.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    În niciun caz nu vom fi răspunzători pentru daune directe, indirecte, incidentale,
                                    speciale, consecutive sau punitive rezultate din utilizarea serviciului nostru.
                                </p>
                            </div>

                            {/* Changes to Terms */}
                            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    6. Modificări ale Termenilor
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Ne rezervăm dreptul de a modifica sau înlocui acești Termeni și Condiții în orice moment.
                                    Modificările vor intra în vigoare imediat ce sunt postate pe această pagină.
                                    Utilizarea continuă a serviciului după modificări constituie acceptarea noilor termeni.
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="bg-gradient-to-r from-[#c29a47] to-[#a67c00] rounded-lg p-8 text-white">
                                <h2 className="text-2xl font-semibold mb-4">Contactați-ne</h2>
                                <p className="mb-6">
                                    Pentru întrebări despre acești termeni și condiții, ne puteți contacta la:
                                </p>
                                <div className="space-y-2">
                                    <p><strong>Email:</strong> legal@yourdomain.com</p>
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

export default TermsAndConditionsPage;


