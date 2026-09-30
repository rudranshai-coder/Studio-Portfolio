/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Continuous GSAP ScrollTrigger-Driven Cinematic Journey Component
 * Sequence: AI Core → AI Generation → Fashion → Product → Jewellery → Projects → Campaigns → Contact
 * 
 * Features:
 * - Scroll-scrubbed GSAP master timelines
 * - Seamless stage morphing & depth movement (zero hard cuts)
 * - Pinned layered depth orchestration
 * - Performance optimized requestAnimationFrame canvas renderer
 * - Responsive behavior & reduced-motion support
 * - Interactive cinematic HUD with direct stage scrubbing
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';
import {
  CinematicRenderer,
  CinematicState,
  STAGE_NAMES,
  STAGE_DESCRIPTIONS,
  STAGE_COLORS,
} from '../utils/cinematicEngine';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  Compass,
  Cpu,
  Layers,
  Sparkle,
  Box,
  Gem,
  FolderGit2,
  Radio,
  Send,
  Eye,
} from 'lucide-react';

interface CinematicScrollJourneyProps {
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
  isBackgroundMode?: boolean;
}

export const CinematicScrollJourney: React.FC<CinematicScrollJourneyProps> = ({
  onNavigateSection,
  className = '',
  isBackgroundMode = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<CinematicRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Cinematic state driven by GSAP ScrollTrigger timeline
  const cinematicStateRef = useRef<CinematicState>({
    progress: 0,
    stageIndex: 0,
    stageProgress: 0,
    blendFactor: 0,
    cameraZ: 0,
    cameraRotX: 0,
    cameraRotY: 0,
    lightIntensity: 1,
    chromaticAberration: 0,
    particleDensity: 1,
    morphFactor: 0,
    glowRadius: 100,
    time: 0,
  });

  const [activeStage, setActiveStage] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [isFullscreenTheater, setIsFullscreenTheater] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showHUD, setShowHUD] = useState(true);

  // Map stage to stage icons
  const stageIcons = [
    Cpu,        // 0: AI Core
    Layers,     // 1: AI Generation
    Sparkle,    // 2: Fashion
    Box,        // 3: Product
    Gem,        // 4: Jewellery
    FolderGit2, // 5: Projects
    Radio,      // 6: Campaigns
    Send,       // 7: Contact
  ];

  // Stage mapping to main page anchors
  const stageAnchorMap: Record<number, string> = {
    0: 'hero',
    1: 'about',
    2: 'work',
    3: 'work',
    4: 'work',
    5: 'work',
    6: 'services',
    7: 'contact',
  };

  // Jump to specific cinematic stage
  const handleStageJump = useCallback(
    (index: number) => {
      const targetAnchor = stageAnchorMap[index];
      if (targetAnchor && onNavigateSection) {
        onNavigateSection(targetAnchor);
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = (index / 7) * totalHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [onNavigateSection]
  );

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize Canvas Renderer & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      rendererRef.current = new CinematicRenderer(canvas);
    } catch (e) {
      console.error('Failed to initialize CinematicRenderer:', e);
      return;
    }

    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Update simulation internal time
      const speed = prefersReducedMotion ? 0.3 : 1.0;
      cinematicStateRef.current.time += delta * speed;

      // Render current frame with continuous interpolated parameters
      if (rendererRef.current) {
        rendererRef.current.render(cinematicStateRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  // GSAP ScrollTrigger Master Timeline Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scrub scroll trigger across the entire document
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: prefersReducedMotion ? false : 1.2, // Smooth inertia scrub
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          const rawStage = p * 7;
          const stageIdx = Math.min(Math.floor(rawStage), 7);
          const stageProg = rawStage - stageIdx;
          
          // Continuous smooth cosine blend factor between stages
          const smoothBlend = 0.5 - 0.5 * Math.cos(stageProg * Math.PI);

          cinematicStateRef.current.progress = p;
          cinematicStateRef.current.stageIndex = stageIdx;
          cinematicStateRef.current.stageProgress = stageProg;
          cinematicStateRef.current.blendFactor = smoothBlend;
          cinematicStateRef.current.cameraZ = Math.sin(p * Math.PI * 7) * 0.8;
          cinematicStateRef.current.morphFactor = stageProg;

          setActiveStage(stageIdx);
          setActiveProgress(p);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const CurrentIcon = stageIcons[activeStage] || Cpu;
  const currentStageColor = STAGE_COLORS[activeStage] || STAGE_COLORS[0];

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none transition-all duration-700 ${
        isFullscreenTheater
          ? 'fixed inset-0 z-50 pointer-events-auto bg-[#000811]'
          : isBackgroundMode
          ? 'fixed inset-0 -z-10 overflow-hidden'
          : 'relative w-full h-[600px] overflow-hidden'
      } ${className}`}
    >
      {/* 1. Cinematic GPU Accelerated Canvas Surface */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block absolute inset-0"
        style={{
          filter: isFullscreenTheater
            ? 'none'
            : 'brightness(0.95) contrast(1.05)',
        }}
      />

      {/* 2. Soft Ambient Film Grain & Atmospheric Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000811_95%)] pointer-events-none opacity-85" />

      {/* 3. Interactive Floating Cinematic HUD (Stage Navigation & Phase Telemetry) */}
      <div
        className={`pointer-events-auto absolute z-20 transition-all duration-500 ${
          isFullscreenTheater
            ? 'bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4'
            : 'bottom-6 left-6 hidden lg:flex flex-col gap-2.5'
        }`}
      >
        {showHUD && (
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#090C15]/90 backdrop-blur-xl border border-[#23283B] shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            {/* Stage Indicator Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#101422] border border-[#2B334B]">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentStageColor.primary }}
              />
              <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider text-[#A0AEC0] font-medium">
                Stage 0{activeStage + 1}
              </span>
              <span className="text-[#4A5568]">•</span>
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#F7FAFC]">
                {STAGE_NAMES[activeStage]}
              </span>
            </div>

            {/* Continuous Stage Scrub Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {STAGE_NAMES.map((name, idx) => {
                const Icon = stageIcons[idx];
                const isActive = idx === activeStage;
                const isPassed = idx < activeStage;
                return (
                  <button
                    key={`stage-scrub-${name}-${idx}`}
                    onClick={() => handleStageJump(idx)}
                    title={`${name}: ${STAGE_DESCRIPTIONS[idx]}`}
                    className={`group relative p-1.5 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
                      isActive
                        ? 'bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/40'
                        : isPassed
                        ? 'text-[#A0AEC0] hover:text-[#FFF] hover:bg-[#1A202C]'
                        : 'text-[#4A5568] hover:text-[#CBD5E0] hover:bg-[#1A202C]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap px-2.5 py-1 rounded-md bg-[#0D111A] text-[#F7FAFC] text-[10px] font-['IBM_Plex_Mono'] border border-[#2D3748] shadow-lg pointer-events-none z-30">
                      0{idx + 1}. {name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Overall Scroll Progress Bar */}
            <div className="hidden sm:flex items-center gap-2 px-2 border-l border-[#2B334B]/60">
              <div className="w-16 h-1.5 rounded-full bg-[#1A202C] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#8B5CF6] transition-all duration-150"
                  style={{ width: `${Math.round(activeProgress * 100)}%` }}
                />
              </div>
              <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#A0AEC0]">
                {Math.round(activeProgress * 100)}%
              </span>
            </div>

            {/* Fullscreen Theater Mode Toggle */}
            <button
              onClick={() => setIsFullscreenTheater((prev) => !prev)}
              className="p-1.5 rounded-lg bg-[#141A28] hover:bg-[#1F293D] text-[#CBD5E0] hover:text-white border border-[#2B334B] transition-colors"
              title={isFullscreenTheater ? 'Exit Theater Mode' : 'Enter Fullscreen Cinematic Mode'}
            >
              {isFullscreenTheater ? (
                <Minimize2 className="w-3.5 h-3.5 text-[#FF6A00]" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* 4. Fullscreen Theater Mode Header & Description Overlay */}
      {isFullscreenTheater && (
        <div className="pointer-events-auto absolute top-6 left-6 right-6 flex items-center justify-between z-30 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#090C15]/90 border border-[#23283B] text-[#FF6A00]">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#FF6A00] font-bold">
                  CINEMATIC SCROLL EXPERIENCE
                </span>
                <span className="text-[#4A5568]">•</span>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#A0AEC0]">
                  STAGE 0{activeStage + 1} OF 08
                </span>
              </div>
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">
                {STAGE_NAMES[activeStage]}
              </h2>
              <p className="text-xs text-[#A0AEC0] max-w-lg mt-0.5">
                {STAGE_DESCRIPTIONS[activeStage]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFullscreenTheater(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#090C15]/90 hover:bg-[#141A28] border border-[#23283B] text-white text-xs font-['IBM_Plex_Mono'] transition-all"
          >
            <Minimize2 className="w-4 h-4 text-[#FF6A00]" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      )}
    </div>
  );
};
