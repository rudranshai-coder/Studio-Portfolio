import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { HeroCanvas } from './HeroCanvas';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';
import { CategoryInfo } from '../types';

interface HeroProps {
  name: string;
  heroIdentity: string; // "AI CONTENT CREATOR" (shown ONLY once)
  heroHeading: string;
  heroDescription: string;
  profileImageUrl: string;
  categories?: CategoryInfo[];
  onSelectCategory?: (category: CategoryInfo) => void;
  onExploreClick: () => void;
  onCollaborateClick: () => void;
  onEditPhotoClick: () => void;
}

// Distinct vibrant palette customized for each of the 8 portfolio creative areas
const categoryPalettes: Record<string, { color: string; border: string; bg: string; dot: string }> = {
  '01': { color: '#D8B4FE', border: 'rgba(192, 132, 252, 0.35)', bg: 'rgba(192, 132, 252, 0.08)', dot: '#C084FC' }, // 01 FASHION VISUALS - Plum/Violet
  '02': { color: '#FDA4AF', border: 'rgba(251, 113, 133, 0.35)', bg: 'rgba(251, 113, 133, 0.08)', dot: '#FB7185' }, // 02 FASHION ADS - Rose/Crimson
  '03': { color: '#FDE68A', border: 'rgba(251, 191, 36, 0.35)', bg: 'rgba(251, 191, 36, 0.08)', dot: '#FBBF24' }, // 03 JEWELLERY AD CAMPAIGNS - Amber Gold
  '04': { color: '#7DD3FC', border: 'rgba(56, 189, 248, 0.35)', bg: 'rgba(56, 189, 248, 0.08)', dot: '#38BDF8' }, // 04 PRODUCT VISUALS - Sky Blue
  '05': { color: '#67E8F9', border: 'rgba(34, 211, 238, 0.35)', bg: 'rgba(34, 211, 238, 0.08)', dot: '#22D3EE' }, // 05 PRODUCT ADS - Neon Cyan
  '06': { color: '#FDBA74', border: 'rgba(251, 146, 60, 0.35)', bg: 'rgba(251, 146, 60, 0.08)', dot: '#FB923C' }, // 06 UGC & SOCIAL ADS - Tangerine Orange
  '07': { color: '#C4B5FD', border: 'rgba(167, 139, 250, 0.35)', bg: 'rgba(167, 139, 250, 0.08)', dot: '#A78BFA' }, // 07 AI STORYWORLDS - Celestial Violet
  '08': { color: '#6EE7B7', border: 'rgba(52, 211, 153, 0.35)', bg: 'rgba(52, 211, 153, 0.08)', dot: '#34D399' }, // 08 BRAND AD CAMPAIGNS - Emerald Green
};

const defaultEightCategories = [
  { id: 'fashion-visuals', number: '01', title: 'FASHION VISUALS' },
  { id: 'fashion-ads', number: '02', title: 'FASHION ADS' },
  { id: 'jewellery-ads', number: '03', title: 'JEWELLERY AD CAMPAIGNS' },
  { id: 'product-visuals', number: '04', title: 'PRODUCT VISUALS' },
  { id: 'product-ads', number: '05', title: 'PRODUCT ADS' },
  { id: 'ugc', number: '06', title: 'UGC & SOCIAL ADS' },
  { id: 'videos', number: '07', title: 'AI STORYWORLDS' },
  { id: 'campaigns', number: '08', title: 'BRAND AD CAMPAIGNS' },
];

