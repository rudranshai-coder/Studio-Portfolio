import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lightbulb, Wand2, Sliders, CheckCircle2 } from 'lucide-react';
import { ProcessStep } from '../types';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';

interface CreativeProcessProps {
  steps: ProcessStep[];
}

export const CreativeProcess: React.FC<CreativeProcessProps> = ({ steps }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Lightbulb className="w-5 h-5 text-[#F3E8CB]" />;
      case 1:
        return <Wand2 className="w-5 h-5 text-[#38BDF8]" />;
      case 2:
        return <Sliders className="w-5 h-5 text-[#FF6A00]" />;
      case 3:
        return <CheckCircle2 className="w-5 h-5 text-[#10B981]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#FF6A00]" />;
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Connecting line draw animation with scrub
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0.2 },
          {
            scaleX: 1,
            opacity: 1,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              end: 'center 50%',
              scrub: 0.5,
            },
          }
        );
      }

      // Process step cards entrance
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 40, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.16,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [steps]);

  return (
    <motion.section
      ref={sectionRef}
      id="process"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 md:py-36 px-6 md:px-10 bg-gradient-to-b from-[#080B18]/90 via-[#1E0F07]/70 via-50% to-[#040C18]/85 backdrop-blur-[12px] section-glass relative overflow-hidden"
    >
      {/* Subtle atmospheric ambient glow for Creative Process */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-[#F97316]/7 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-[450px] h-[450px] rounded-full bg-[#EAB308]/6 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs text-[#FF6A00] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTION PIPELINE</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F3EE]">
            CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#F3E8CB] to-[#38BDF8]">PROCESS</span>
          </h2>

          <p className="font-['Manrope'] text-sm sm:text-base text-[#9295A0]">
            From conceptual thesis to high-fidelity commercial master delivery in four streamlined phases.
          </p>
        </div>

        {/* Process Steps Grid with connecting data line */}
        <div className="relative">
          {/* Subtle horizontal connecting line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-[2px] bg-[#121624] -translate-y-8 z-0 pointer-events-none overflow-hidden">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-r from-[#9D4EDD] via-[#FF6A00] to-[#10B981] origin-left scale-x-0 shadow-[0_0_12px_#FF6A00]"
            />
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={`process-step-${step.number || idx}-${idx}`}
                className="group relative p-7 rounded-3xl bg-[#0D0F17] border border-[#1C2030] hover:border-[#FF6A00]/50 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#121520] border border-[#23283B] flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getStepIcon(idx)}
                    </div>
                    <span className="font-['IBM_Plex_Mono'] text-sm font-bold text-[#FF6A00] bg-[#FF6A00]/10 px-2.5 py-1 rounded-md border border-[#FF6A00]/20">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE] group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  
                  <div className="font-['IBM_Plex_Mono'] text-[11px] text-[#93C5FD] tracking-wider uppercase mt-1 mb-3">
                    {step.subtitle}
                  </div>

                  <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#161926] flex items-center justify-between text-[10px] font-['IBM_Plex_Mono'] text-[#636878]">
                  <span>PHASE 0{idx + 1}</span>
                  <span className="text-[#FF6A00]">● ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
};

