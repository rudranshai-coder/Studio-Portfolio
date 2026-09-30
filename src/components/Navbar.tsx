import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';
import { SoundToggle } from './SoundToggle';

interface NavbarProps {
  name: string;
  onOpenCms: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  name,
  onOpenCms,
  onNavigate,
  activeSection = 'hero',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger progress indicator
  useEffect(() => {
    if (!progressBarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const navItems = [
    { label: 'HOME', id: 'hero' },
    { label: 'ABOUT', id: 'about' },
    { label: 'WORK', id: 'work' },
    { label: 'SERVICES', id: 'services' },
    { label: 'PROCESS', id: 'process' },
    { label: 'CONTACT', id: 'contact' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000811]/90 backdrop-blur-md border-b border-[#0E243A]/80 py-3.5 shadow-2xl shadow-black/60'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      {/* GSAP Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#121520] overflow-hidden pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-[#FF6A00] via-[#00FF87] to-[#38BDF8] origin-left scale-x-0 shadow-[0_0_8px_#00FF87]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Name */}
        <button
          id="nav-brand-logo"
          onClick={() => handleItemClick('hero')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00] group-hover:scale-125 transition-transform" />
          <span className="font-['Space_Grotesk'] text-lg md:text-xl font-bold tracking-wider text-[#F5F3EE] group-hover:text-white transition-colors">
            {name}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-['IBM_Plex_Mono'] text-[12px] tracking-[0.16em] uppercase">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`relative py-1 transition-colors ${
                  isActive ? 'text-[#F5F3EE] font-medium' : 'text-[#9295A0] hover:text-[#F5F3EE]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF6A00]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Controls */}
        <div className="hidden md:flex items-center gap-3">
          <SoundToggle />

          <button
            id="nav-quick-edit-button"
            onClick={onOpenCms}
            title="Custom Config & URL Manager"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10121A] hover:bg-[#1A1E2B] border border-[#232738] hover:border-[#38405C] text-[#9295A0] hover:text-[#F5F3EE] text-[11px] font-['IBM_Plex_Mono'] transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Config URLs</span>
          </button>

          <button
            id="nav-start-project-cta"
            onClick={() => handleItemClick('contact')}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6A00] hover:bg-[#FF8533] text-white font-['Space_Grotesk'] text-[13px] font-semibold tracking-wide shadow-[0_0_20px_rgba(255,106,0,0.35)] hover:shadow-[0_0_28px_rgba(255,106,0,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <SoundToggle compact />

          <button
            id="nav-mobile-edit-button"
            onClick={onOpenCms}
            aria-label="Open Config Manager"
            className="p-2 rounded-lg bg-[#10121A] border border-[#232738] text-[#9295A0]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF6A00]" />
          </button>

          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg bg-[#10121A] border border-[#232738] text-[#F5F3EE] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#0E243A] bg-[#000811] px-6 py-6"
          >
            <div className="flex flex-col gap-4 font-['IBM_Plex_Mono'] text-sm tracking-wider">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="flex items-center justify-between py-2 text-left text-[#9295A0] hover:text-[#F5F3EE] border-b border-[#151822]"
                >
                  <span>{item.label}</span>
                  <span className="text-[#FF6A00] text-xs">→</span>
                </button>
              ))}

              {/* Mobile Ambient Audio Control Row */}
              <div className="pt-2 pb-2 flex items-center justify-between border-b border-[#151822]">
                <span className="text-[12px] text-[#7B8092] tracking-wider uppercase font-['IBM_Plex_Mono']">
                  AMBIENT SOUNDSCAPE
                </span>
                <SoundToggle />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    handleItemClick('contact');
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF6A00] text-white text-center font-['Space_Grotesk'] font-semibold tracking-wider text-sm shadow-[0_0_15px_rgba(255,106,0,0.3)]"
                >
                  START A PROJECT →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