export const Hero: React.FC<HeroProps> = ({
  name,
  heroIdentity,
  heroDescription,
  profileImageUrl,
  categories,
  onSelectCategory,
  onExploreClick,
  onCollaborateClick,
  onEditPhotoClick,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const avatarWrapperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  const isCustomPhoto =
    profileImageUrl &&
    profileImageUrl.trim() !== '' &&
    !profileImageUrl.includes('PASTE_PROFILE_IMAGE_URL_HERE') &&
    profileImageUrl.startsWith('http');

  // GSAP Parallax on Scroll
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll effect on profile avatar
      if (avatarWrapperRef.current) {
        gsap.to(avatarWrapperRef.current, {
          y: 50,
          scale: 0.97,
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      if (textContentRef.current) {
        gsap.to(textContentRef.current, {
          y: 35,
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={heroRef}
      id="hero"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-gradient-to-b from-[#000E1C]/90 via-[#001326]/75 via-40% to-[#020A14]/80 backdrop-blur-[12px] section-glass"
    >
      {/* Ambient Grid overlay across hero with matching cool-tinted mask */}
      <div
        className="absolute inset-0 z-[1] opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      {/* Atmospheric color grade backlights extending through the entire 1st section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full opacity-20 pointer-events-none blur-[140px] z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, rgba(14, 36, 58, 0.45) 55%, transparent 80%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
        className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[850px] h-[480px] rounded-full opacity-25 pointer-events-none blur-[120px] z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 36, 60, 0.65) 0%, rgba(56, 189, 248, 0.09) 40%, transparent 75%)',
        }}
      />

      {/* 1. Whole First Interface Photo Section Display: starting from just below HOME/ABOUT navbar down to just above CREATING VISUAL WORLDS */}
      <div
        ref={avatarWrapperRef}
        className="relative z-10 w-full pt-14 sm:pt-16 md:pt-[70px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Profile Poster Artwork - Cleanly spread touching both sides, starting from just below HOME / ABOUT */}
        <div
          onClick={onEditPhotoClick}
          className="relative z-10 w-full flex items-center justify-center px-0 cursor-pointer group"
          title="Click to change or replace photo URL"
        >
          {isCustomPhoto ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative w-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden px-2 sm:px-4 md:px-6"
            >
              <img
                src={profileImageUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[84vh] object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.005] rounded-xl sm:rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Floating Edit Photo Quick Action - revealed on hover */}
              <div className="absolute top-4 right-4 sm:right-8 px-3.5 py-1.5 rounded-full bg-[#010B16]/80 hover:bg-[#06182B] backdrop-blur-md border border-[#0E243A]/60 opacity-0 group-hover:opacity-100 text-[#F5F3EE] hover:text-[#38BDF8] text-[11px] font-['IBM_Plex_Mono'] uppercase tracking-wider transition-all shadow-xl flex items-center gap-1.5 pointer-events-auto z-[3]">
                <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Edit Photo</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-full max-w-4xl aspect-[16/10] max-h-[480px] bg-[#020B16]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#0E243A] group-hover:border-[#38BDF8]/50 transition-colors rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#081829] flex items-center justify-center text-[#9295A0] group-hover:text-[#38BDF8] mb-3 transition-colors">
                <User className="w-6 h-6" />
              </div>
              <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider text-[#9295A0] group-hover:text-[#F5F3EE] transition-colors">
                ADD PROFILE PHOTO
              </span>
              <span className="font-['Manrope'] text-[11px] text-[#636878] mt-1">
                Click to paste direct image link
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Editorial Typography & Content - Placed JUST below where the profile image ends */}
      <div
        ref={textContentRef}
        className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-10 pt-4 sm:pt-6 md:pt-8 pb-16 md:pb-24 flex flex-col items-center text-center"
      >
        {/* Main Hero Headline with tight line-height and typographic contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25 }}
          className="font-['Space_Grotesk'] text-4xl sm:text-5xl md:text-7xl lg:text-[84px] font-extrabold tracking-[-0.03em] leading-[1.04] text-[#F5F3EE] max-w-5xl mb-6"
        >
          CREATING{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EE] via-[#F3E8CB] to-[#E6C79C] italic font-normal pr-1">
            VISUAL WORLDS
          </span>
          <br className="hidden sm:inline" />
          {' '}FOR{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#93C5FD] via-[#38BDF8] to-[#9D4EDD]">
            MODERN BRANDS
            <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent" />
          </span>
        </motion.h1>
        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-['Manrope'] text-base sm:text-lg md:text-[19px] text-[#9295A0] max-w-2xl leading-[1.65] mb-10 font-normal"
        >
          {heroDescription}
        </motion.p>

        {/* CTA Buttons: EXPLORE NOW (Electric Cyan matching profile aura) + LET'S COLLABORATE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          {/* Primary Electric Cyan CTA echoing the image lighting */}
          <button
            id="hero-explore-now-button"
            onClick={onExploreClick}
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#00F0FF] hover:bg-[#38BDF8] text-[#010810] font-['Space_Grotesk'] text-base font-bold tracking-wide shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:shadow-[0_0_50px_rgba(0,240,255,0.75)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>EXPLORE NOW</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-[#010810]" />
          </button>

          {/* Secondary Collaborate CTA */}
          <button
            id="hero-collaborate-button"
            onClick={onCollaborateClick}
            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#061424]/80 hover:bg-[#0c223a] border border-[#13304e] hover:border-[#38BDF8]/50 text-[#F5F3EE] hover:text-[#38BDF8] font-['Space_Grotesk'] text-base font-semibold tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>LET&apos;S COLLABORATE</span>
          </button>
        </motion.div>

        {/* Micro Category Pills bar underneath - All 8 Portfolio Categories with sequential numbering and distinctive color representations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-14 pt-8 border-t border-[#0C1E34] w-full max-w-5xl flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[#9295A0] font-['IBM_Plex_Mono'] text-[10.5px] sm:text-[11px] tracking-wider uppercase"
        >
          {(categories && categories.length > 0
            ? [...categories].sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10))
            : defaultEightCategories
          ).map((item, idx) => {
            const num = item.number;
            const style = categoryPalettes[num] || {
              color: '#F5F3EE',
              border: 'rgba(255,255,255,0.15)',
              bg: 'rgba(255,255,255,0.04)',
              dot: '#00FF87',
            };

            return (
              <button
                key={`hero-cat-${item.id || num}-${idx}`}
                type="button"
                onClick={() => {
                  if (onSelectCategory && 'headline' in item) {
                    onSelectCategory(item as CategoryInfo);
                  } else {
                    onExploreClick();
                  }
                }}
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-sm active:translate-y-0"
                style={{
                  backgroundColor: style.bg,
                  border: `1px solid ${style.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = style.dot;
                  e.currentTarget.style.boxShadow = `0 0 16px ${style.dot}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = style.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title={`Explore ${num} ${item.title}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: style.dot,
                    boxShadow: `0 0 6px ${style.dot}`,
                  }}
                />
                <span className="font-bold tracking-widest text-[#F5F3EE]">
                  {num}
                </span>
                <span
                  className="font-semibold tracking-wider transition-colors"
                  style={{ color: style.color }}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Seamless bottom transition into the rest of the portfolio */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#010810] pointer-events-none z-[5]" />
    </motion.section>
  );
};
