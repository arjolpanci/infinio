'use client'

import React, { useState, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiArrowRight, FiCheckCircle, FiStar, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

// A. TYPE DEFINITIONS
// =================================================================

interface Section {
    title: string;
    content: ReactNode;
}

interface AnimatedSectionProps {
    index: number;
    totalSections: number;
    progress: MotionValue<number>;
    children: ReactNode;
}

interface FinalSectionProps {
    progress: MotionValue<number>;
    totalSections: number;
    children: ReactNode;
}

interface FloatingHeaderProps {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    sections: Section[];
}

interface AnimatedBackgroundProps {
    progress: MotionValue<number>;
}


// B. CORE LAYOUT & ANIMATION LOGIC
// =================================================================

const AnimatedSection = ({ index, totalSections, progress, children }: AnimatedSectionProps) => {
    const start = index / totalSections;
    const end = (index + 1) / totalSections;
    
    const peakStart = start + 0.1;
    const peakEnd = end - 0.1;

    const opacity = useTransform(progress, [start, peakStart, peakEnd, end], [0, 1, 1, 0]);
    const scale = useTransform(progress, [start, peakStart, peakEnd, end], [0.92, 1, 1, 0.92]);
    const y = useTransform(progress, [start, end], ["40px", "-40px"]);
    const pointerEvents = useTransform(progress, [start, peakStart, peakEnd, end], ["none", "auto", "auto", "none"]);

    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity, scale, y, pointerEvents }}
        >
            <div className="w-full max-w-6xl mx-auto px-8 text-center">
                {children}
            </div>
        </motion.div>
    );
};

const FinalSection = ({ progress, totalSections, children }: FinalSectionProps) => {
    const start = (totalSections - 1) / totalSections;
    
    const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
    const scale = useTransform(progress, [start, start + 0.1], [0.95, 1]);
    const y = useTransform(progress, [start, start + 0.1], ["40px", "0px"]);
    const pointerEvents = useTransform(progress, [start, start + 0.1], ["none", "auto"]);

    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity, scale, y, pointerEvents }}
        >
            <div className="w-full max-w-5xl mx-auto px-8 text-center">
                {children}
            </div>
        </motion.div>
    );
}

// C. UI & CONTENT COMPONENTS
// =================================================================

const HeroSection = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white relative">
            <div className="text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center justify-center mb-8"
                >
                    <Image 
                        src="/logo.svg" 
                        alt="MARKEDIA Logo" 
                        width={120} 
                        height={120}
                        className="object-contain"
                    />
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                    className="text-7xl md:text-8xl font-black text-black tracking-tighter"
                >
                    MARKEDIA
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                    className="text-xl md:text-2xl text-gray-600 mt-4 max-w-2xl mx-auto"
                >
                    Digital Marketing Excellence
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 flex flex-col items-center justify-center"
            >
                <span className="text-gray-500 mb-2">Scroll to begin</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FiArrowDown className="text-2xl text-red-500" />
                </motion.div>
            </motion.div>
        </div>
    );
};

