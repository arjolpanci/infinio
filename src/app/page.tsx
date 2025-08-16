'use client'

import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { FiArrowDown, FiArrowRight, FiCheckCircle, FiStar, FiTrendingUp } from 'react-icons/fi';

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

// FIX: Updated the type for scrollRef to correctly handle the ref from useRef(null).
interface FloatingHeaderProps {
    scrollRef: React.RefObject<HTMLDivElement>;
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

    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity, scale, y }}
        >
            <div className="w-full max-w-5xl mx-auto px-8 text-center">
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

    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity, scale, y }}
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
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] relative">
            <div className="text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center justify-center space-x-4 mb-4"
                >
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl transform rotate-45"></div>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                    className="text-7xl md:text-8xl font-black text-slate-800 tracking-tighter"
                >
                    INFINIO
                </motion.h1>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 flex flex-col items-center justify-center"
            >
                <span className="text-slate-500 mb-2">Scroll to begin</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FiArrowDown className="text-2xl text-slate-500" />
                </motion.div>
            </motion.div>
        </div>
    );
};

const FloatingHeader = ({ scrollRef, sections }: FloatingHeaderProps) => {
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    const headerOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);
    const headerY = useTransform(scrollYProgress, [0, 0.02], ["-100%", "0%"]);
    const headerTextColor = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        ["#0F172A", "#1E293B", "#E2E8F0", "#F8FAFC", "#F8FAFC", "#F8FAFC"]
    );
  
    const scrollToSection = (index: number) => {
        if (!scrollRef.current) return;
        const heroHeight = window.innerHeight;
        const targetProgress = (index + 0.5) / sections.length;
        const targetScroll = heroHeight + (targetProgress * (scrollRef.current.scrollHeight - window.innerHeight));
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 bg-slate-100/5 backdrop-blur-lg border-b border-white/10"
            style={{ opacity: headerOpacity, y: headerY }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg transform rotate-45"></div>
                    <motion.span className="text-xl font-bold tracking-wider" style={{ color: headerTextColor }}>
                        INFINIO
                    </motion.span>
                </motion.div>
                <nav className="hidden md:flex items-center space-x-8">
                    {sections.slice(0, -1).map((section, index) => (
                        <motion.button
                            key={section.title}
                            onClick={() => scrollToSection(index)}
                            className="font-medium transition-opacity"
                            style={{ color: headerTextColor, opacity: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {section.title}
                        </motion.button>
                    ))}
                </nav>
                <motion.button
                    onClick={() => scrollToSection(sections.length - 1)}
                    whileHover={{ scale: 1.05, backgroundColor: "#38bdf8" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hidden md:block shadow-lg"
                >
                    Get Started
                </motion.button>
            </div>
        </motion.header>
    );
};

const AnimatedBackground = ({ progress }: AnimatedBackgroundProps) => {
    const backgroundColor = useTransform(
      progress,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      ["#f8fafc", "#e0e7ff", "#a5b4fc", "#4338ca", "#312e81", "#111827"]
    );
    return <motion.div className="fixed inset-0 z-[-1]" style={{ backgroundColor }} />;
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
                    <motion.h1 className="text-6xl md:text-8xl font-black text-slate-800 tracking-tighter mb-4">
                        Digital Excellence.
                    </motion.h1>
                    <motion.p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
                        We don&apos;t just build websites. We build digital experiences that drive growth, engagement, and results.
                    </motion.p>
                </>
            ),
        },
        {
            title: "About",
            content: (
                <>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-700 mb-8">
                        We Are <span className="text-blue-500">INFINIO</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="bg-white/50 p-6 rounded-xl border border-white/50 shadow-md">
                            <FiTrendingUp className="text-3xl text-blue-500 mb-3" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Data-Driven</h3>
                            <p className="text-slate-600">Every decision is backed by data to ensure maximum impact and ROI for your business.</p>
                        </div>
                        <div className="bg-white/50 p-6 rounded-xl border border-white/50 shadow-md">
                            <FiStar className="text-3xl text-blue-500 mb-3" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Creative Innovation</h3>
                            <p className="text-slate-600">Our team blends artistic vision with technical expertise to create unforgettable brands.</p>
                        </div>
                        <div className="bg-white/50 p-6 rounded-xl border border-white/50 shadow-md">
                            <FiCheckCircle className="text-3xl text-blue-500 mb-3" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Proven Results</h3>
                            <p className="text-slate-600">We have a track record of delivering measurable success for clients of all sizes.</p>
                        </div>
                    </div>
                </>
            ),
        },
        {
            title: "Pricing",
            content: (() => {
                const plans = [
                    { name: 'Starter', price: '$99', features: ['Core SEO', '5 Social Posts', 'Basic Analytics'] },
                    { name: 'Professional', price: '$249', features: ['Advanced SEO', '15 Social Posts', 'PPC Campaigns', 'Monthly Strategy Call'], popular: true },
                    { name: 'Enterprise', price: '$499', features: ['Full Suite SEO/PPC', 'Unlimited Posts', 'Dedicated Manager', '24/7 Support'] }
                ];
                return (
                    <>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                            Plans & Pricing
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            {plans.map((plan, i) => (
                                <motion.div 
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`relative p-8 rounded-2xl ${plan.popular ? 'bg-blue-500 text-white' : 'bg-slate-800/50 text-slate-300'}`}
                                >
                                    {plan.popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white text-blue-500 font-bold px-4 py-1 rounded-full text-sm">Most Popular</div>}
                                    <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                                    <p className="text-4xl font-black mb-6 text-white">{plan.price}<span className="text-lg font-medium opacity-70">/mo</span></p>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map(feat => <li key={feat} className="flex items-center"><FiCheckCircle className="mr-3 text-green-400" /> {feat}</li>)}
                                    </ul>
                                    <button className={`w-full py-3 rounded-lg font-bold ${plan.popular ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'}`}>Choose Plan</button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                );
            })(),
        },
        {
            title: "Contact",
            content: (
                <>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Ready to Grow?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
                        Let&apos;s build something amazing together. Reach out and let us know how we can help you achieve your goals.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-slate-900 font-bold px-10 py-4 rounded-full text-lg shadow-2xl"
                    >
                        Schedule a Free Consultation <FiArrowRight className="inline ml-2" />
                    </motion.button>
                </>
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