import React from 'react';
import { ScrollAnimation, WaterRiseAnimation, StaggerAnimation, ParallaxAnimation } from '@/components/animations/ScrollAnimation';

export const AnimationShowcase: React.FC = () => {
    return (
        <div className="space-y-20 py-20">
            {/* Hero Section with Water Rise Effect */}
            <section className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-6">
                    <WaterRiseAnimation delay={0.2}>
                        <h1 className="text-6xl font-bold mb-6">AI-Powered Website Builder</h1>
                    </WaterRiseAnimation>
                    <WaterRiseAnimation delay={0.4}>
                        <p className="text-xl mb-8 opacity-90">Create stunning websites with advanced scroll animations</p>
                    </WaterRiseAnimation>
                    <WaterRiseAnimation delay={0.6}>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                            Get Started
                        </button>
                    </WaterRiseAnimation>
                </div>
            </section>

            {/* Services Section with Stagger Animation */}
            <section className="container mx-auto px-6">
                <ScrollAnimation direction="up" distance={60} delay={0.1}>
                    <h2 className="text-4xl font-bold text-center mb-16">Our Services</h2>
                </ScrollAnimation>

                <StaggerAnimation
                    staggerDelay={0.15}
                    delay={0.3}
                    direction="up"
                    distance={50}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { title: "Web Design", description: "Beautiful, responsive designs" },
                        { title: "Development", description: "Fast, modern applications" },
                        { title: "SEO Optimization", description: "Higher search rankings" }
                    ].map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </StaggerAnimation>
            </section>

            {/* Features Section with Different Directions */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <ScrollAnimation direction="left" distance={100} delay={0.2}>
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold text-gray-800">Advanced Features</h2>
                                <p className="text-lg text-gray-600">
                                    Our platform includes cutting-edge animations that create engaging user experiences.
                                    Elements smoothly appear as you scroll, creating a professional and modern feel.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                        Smooth scroll animations
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                        Water rise effects
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                        Staggered animations
                                    </li>
                                </ul>
                            </div>
                        </ScrollAnimation>

                        <ScrollAnimation direction="right" distance={100} delay={0.4}>
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6"></div>
                                <h3 className="text-2xl font-bold mb-4">Interactive Elements</h3>
                                <p className="text-gray-600">
                                    Every element is carefully animated to provide visual feedback and enhance user engagement.
                                </p>
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>
            </section>

            {/* Parallax Section */}
            <section className="relative h-96 overflow-hidden">
                <ParallaxAnimation speed={0.3}>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600"></div>
                </ParallaxAnimation>
                <div className="relative z-10 h-full flex items-center justify-center">
                    <ScrollAnimation direction="scale" delay={0.5}>
                        <div className="text-center text-white">
                            <h2 className="text-5xl font-bold mb-4">Parallax Effect</h2>
                            <p className="text-xl">Elements move at different speeds creating depth</p>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <ScrollAnimation direction="fade" delay={0.3}>
                        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Experience the power of modern web animations
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                            Start Building
                        </button>
                    </ScrollAnimation>
                </div>
            </section>
        </div>
    );
};
