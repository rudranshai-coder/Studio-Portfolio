import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, ChevronRight } from 'lucide-react';

interface EntranceScreenProps {
  name: string;
  profileImageUrl?: string;
  onComplete?: () => void;
}

export const EntranceScreen: React.FC<EntranceScreenProps> = ({
  name,
  profileImageUrl = 'https://i.postimg.cc/3Jt4bwth/hero-section.jpg',
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('.');
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Preload profile photo immediately for instant rendering without flash
  useEffect(() => {
    if (profileImageUrl) {
      const img = new Image();
      img.src = profileImageUrl;
    }
  }, [profileImageUrl]);

  // Animated loading dots cycle ('.', '..', '...')
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 280);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    // Smooth, responsive entrance progress counter
    const startTime = performance.now();
    const duration = 1400; // 1.4 seconds for crisp, professional feel

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const rawPct = Math.min(1, elapsed / duration);
      
      // Quartic out easing for high-tech acceleration
      const easeOut = 1 - Math.pow(1 - rawPct, 3);
      const currentPct = Math.round(easeOut * 100);

      setProgress(currentPct);

      if (rawPct < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        // Trigger exit shutter sequence
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsDismissed(true);
            if (onComplete) onComplete();
          }, 650);
        }, 250);
      }
    };

    const frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      if (onComplete) onComplete();
    }, 300);
  };

  if (isDismissed) return null;

  // Dynamic system telemetry status
  const getTelemetryStatus = () => {
    if (progress < 25) return 'INITIALIZING // CORE ENGINE';
    if (progress < 55) return 'COMPILING // 3D SHADERS & MODELS';
    if (progress < 85) return 'STREAMING // FASHION & CGI REELS';
    if (progress < 100) return 'SYNCHRONIZING // ASSETS LOADED';
    return 'STATUS // SYSTEM READY';
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <div
          id="entrance-screen-container"
          className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto select-none transition-opacity duration-700 ${
            isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Top Shutter Half */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isExiting ? '-100%' : 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#000811] border-b border-[#0E243A]/70 z-10"
          />

          {/* Bottom Shutter Half */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isExiting ? '100%' : 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#000811] border-t border-[#0E243A]/70 z-10"
          />

          {/* Center Optical Flare / Laser Flash Line during exit */}
          {isExiting && (
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_0_24px_#00F0FF] z-30 pointer-events-none"
            />
          )}

          {/* Atmospheric Ambient Glow & High-Tech Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,240,255,0.12)_0%,rgba(14,36,58,0.3)_40%,transparent_75%)] pointer-events-none z-10" />
          
          <div
            className="absolute inset-0 opacity-15 pointer-events-none z-10"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Main Entrance Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.05 : 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative z-20 max-w-xl w-full px-6 flex flex-col items-center text-center"
          >
            {/* Rudransh Profile Photo with Futuristic Hologram Glow Frame */}
            {profileImageUrl && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: -6 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative mb-5 flex flex-col items-center"
              >
                {/* Holographic Glowing Cyber Pulse Halo */}
                <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-[#00F0FF] via-[#38BDF8] to-[#9D4EDD] opacity-75 blur-[14px] animate-pulse pointer-events-none" />
                
                {/* Outer Precision Circular Border */}
                <div className="relative p-1.5 rounded-full bg-gradient-to-b from-[#00F0FF] via-[#38BDF8] to-[#1E3A8A] shadow-[0_0_30px_rgba(0,240,255,0.45)]">
                  {/* Avatar Frame Container */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#000811] border-2 border-[#000811] relative">
                    <img
                      src={profileImageUrl}
                      alt={name || 'Rudransh Goyal'}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      className="w-full h-full object-cover object-top filter brightness-105 contrast-105"
                      onError={() => {
                        console.warn('Profile image failed in entrance screen');
                      }}
                    />
                    {/* High-tech subtle grid scanline overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000811]/30 pointer-events-none" />
                  </div>

                  {/* Live Status Indicator Beacon */}
                  <span
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#00F0FF] border-2 border-[#000811] shadow-[0_0_10px_#00F0FF] animate-pulse"
                    title="Active Creator Core"
                  />
                </div>
              </motion.div>
            )}

            {/* Top Micro Telemetry Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#031120]/90 border border-[#00F0FF]/35 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(0,240,255,0.22)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
              </span>
              <span className="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#00F0FF] uppercase tracking-[0.22em]">
                INITIALIZING ARCHIVE{dots}
              </span>
            </div>

            {/* Main Rudransh Portfolio Display - THE ONE AND ONLY DISPLAY */}
            <div className="space-y-2 mb-8">
              <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.02em] text-[#F5F3EE] uppercase flex flex-wrap items-center justify-center gap-x-3.5">
                <span>RUDRANSH</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#9D4EDD] shadow-sm">
                  PORTFOLIO
                </span>
              </h1>
              <p className="font-['Manrope'] text-xs sm:text-sm text-[#9295A0] tracking-[0.25em] uppercase font-medium">
                AI VISUAL DIRECTOR &bull; CINEMATIC ARCHIVE 2026
              </p>
            </div>

            {/* Futuristic Progress Bar Frame */}
            <div className="w-full max-w-md bg-[#020B16] rounded-full p-1 border border-[#0E243A] shadow-inner mb-4 relative overflow-hidden">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#9D4EDD] shadow-[0_0_14px_#00F0FF]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Progress Telemetry Readout */}
            <div className="w-full max-w-md flex items-center justify-between font-['IBM_Plex_Mono'] text-xs text-[#7B8092] px-1">
              <div className="flex items-center gap-1.5 text-[#93C5FD]">
                <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="tracking-wide text-[11px] sm:text-xs">{getTelemetryStatus()}</span>
              </div>
              <span className="font-bold text-[#00F0FF] tracking-wider text-xs sm:text-sm">
                {String(progress).padStart(2, '0')}%
              </span>
            </div>

            {/* Direct Entry Option */}
            <button
              id="entrance-skip-button"
              onClick={handleSkip}
              className="mt-8 px-5 py-2 rounded-full bg-[#031120]/75 hover:bg-[#07192C] border border-[#00F0FF]/30 hover:border-[#00F0FF] text-[#93C5FD] hover:text-[#FFF] font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 group shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]"
            >
              <span>ENTER EXPERIENCE</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#00F0FF]" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
