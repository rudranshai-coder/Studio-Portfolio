import React from 'react';
import { motion } from 'motion/react';

interface SectionDividerProps {
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.75 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      className={`relative w-full flex items-center justify-center pointer-events-none py-1 z-10 ${className}`}
    >
      {/* 1. Subtle wide ambient glow bloom */}
      <div className="absolute w-[320px] sm:w-[540px] md:w-[720px] h-[8px] bg-gradient-to-r from-transparent via-[#00F0FF]/15 to-transparent blur-md" />

      {/* 2. Core glowing horizontal hairline */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#38BDF8]/40 via-50% to-transparent shadow-[0_0_12px_rgba(56,189,248,0.35)]" />
      </div>

      {/* 3. Center futuristic micro-node accent */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rotate-45 bg-[#38BDF8] rounded-[1px] shadow-[0_0_8px_#38BDF8] opacity-80" />
      </div>
    </motion.div>
  );
};
