import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Sparkles,
  Sparkle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CategoryInfo, ProjectItem } from '../types';
import { ProjectCard } from './ProjectCard';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';

interface CreativeAreasProps {
  categories: CategoryInfo[];
  projects: ProjectItem[];
  onSelectCategory: (category: CategoryInfo) => void;
  onSelectProject: (project: ProjectItem) => void;
}

// Category Slider with Left/Right arrows and horizontal swipe/scroll
interface CategorySliderRowProps {
  cat: CategoryInfo;
  projects: ProjectItem[];
  onSelectCategory: (category: CategoryInfo) => void;
  onSelectProject: (project: ProjectItem) => void;
}

const CategorySliderRow: React.FC<CategorySliderRowProps> = ({
  cat,
  projects,
  onSelectCategory,
  onSelectProject,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // GSAP ScrollTrigger animation for this category row
  useEffect(() => {
    if (!rowRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rowRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (scrollRef.current) {
        gsap.fromTo(
          scrollRef.current.children,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rowRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, rowRef);

    return () => ctx.revert();
  }, [projects]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [projects]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderCategoryIcon = (iconType: CategoryInfo['iconType']) => {
    switch (iconType) {
      case 'arrow-right':
        return <ArrowRight className="w-3.5 h-3.5" />;
      case 'arrow-up-right':
        return <ArrowUpRight className="w-3.5 h-3.5" />;
      case 'play':
        return <Play className="w-3 h-3 fill-current" />;
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      ref={rowRef}
      id={`category-${cat.id}`}
      className="relative pt-12 border-t border-[#151926] first:border-t-0"
    >
      {/* Category Header Row */}
      <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-8 relative z-10">
        {/* Left: Category Number & Title */}
        <div className="lg:col-span-8 space-y-2.5">
          <div className="flex items-center gap-3">
            <span
              className="font-['IBM_Plex_Mono'] text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-md bg-[#10131E] border border-[#202538]"
              style={{ color: cat.secondaryColor }}
            >
              {cat.number}
            </span>
            <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#9295A0]">
              {cat.personality.tag}
            </span>
          </div>

          <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F3EE] tracking-tight">
            {cat.title}
          </h3>

          <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0] max-w-2xl leading-relaxed">
            {cat.description}
          </p>
        </div>

        {/* Right: Slide Controls & Explore Button */}
        <div className="lg:col-span-4 flex flex-wrap items-center lg:justify-end gap-3">
          {/* Slide Arrow Navigation Buttons */}
          <div className="flex items-center gap-2 bg-[#0E111A] border border-[#1E2333] rounded-full p-1 shadow-inner">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Slide left"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'text-white hover:bg-[#1D2335] active:scale-95 cursor-pointer'
                  : 'text-[#474B5B] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#787D8E] uppercase tracking-wider px-1">
              Slide
            </span>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Slide right"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'text-white hover:bg-[#1D2335] active:scale-95 cursor-pointer'
                  : 'text-[#474B5B] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Explore Collection Button */}
          <button
            id={`explore-category-${cat.id}-btn`}
            onClick={() => onSelectCategory(cat)}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full font-['Space_Grotesk'] text-xs font-bold tracking-wider uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            style={{
              backgroundColor: cat.buttonColor,
              color: cat.buttonTextColor,
              boxShadow: `0 0 16px ${cat.glowColor}`,
            }}
          >
            <span>EXPLORE</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {renderCategoryIcon(cat.iconType)}
            </span>
          </button>
        </div>
      </div>

      {/* Horizontal Sliding Carousel Rail */}
      <div className="relative -mx-6 md:-mx-10 px-6 md:px-10">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {projects.map((project, pIdx) => (
            <div key={`slider-proj-${cat.id}-${project.id}-${pIdx}`} className="snap-start shrink-0">
              <ProjectCard
                project={project}
                categoryInfo={cat}
                onSelect={onSelectProject}
                index={pIdx}
                isCompact={true}
              />
            </div>
          ))}

          {/* End-of-Row Action Card: Explore Full Collection / Add More */}
          <div className="snap-start shrink-0">
            <div
              onClick={() => onSelectCategory(cat)}
              className="group w-[200px] sm:w-[230px] h-full min-h-[380px] rounded-2xl border border-dashed border-[#1F2538] hover:border-[#384260] bg-[#0A0C13]/60 hover:bg-[#0E111B] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-300"
                style={{
                  backgroundColor: cat.buttonColor,
                  color: cat.buttonTextColor,
                }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <h5 className="font-['Space_Grotesk'] text-sm font-bold text-[#F5F3EE] mb-1">
                View All {projects.length} Works
              </h5>
              <p className="font-['Manrope'] text-[11px] text-[#9295A0] leading-relaxed">
                Open full {cat.title.toLowerCase()} gallery & filter projects
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1 font-['IBM_Plex_Mono'] text-[10px] uppercase font-semibold tracking-wider"
                style={{ color: cat.secondaryColor }}
              >
                <span>Browse Category</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CreativeAreas: React.FC<CreativeAreasProps> = ({
  categories,
  projects,
  onSelectCategory,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || 'fashion-visuals');
  const mainHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainHeaderRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainHeaderRef.current!.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mainHeaderRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, mainHeaderRef);

    return () => ctx.revert();
  }, []);

  const scrollToCategory = (catId: string) => {
    setActiveTab(catId);
    const el = document.getElementById(`category-${catId}`);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      id="work"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="py-20 md:py-32 px-6 md:px-10 bg-gradient-to-b from-[#040D1B]/90 via-[#07172F]/70 via-50% to-[#030C19]/85 backdrop-blur-[12px] section-glass relative overflow-hidden"
    >
      {/* Subtle atmospheric ambient glow for Creative Areas */}
      <div className="absolute top-20 right-0 w-[550px] h-[550px] rounded-full bg-[#2563EB]/7 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[480px] h-[480px] rounded-full bg-[#00F0FF]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header */}
        <div ref={mainHeaderRef} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10121A] border border-[#23283B] text-[#FF6A00] font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest mb-4">
            <Sparkle className="w-3 h-3" />
            <span>PORTFOLIO DOMAINS</span>
          </div>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F3EE] mb-4 leading-tight">
            CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#F3E8CB] to-[#38BDF8]">AREAS</span>
          </h2>

          <p className="font-['Manrope'] text-sm sm:text-base text-[#9295A0] leading-relaxed">
            Curated featured works across specialized AI visual disciplines. Slide horizontally through individual domains or tap any project to explore details.
          </p>

          {/* Quick Category Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat, idx) => {
              const isStoryworlds = cat.id === 'videos';
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={`nav-cat-${cat.id}-${idx}`}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-['Space_Grotesk'] text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? isStoryworlds
                        ? 'bg-gradient-to-r from-[#8B5CF6]/30 via-[#F472B6]/25 to-[#FBBF24]/30 border-[#C084FC]/60 text-white shadow-[0_0_16px_rgba(192,132,252,0.35)]'
                        : 'bg-[#151926] border-[#384260] text-white shadow-md'
                      : isStoryworlds
                      ? 'bg-[#120E1E]/90 border-[#8B5CF6]/40 text-[#D8B4FE] hover:border-[#FBBF24]/60 hover:text-white shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                      : 'bg-[#0B0D15]/80 border-[#1B2030] text-[#868A9A] hover:text-[#F5F3EE] hover:border-[#2A3148]'
                  }`}
                >
                  <span className="opacity-60 mr-1.5 font-mono text-[10px]">{cat.number}</span>
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories with Horizontal Slide Rails */}
        <div className="space-y-20">
          {categories.map((cat, idx) => {
            const catProjects = projects
              .filter((p) => (p.category === cat.id || (cat.id === 'fashion-visuals' && p.category === 'fashion') || (cat.id === 'product-visuals' && p.category === 'product')) && p.visible)
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

            return (
              <CategorySliderRow
                key={`row-cat-${cat.id}-${idx}`}
                cat={cat}
                projects={catProjects}
                onSelectCategory={onSelectCategory}
                onSelectProject={onSelectProject}
              />
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