const FloatingHeader = ({ scrollRef, sections }: FloatingHeaderProps) => {
    const scrollToSection = (index: number) => {
        if (!scrollRef.current) return;
        const heroHeight = window.innerHeight;
        const targetProgress = (index + 0.5) / sections.length;
        const targetScroll = heroHeight + (targetProgress * (scrollRef.current.scrollHeight - window.innerHeight));
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Image 
                        src="/logo.svg" 
                        alt="MARKEDIA" 
                        width={32} 
                        height={32}
                        className="object-contain"
                    />
                    <span className="text-xl font-bold tracking-wider text-black">
                        MARKEDIA
                    </span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    {sections.slice(0, -1).map((section, index) => (
                        <motion.button
                            key={section.title}
                            onClick={() => scrollToSection(index)}
                            className="font-medium text-black transition-opacity"
                            style={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                        >
                            {section.title}
                        </motion.button>
                    ))}
                </nav>
                <motion.button
                    onClick={() => scrollToSection(sections.length - 1)}
                    whileHover={{ scale: 1.05, backgroundColor: "#cf0000" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hidden md:block shadow-lg"
                >
                    Get Started
                </motion.button>
            </div>
        </header>
    );
};

const AnimatedBackground = ({ progress }: AnimatedBackgroundProps) => {
    const backgroundColor = useTransform(
      progress,
      [0, 0.25, 0.5, 0.75, 1],
      ["#ffffff", "#f8f9fa", "#e9ecef", "#343a40", "#212529"]
    );

    const auroraOpacity = useTransform(progress, [0.4, 0.6], [0, 0.8]);

    return (
        <>
            <motion.div className="fixed inset-0 z-[-2]" style={{ backgroundColor }} />
            <motion.div 
                className="fixed inset-0 z-[-1] overflow-hidden"
                style={{ opacity: auroraOpacity }}
            >
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-red-500 rounded-full opacity-30 filter blur-3xl animate-[spin_20s_linear_infinite]" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#cf0000] rounded-full opacity-30 filter blur-3xl animate-[spin_25s_linear_infinite_reverse]" />
            </motion.div>
        </>
    );
};

// PRICING COMPONENT
// =================================================================
const pricingData = [
    {
        category: 'Social Media',
        plans: [
            { name: 'Starter', price: '€249', term: '/ month', features: ['6 posts per month (mix of static, carousels, and reels)', '3 stories per week', 'Caption writing & hashtag research', 'Community engagement'] },
            { name: 'Growth', price: '€349', term: '/ month', features: ['8 posts per month (mix of static, carousels, and reels)', '5 stories per week', 'Competitor research', 'Business recommendations', 'Monthly insights with action points'], popular: true },
            { name: 'Pro', price: '€449', term: '/ month', features: ['12 posts per month (mix of static, carousels, and reels)', '8 stories per week', 'Paid ads campaign setup & management (FB / IG / TikTok)', 'Advanced growth strategy (campaign ideas and support for launch)'] },
        ]
    },
    {
        category: 'Branding',
        plans: [
            { name: 'Starter', price: '€590', term: 'one-time', features: ['Logo + color palette + typography', 'Business card design', 'Social media templates', 'Basic brand guidelines'] },
            { name: 'Growth', price: '€890', term: 'one-time', features: ['All Starter features', 'Audience analysis & competitor breakdown', 'Website mockup (5+ pages concept)', 'Extended brand guidelines (voice, tone, do’s & don’ts)'], popular: true },
            { name: 'Professional', price: '€1,290', term: 'one-time', features: ['All Starter & Growth features', 'In-depth brand strategy workshop', 'Content guidelines (photography style, tone, storytelling)', 'Packaging design concepts / offline branding assets'] },
        ]
    },
    {
        category: 'Website Design',
        plans: [
            { name: 'Starter', price: 'from €190', term: '', features: ['1–3 page site (landing, about, contact)', 'Mobile responsive, SEO-friendly', 'Basic integrations'] },
            { name: 'Growth', price: 'from €590', term: '', features: ['Up to 7 pages', 'Blog setup & CMS', 'SEO structure & keyword setup', 'Contact forms, booking systems'], popular: true },
            { name: 'Pro', price: 'from €1,290', term: '', features: ['10+ pages custom design', 'eCommerce functionality (shop, payments, cart)', 'Advanced SEO setup', 'Speed optimization & security setup', '1-month post-launch support'] },
        ]
    },
    {
        category: 'Logo Design',
        plans: [
            { name: 'Basic', price: '€59.90', term: '', features: ['3 concepts + revision', 'Business card', 'Basic vector files'] },
            { name: 'Professional', price: '€190', term: '', features: ['5 logo concepts', 'Unlimited revisions', 'Full brand files (AI, EPS, PNG, JPG, SVG)', 'Mini brand guide (color codes + fonts)'], popular: true },
            { name: 'Premium', price: '€390', term: '', features: ['7+ logo concepts', 'Full brand kit (patterns, icons, social media logos)', 'Branding consultation (1 hr)'] },
        ]
    },
    {
        category: 'SEO Services',
        plans: [
            { name: 'Starter', price: '€190', term: '(one-time)', features: ['Keyword research', 'On-page optimization', 'SEO audit', 'Technical fixes (meta, titles, descriptions)', '3 unique blog posts'] },
            { name: 'Growth', price: '€290', term: '/ month', features: ['Everything in Starter', '4 optimized blog posts / month', 'Local SEO setup (Google Business profile optimization)', 'Competitor keyword tracking'], popular: true },
            { name: 'Pro', price: '€1,190', term: '/ month', features: ['Everything in Starter & Growth', 'Full technical SEO', 'Backlink outreach & guest posting', 'Content marketing strategy (blog + social synergy)', 'Monthly SEO reports & growth strategy calls'] },
        ]
    }
];

const PricingSectionContent = () => {
    const [activeTab, setActiveTab] = useState(pricingData[0].category);
    const activeCategory = pricingData.find(p => p.category === activeTab);

    return (
        <div className="w-full">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Our Service Packages
            </h2>
            <div className="flex justify-center flex-wrap gap-2 md:space-x-4 mb-10 bg-white/10 backdrop-blur-lg border border-white/10 p-2 rounded-full">
                {pricingData.map(p => (
                    <button
                        key={p.category}
                        onClick={() => setActiveTab(p.category)}
                        className={`relative text-sm md:text-base font-medium px-4 py-2 rounded-full transition-colors ${activeTab === p.category ? 'text-white' : 'text-gray-800 hover:text-white'}`}
                    >
                        {p.category}
                        {activeTab === p.category && (
                            <motion.div layoutId="underline" className="absolute inset-0 bg-red-500 rounded-full z-[-1]" />
                        )}
                    </button>
                ))}
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
                >
                    {activeCategory?.plans.map((plan) => (
                        <div 
                            key={plan.name}
                            className={`relative p-8 rounded-2xl flex flex-col ${plan.popular ? 'bg-red-500 text-white border-2 border-red-300' : 'bg-white/10 backdrop-blur-lg border border-white/10 text-gray-100'}`}
                        >
                            {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-red-500 font-bold px-4 py-1 rounded-full text-sm shadow-lg">Most Popular</div>}
                            <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                            <p className="text-4xl font-black mb-6 text-white">{plan.price}<span className="text-lg font-medium opacity-70">{plan.term}</span></p>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map(feat => <li key={feat} className="flex items-start"><FiCheckCircle className="mr-3 mt-1 text-white flex-shrink-0" /> {feat}</li>)}
                            </ul>
                            <button className={`w-full mt-auto py-3 rounded-lg font-bold transition-transform transform hover:scale-105 ${plan.popular ? 'bg-white text-red-500' : 'bg-red-500 text-white'}`}>Choose Plan</button>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


// D. PAGE DEFINITION
// =================================================================

export default function FreshScrollPage() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const sections: Section[] = [
        {
            title: "Welcome",
            content: (
                <>
                    <motion.h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter mb-4">
                        Digital Excellence.
                    </motion.h1>
                    <motion.p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                        We don&apos;t just build websites. We build digital experiences that drive growth, engagement, and results.
                    </motion.p>
                </>
            ),
        },
        {
            title: "About",
            content: (
                <>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-700 mb-8">
                        We Are <span className="text-red-500">MARKEDIA</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="bg-white/90 p-6 rounded-xl border border-red-100 shadow-lg">
                            <FiTrendingUp className="text-3xl text-red-500 mb-3" />
                            <h3 className="text-xl font-bold text-black mb-2">Data-Driven</h3>
                            <p className="text-gray-600">Every decision is backed by data to ensure maximum impact and ROI for your business.</p>
                        </div>
                        <div className="bg-white/90 p-6 rounded-xl border border-red-100 shadow-lg">
                            <FiStar className="text-3xl text-red-500 mb-3" />
                            <h3 className="text-xl font-bold text-black mb-2">Creative Innovation</h3>
                            <p className="text-gray-600">Our team blends artistic vision with technical expertise to create unforgettable brands.</p>
                        </div>
                        <div className="bg-white/90 p-6 rounded-xl border border-red-100 shadow-lg">
                            <FiCheckCircle className="text-3xl text-red-500 mb-3" />
                            <h3 className="text-xl font-bold text-black mb-2">Proven Results</h3>
                            <p className="text-gray-600">We have a track record of delivering measurable success for clients of all sizes.</p>
                        </div>
                    </div>
                </>
            ),
        },
        {
            title: "Pricing",
            content: <PricingSectionContent />,
        },
        {
            title: "Contact",
            content: (
                 <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-2xl">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Ready to Grow?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                        Let&apos;s build something amazing together. Reach out and let us know how we can help you achieve your goals.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:bg-red-500 hover:text-white transition-colors"
                    >
                        Schedule a Free Consultation <FiArrowRight className="inline ml-2" />
                    </motion.button>
                </div>
            ),
        },
    ];

    const { scrollYProgress } = useScroll({ 
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    return (
        <>
            <HeroSection />
            <FloatingHeader scrollRef={scrollRef} sections={sections} />
            <AnimatedBackground progress={scrollYProgress} />
            
            <div ref={scrollRef} className="relative z-10" style={{ height: `${sections.length * 100}vh` }}>
                <div className="sticky top-0 h-screen overflow-hidden">
                    {sections.map((section, index) => (
                        index === sections.length - 1 ? (
                            <FinalSection key={section.title} progress={scrollYProgress} totalSections={sections.length}>
                                {section.content}
                            </FinalSection>
                        ) : (
                            <AnimatedSection key={section.title} index={index} totalSections={sections.length} progress={scrollYProgress}>
                                {section.content}
                            </AnimatedSection>
                        )
                    ))}
                </div>
            </div>
        </>
    );
}