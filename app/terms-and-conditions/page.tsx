"use client";

import { useSite } from '@/context/SiteContext';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import App from '@/App';
import { resolveBackgroundImage } from '@/utils/styleUtils';
import { ChevronRight, Home, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
    const { siteConfig, getImageUrl } = useSite();

    if (!siteConfig) {
        return <div>Loading...</div>;
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
                                Termeni și Condiții
                            </span>
                        </nav>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Termeni și Condiții
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
                                        Vă rugăm să citiți acești termeni și condiții cu atenție înainte de a utiliza serviciul nostru.
                                        Prin accesarea sau utilizarea serviciului nostru, sunteți de acord să fiți legați de acești termeni.
                                    </p>
                                </section>

                                {/* Definiții */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Definiții
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Serviciul</h3>
                                            <p className="text-gray-600 text-sm">
                                                Se referă la platforma noastră web și toate serviciile asociate oferite prin intermediul acesteia.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Utilizator</h3>
                                            <p className="text-gray-600 text-sm">
                                                Orice persoană care accesează sau utilizează serviciul nostru.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Conținut</h3>
                                            <p className="text-gray-600 text-sm">
                                                Toate informațiile, datele, textele, imaginile și alte materiale disponibile prin serviciul nostru.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Acceptarea termenilor */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Acceptarea Termenilor
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Prin utilizarea serviciului nostru, confirmați că:
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                        <li>Ați citit și înțeles acești termeni și condiții</li>
                                        <li>Sunteți de acord să respectați toate prevederile acestora</li>
                                        <li>Aveți capacitatea legală de a încheia acest acord</li>
                                        <li>Utilizarea serviciului este în conformitate cu legislația aplicabilă</li>
                                    </ul>
                                </section>

                                {/* Utilizarea serviciului */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Utilizarea Serviciului
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Utilizare Permisă</h3>
                                            <p className="text-gray-600 text-sm">
                                                Serviciul nostru poate fi utilizat doar în scopuri legale și în conformitate cu acești termeni.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Utilizare Interzisă</h3>
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                                                <li>Violarea oricăror legi sau reglementări aplicabile</li>
                                                <li>Transmiterea de conținut ilegal, dăunător sau ofensator</li>
                                                <li>Încercarea de a compromite securitatea serviciului</li>
                                                <li>Utilizarea serviciului pentru activități comerciale neautorizate</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Proprietatea intelectuală */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Proprietatea Intelectuală
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Toate drepturile de proprietate intelectuală asupra serviciului nostru și conținutului acestuia 
                                        aparțin în exclusivitate companiei noastre sau licențiatorilor noștri.
                                    </p>
                                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                        <p className="text-yellow-800 text-sm">
                                            <strong>Notă:</strong> Nu aveți dreptul de a reproduce, distribui sau modifica conținutul 
                                            serviciului nostru fără autorizația noastră scrisă.
                                        </p>
                                    </div>
                                </section>

                                {/* Limitarea responsabilității */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Limitarea Responsabilității
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Serviciul nostru este oferit "așa cum este" și "așa cum este disponibil". 
                                        Nu garantăm că serviciul va fi neîntrerupt sau lipsit de erori.
                                    </p>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-red-800 text-sm">
                                            <strong>Excluderea responsabilității:</strong> Nu ne asumăm responsabilitatea pentru 
                                            daunele directe, indirecte, incidentale sau consecvențiale rezultate din utilizarea serviciului nostru.
                                        </p>
                                    </div>
                                </section>

                                {/* Modificări */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Modificări ale Termenilor
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Ne rezervăm dreptul de a modifica acești termeni și condiții în orice moment. 
                                        Modificările vor intra în vigoare imediat după publicarea versiunii actualizate pe site-ul nostru. 
                                        Utilizarea continuă a serviciului după modificări constituie acceptarea noilor termeni.
                                    </p>
                                </section>

                                {/* Legea aplicabilă */}
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Legea Aplicabilă
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Acești termeni și condiții sunt guvernați de și interpretați în conformitate cu 
                                        legislația României. Orice dispută va fi soluționată de instanțele competente din România.
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
}
