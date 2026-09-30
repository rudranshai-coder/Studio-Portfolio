import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Clock, Award, Terminal, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';

interface AboutSectionProps {
  name: string;
  education: string;
  experienceSummary: string;
  onExploreWork: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  name,
  education,
  experienceSummary,
  onExploreWork,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left story column entrance
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Right pillar cards entrance
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { opacity: 0, x: 40, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.16,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 80%',
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
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 md:py-32 px-6 md:px-10 bg-gradient-to-b from-[#030C19]/90 via-[#031B1E]/70 via-50% to-[#091024]/85 backdrop-blur-[12px] section-glass relative overflow-hidden"
    >
      {/* Subtle atmospheric ambient glow for About */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-[#14B8A6]/6 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] rounded-full bg-[#3B82F6]/6 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Concise Story */}
          <div ref={storyRef} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10121A] border border-[#23283B] text-[#93C5FD] font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>BACKGROUND & FOUNDATION</span>
            </div>

            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F3EE]">
              ABOUT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EE] via-[#F3E8CB] to-[#FF6A00]">
                {name}
              </span>
            </h2>

            <p className="font-['Manrope'] text-base sm:text-lg text-[#9295A0] leading-relaxed">
              {experienceSummary}
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreWork}
                className="inline-flex items-center gap-2 text-[#FF6A00] hover:text-[#FF8533] font-['Space_Grotesk'] text-sm font-semibold tracking-wider uppercase group cursor-pointer"
              >
                <span>EXPLORE FEATURED WORKS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Key Pillars */}
          <div ref={pillarsRef} className="lg:col-span-5 space-y-4">
            {/* Education Pillar */}
            <div className="p-6 rounded-2xl bg-[#0D0F17] border border-[#1E2336] hover:border-[#38BDF8]/40 transition-colors shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#131B2E] text-[#38BDF8] border border-[#23355A]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#9295A0]">
                    ACADEMIC SPECIALIZATION
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE] mt-0.5">
                    {education}
                  </h3>
                  <p className="font-['Manrope'] text-xs text-[#9295A0] mt-1.5 leading-relaxed">
                    Formal training in computer applications fused with specialized artificial intelligence and machine learning models.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Pillar */}
            <div className="p-6 rounded-2xl bg-[#0D0F17] border border-[#1E2336] hover:border-[#FF6A00]/40 transition-colors shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#291710] text-[#FF6A00] border border-[#52291B]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#9295A0]">
                    EXPERIENCE TIMELINE
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE] mt-0.5">
                    6 Months Active AI Synthesis
                  </h3>
                  <p className="font-['Manrope'] text-xs text-[#9295A0] mt-1.5 leading-relaxed">
                    Dedicated commercial production across high-fashion visuals, product commercials, viral UGC hooks, and campaign narratives.
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Philosophy */}
            <div className="p-6 rounded-2xl bg-[#0D0F17] border border-[#1E2336] hover:border-[#9D4EDD]/40 transition-colors shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#23132E] text-[#9D4EDD] border border-[#482061]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#9295A0]">
                    QUALITY STANDARD
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE] mt-0.5">
                    High-Fidelity Realism
                  </h3>
                  <p className="font-['Manrope'] text-xs text-[#9295A0] mt-1.5 leading-relaxed">
                    Zero generic output. Multi-pass refinement, tailored color grading, and optical depth fidelity.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};

