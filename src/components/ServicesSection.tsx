import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';

interface ServicesSectionProps {
  services: ServiceItem[];
  onContactClick: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onContactClick,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaBarRef = useRef<HTMLDivElement>(null);

  // Category accent palette map
  const getCategoryAccent = (cat: string) => {
    switch (cat) {
      case 'fashion':
        return { border: 'group-hover:border-[#9D4EDD]', glow: 'rgba(157, 78, 221, 0.2)', tag: '#F3E8CB' };
      case 'product':
        return { border: 'group-hover:border-[#2563EB]', glow: 'rgba(37, 99, 235, 0.2)', tag: '#93C5FD' };
      case 'ugc':
        return { border: 'group-hover:border-[#EA580C]', glow: 'rgba(234, 88, 12, 0.2)', tag: '#FEF3C7' };
      case 'campaigns':
        return { border: 'group-hover:border-[#10B981]', glow: 'rgba(16, 185, 129, 0.2)', tag: '#10B981' };
      case 'videos':
        return { border: 'group-hover:border-[#8B5CF6]', glow: 'rgba(139, 92, 246, 0.25)', tag: '#FBBF24' };
      case 'social':
        return { border: 'group-hover:border-[#F43F5E]', glow: 'rgba(244, 63, 94, 0.2)', tag: '#FB7185' };
      default:
        return { border: 'group-hover:border-[#FF6A00]', glow: 'rgba(255, 106, 0, 0.2)', tag: '#FF6A00' };
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Services cards stagger entrance
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Bottom CTA bar entrance
      if (ctaBarRef.current) {
        gsap.fromTo(
          ctaBarRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaBarRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  return (
    <motion.section
      ref={sectionRef}
      id="services"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 md:py-36 px-6 md:px-10 bg-gradient-to-b from-[#091024]/90 via-[#180A2D]/70 via-50% to-[#080B18]/85 backdrop-blur-[12px] section-glass relative overflow-hidden"
    >
      {/* Subtle atmospheric ambient glow for Services */}
      <div className="absolute top-12 right-10 w-[550px] h-[550px] rounded-full bg-[#A855F7]/7 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-16 -left-20 w-[450px] h-[450px] rounded-full bg-[#EC4899]/6 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1A1E2C]"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs text-[#FF6A00] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CAPABILITIES & PRODUCTION</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F3EE]">
              SPECIALIZED SERVICES
            </h2>
          </div>

          <p className="font-['Manrope'] text-sm sm:text-base text-[#9295A0] max-w-md leading-relaxed">
            Full-spectrum generative AI visual production tailored for high-growth brands and content creators.
          </p>
        </div>

        {/* Services Editorial Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, idx) => {
            const accent = getCategoryAccent(service.category);
            return (
              <div
                key={`service-${service.id || idx}-${idx}`}
                className={`group relative p-7 sm:p-8 rounded-3xl bg-[#0D0F17] border border-[#1C2030] ${accent.border} transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B7280]">
                      0{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#151824] flex items-center justify-center text-[#9295A0] group-hover:text-white group-hover:bg-[#FF6A00] transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#F5F3EE] group-hover:text-white transition-colors mb-3">
                    {service.title}
                  </h3>

                  <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0] leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables tags */}
                <div className="pt-4 border-t border-[#181C2A] space-y-2">
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#636878] uppercase tracking-wider block">
                    DELIVERABLES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.deliverables.map((item, dIdx) => (
                      <span
                        key={`deliverable-${service.id || idx}-${dIdx}`}
                        className="px-2.5 py-1 rounded-md bg-[#131622] text-[#B8BAC4] font-['IBM_Plex_Mono'] text-[10px] flex items-center gap-1"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-[#FF6A00]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar inside services */}
        <div
          ref={ctaBarRef}
          className="p-8 rounded-3xl bg-gradient-to-r from-[#10121A] to-[#141824] border border-[#23283B] flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h4 className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F3EE]">
              Need a custom multi-format visual package?
            </h4>
            <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0] mt-1">
              Custom campaign bundles combining stills, reels, and product staging.
            </p>
          </div>

          <button
            onClick={onContactClick}
            className="whitespace-nowrap px-6 py-3 rounded-full bg-[#FF6A00] hover:bg-[#FF8533] text-white font-['Space_Grotesk'] text-sm font-bold tracking-wider shadow-[0_0_20px_rgba(255,106,0,0.35)] transition-all cursor-pointer"
          >
            REQUEST PROPOSAL →
          </button>
        </div>

      </div>
    </motion.section>
  );
};

