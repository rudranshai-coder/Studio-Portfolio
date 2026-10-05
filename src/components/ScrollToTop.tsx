import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 320,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      setIsVisible(scrollY > threshold);

      if (docHeight > 0) {
        const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Radial progress calculations (stroke-dasharray / stroke-dashoffset)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed bottom-6 right-6 z-40 flex items-center ${className}`}
        >
          <button
            id="global-scroll-to-top"
            onClick={handleScrollToTop}
            aria-label="Scroll smoothly to top of page"
            title="Scroll to Top"
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#080B14]/90 hover:bg-[#121624] backdrop-blur-md border border-[#1E2538] hover:border-[#FF6A00]/70 text-[#9295A0] hover:text-[#F5F3EE] shadow-[0_8px_32px_rgba(0,0,0,0.65)] hover:shadow-[0_0_24px_rgba(255,106,0,0.35)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] cursor-pointer"
          >
            {/* SVG Circular Scroll Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[2px]"
              viewBox="0 0 44 44"
              aria-hidden="true"
            >
              {/* Background ring track */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="text-[#141A28] stroke-current"
                strokeWidth="2"
                fill="none"
              />
              {/* Animated active progress indicator */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="text-[#FF6A00] stroke-current transition-[stroke-dashoffset] duration-150"
                strokeWidth="2.2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Arrow Up Icon with hover animation */}
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 group-hover:-translate-y-0.5 text-[#F5F3EE] group-hover:text-[#FF6A00]" />

            {/* Floating Tooltip Label on Hover (Desktop) */}
            <span
              role="tooltip"
              className="absolute right-full mr-3 px-2.5 py-1 rounded-md bg-[#080A12] border border-[#23293D] text-[10px] font-['IBM_Plex_Mono'] font-medium text-[#F5F3EE] uppercase tracking-wider whitespace-nowrap opacity-0 pointer-events-none -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-xl hidden sm:block"
            >
              TOP
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
