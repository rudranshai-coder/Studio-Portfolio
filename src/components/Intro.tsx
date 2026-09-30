import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, Cpu } from 'lucide-react';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';

interface IntroProps {
  introTitle: string;
  experienceSummary: string;
}

export const Intro: React.FC<IntroProps> = ({ experienceSummary }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Main editorial statement entrance
      if (statementRef.current) {
        gsap.fromTo(
          statementRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Metric & Signal cards entrance
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, x: 30, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="about-intro"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-20 md:py-32 px-6 md:px-10 bg-gradient-to-b from-[#020A14]/90 via-[#0F0B1A]/70 via-50% to-[#040D1B]/80 backdrop-blur-[12px] section-glass overflow-hidden"
    >
      {/* Subtle atmospheric ambient glow for Intro */}
      <div className="absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full bg-[#FF6A00]/6 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-28 right-0 w-[450px] h-[450px] rounded-full bg-[#9D4EDD]/7 blur-[150px] pointer-events-none" />

      {/* Subtle background ambient line */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Main Statement */}
          <div className="lg:col-span-8">
            <div ref={statementRef} className="space-y-6">
              <div className="flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-[0.2em] text-[#FF6A00]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EDITORIAL PHILOSOPHY</span>
              </div>

              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F3EE] leading-[1.08]">
                I CREATE VISUALS THAT MAKE{' '}
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#F3E8CB] to-[#93C5FD]">
                  BRANDS STAND OUT.
                </span>
              </h2>

              <p className="font-['Manrope'] text-base md:text-lg text-[#9295A0] leading-[1.7] max-w-2xl">
                {experienceSummary}
              </p>
            </div>
          </div>

          {/* Editorial Metric / Signal Cards */}
          <div className="lg:col-span-4">
            <div ref={cardsRef} className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#0D0F17] border border-[#1C2030] hover:border-[#FF6A00]/40 transition-colors group shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] tracking-wider uppercase">
                    PRACTICAL FOCUS
                  </span>
                  <Layers className="w-4 h-4 text-[#FF6A00]" />
                </div>
                <div className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE] mb-1">
                  6 Core Visual Domains
                </div>
                <p className="font-['Manrope'] text-xs text-[#9295A0] leading-relaxed">
                  Fashion, Product, UGC, Ad Campaigns, AI Motion Videos, and High-Retention Social Media.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D0F17] border border-[#1C2030] hover:border-[#38BDF8]/40 transition-colors group shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9295A0] tracking-wider uppercase">
                    SYNTHESIS PIPELINE
                  </span>
                  <Cpu className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE] mb-1">
                  Precision AI Workflows
                </div>
                <p className="font-['Manrope'] text-xs text-[#9295A0] leading-relaxed">
                  Iterative prompt architectures, LoRA tuning, and 8K neural upscaling for commercial-grade output.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};

