import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowUpRight, Image as ImageIcon, Video, Sparkles, ExternalLink } from 'lucide-react';
import { ProjectItem, CategoryInfo } from '../types';

interface ProjectCardProps {
  project: ProjectItem;
  categoryInfo: CategoryInfo;
  onSelect: (project: ProjectItem) => void;
  index: number;
  isCompact?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  categoryInfo,
  onSelect,
  index,
  isCompact = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isCardMuted, setIsCardMuted] = useState(true);
  const [isManualPlaying, setIsManualPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Global Audio Event Listener: Stop double sound when another video or modal starts playing
  useEffect(() => {
    const handleAudioLock = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail && customEvent.detail.id !== project.id) {
        setIsCardMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    };

    const handleModalOpen = () => {
      setIsCardMuted(true);
      setIsManualPlaying(false);
      setIsPlayingPreview(false);
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
      }
    };

    window.addEventListener('portfolio-audio-play', handleAudioLock);
    window.addEventListener('portfolio-modal-open', handleModalOpen);
    return () => {
      window.removeEventListener('portfolio-audio-play', handleAudioLock);
      window.removeEventListener('portfolio-modal-open', handleModalOpen);
    };
  }, [project.id]);

  const hasImage =
    project.imageUrl &&
    project.imageUrl.trim() !== '' &&
    !project.imageUrl.includes('PASTE_IMAGE_URL') &&
    !imageError;

  const hasVideo =
    (project.videoUrl &&
      project.videoUrl.trim() !== '' &&
      !project.videoUrl.includes('PASTE_VIDEO_URL') &&
      !project.videoUrl.includes('PASTE_REEL_URL')) ||
    (project.reelUrl &&
      project.reelUrl.trim() !== '' &&
      !project.reelUrl.includes('PASTE_REEL_URL'));

  const videoSource = project.videoUrl || project.reelUrl;
  const totalVisualsCount = 1 + (project.additionalImages?.length || 0);

  const isVideoActive = hasVideo && (isPlayingPreview || isManualPlaying);

  const mainCoverImage =
    project.id === 'jewellery-ads-01'
      ? '/images/postimg/93b3f9a9-635f-4ea5-869c-2674821667e0.webp'
      : project.thumbnailUrl && project.thumbnailUrl.trim() !== ''
      ? project.thumbnailUrl
      : project.imageUrl;

  const handleToggleCardPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isManualPlaying || isPlayingPreview) {
      videoRef.current.pause();
      setIsManualPlaying(false);
      setIsPlayingPreview(false);
      if (!isCardMuted) {
        window.dispatchEvent(
          new CustomEvent('portfolio-audio-stop', { detail: { id: project.id } })
        );
      }
    } else {
      videoRef.current.play().catch(() => {});
      setIsManualPlaying(true);
      setIsPlayingPreview(true);
    }
  };

  const handleToggleCardSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isCardMuted;
    setIsCardMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      if (!nextMuted) {
        // Dispatch lock so other background players mute immediately
        window.dispatchEvent(
          new CustomEvent('portfolio-audio-play', { detail: { id: project.id } })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent('portfolio-audio-stop', { detail: { id: project.id } })
        );
      }
    }
  };

  const handleOpenFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(project);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className={`group relative cursor-pointer select-none ${
        isCompact ? 'w-[230px] sm:w-[260px] md:w-[275px] shrink-0' : 'w-full'
      }`}
      onClick={() => onSelect(project)}
      onMouseEnter={() => {
        // For jewellery-ads-01, keep displaying the main jewellery cover photo at rest so viewers can clearly inspect the jewellery piece; user can click play to start reel
        if (project.id !== 'jewellery-ads-01') {
          setIsPlayingPreview(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }
      }}
      onMouseLeave={() => {
        if (!isManualPlaying) {
          setIsPlayingPreview(false);
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
    >
      {/* Outer Card Container */}
      <div
        className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-[#0B0D15] border border-[#1B2030] transition-all duration-400 group-hover:border-[#384260] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] group-hover:-translate-y-1.5"
      >
        {/* Ambient background glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at 50% 10%, ${categoryInfo.glowColor} 0%, transparent 65%)`,
          }}
        />

        {/* Media Frame — Strictly vertical proportion directly with zero cropping */}
        <div className="relative w-full aspect-[9/16] overflow-hidden bg-[#05070C] z-10">
          {/* Active Video Preview (if available) */}
          {hasVideo ? (
            <div
              onClick={handleToggleCardPlay}
              className="relative w-full h-full cursor-pointer bg-[#05070C]"
            >
              {/* Main Cover Image — Prominently displayed when video is idle/paused so viewers clearly see the jewellery piece on the cover */}
              {mainCoverImage && mainCoverImage.trim() !== '' && (
                <img
                  src={mainCoverImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isVideoActive ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'
                  }`}
                />
              )}

              <video
                ref={videoRef}
                src={`${videoSource}#t=0.001`}
                muted={isCardMuted}
                loop
                playsInline
                preload="auto"
                poster={mainCoverImage && mainCoverImage.trim() !== '' ? mainCoverImage : undefined}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                  isVideoActive ? 'opacity-100 scale-105 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              />

              {/* Distinct Color Play/Pause Button on Card */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div
                  className={`pointer-events-auto flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    isVideoActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <button
                    onClick={handleToggleCardPlay}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFB800] hover:bg-[#FFC933] text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,184,0,0.7)] border-2 border-black/20 transform transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                    title={isVideoActive ? 'Click to Pause Video' : 'Click to Play Video'}
                  >
                    {isVideoActive ? (
                      <Pause className="w-6 h-6 fill-current text-black" />
                    ) : (
                      <Play className="w-6 h-6 fill-current text-black ml-0.5" />
                    )}
                  </button>
                  {!isVideoActive && (
                    <span className="font-['IBM_Plex_Mono'] text-[9px] uppercase font-bold tracking-widest text-[#FFB800] bg-black/85 px-2.5 py-0.5 rounded-full border border-[#FFB800]/40 shadow-sm">
                      {project.id === 'jewellery-ads-01' ? 'PLAY AD REEL' : 'PAUSED'}
                    </span>
                  )}
                </div>
              </div>

              {/* Sound on/off button at corner */}
              <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={handleToggleCardSound}
                  className="p-1.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105"
                  title={isCardMuted ? 'Unmute sound' : 'Mute sound'}
                >
                  {isCardMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-[#FF6B6B]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#00FF87]" />
                  )}
                </button>

                <button
                  onClick={handleOpenFullscreen}
                  className="p-1.5 rounded-full bg-black/80 hover:bg-[#FFB800] hover:text-black text-white border border-white/20 hover:border-[#FFB800] backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105"
                  title="View Full Reel (Know More)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : hasImage ? (
            <img
              src={project.thumbnailUrl || project.imageUrl}
              alt={project.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            // Placeholder when no media exists or URL is unset
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#0B0D14] border border-dashed border-[#1E2333] group-hover:border-[#333C57] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#151926] flex items-center justify-center text-[#9295A0] mb-2">
                {hasVideo ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              </div>
              <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold tracking-wider text-[#9295A0] uppercase">
                {hasVideo ? 'ADD REEL' : 'ADD VISUAL'}
              </span>
            </div>
          )}

          {/* Top Badges Row (Left side) */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 pointer-events-none">
            {/* Category / Discipline Pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-['IBM_Plex_Mono'] uppercase tracking-wider font-semibold backdrop-blur-md bg-black/75 border border-white/10 text-[#F5F3EE] shadow-md">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: categoryInfo.primaryColor }}
              />
              {project.badgeLabel
                ? project.badgeLabel
                : project.id === 'product-01'
                ? 'Crystal Glass'
                : project.id === 'product-02'
                ? 'Kinetic Sole'
                : project.id === 'jewellery-ads-01'
                ? 'Royal Emerald'
                : project.id === 'jewellery-ads-02'
                ? 'Blue Sapphire'
                : project.id === 'jewellery-ads-03'
                ? 'Emerald Sovereign'
                : project.id === 'fashion-03'
                ? 'Streetwear'
                : project.id === 'fashion-04'
                ? 'Botanical Saree'
                : project.id === 'fashion-05'
                ? 'Crimson Mandala'
                : project.id === 'fashion-ads-01'
                ? 'Lotus Silk Saree'
                : project.id === 'fashion-ads-02'
                ? 'Designer Kurti'
                : project.id === 'fashion-ads-03'
                ? 'Resortwear Reel'
                : project.id === 'fashion-ads-04'
                ? 'Festive Lehenga'
                : project.id === 'ugc-01'
                ? 'Khatushyam Modeling'
                : project.id === 'ugc-02'
                ? 'Glamolic AI'
                : project.id === 'campaign-01'
                ? 'OVERLAYS Apparel'
                : project.id === 'campaign-02'
                ? 'Limestone Watch'
                : project.id === 'video-01'
                ? 'Narasimha • Part 1 Storyboard'
                : project.id === 'video-02'
                ? 'Narasimha • Part 2 Motion'
                : project.id === 'video-03'
                ? 'Minecraft • Part 1 Storyboard'
                : project.id === 'video-04'
                ? 'Minecraft • Part 2 Motion'
                : project.category === 'videos'
                ? 'AI Storyworld'
                : project.category === 'fashion-ads'
                ? 'Fashion Ad'
                : categoryInfo.personality.keywords[0]}
            </span>

            {/* Video Indicator or Multi-Visual Count Badge */}
            {hasVideo ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white font-['IBM_Plex_Mono'] text-[9px] uppercase tracking-wider shadow-md">
                <Play className="w-2.5 h-2.5 text-[#FFB800] fill-[#FFB800]" />
                <span>Motion</span>
              </span>
            ) : totalVisualsCount > 1 ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white font-['IBM_Plex_Mono'] text-[9px] font-semibold uppercase tracking-wider shadow-md">
                <ImageIcon className="w-2.5 h-2.5 text-[#00FF87]" />
                <span>{totalVisualsCount} Visuals</span>
              </span>
            ) : null}
          </div>

          {/* Bottom Tap / Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 z-20 pointer-events-none">
            <div className="w-full flex items-center justify-between pointer-events-auto">
              <span className="font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-wider font-semibold text-[#F5F3EE] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Know More</span>
              </span>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                style={{ backgroundColor: categoryInfo.buttonColor }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Card Metadata / Brief Footer — Compact, Clean & Easily Legible */}
        <div className="p-3.5 bg-[#0B0D15] flex flex-col justify-between flex-1 z-10 border-t border-[#161B28]">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span
                className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider font-semibold truncate"
                style={{ color: categoryInfo.secondaryColor }}
              >
                {project.clientOrBrand || categoryInfo.title}
              </span>
              {project.externalUrl && (
                <span className="text-[#9295A0] hover:text-white" title="External link">
                  <ExternalLink className="w-3 h-3" />
                </span>
              )}
            </div>

            <h4 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-[#F5F3EE] group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {project.title}
            </h4>

            {/* Brief only shown if not a pure ad card (for fashion ads, description is revealed in detail modal on 'Know More') */}
            {project.category !== 'fashion-ads' && (
              <p className="font-['Manrope'] text-[11px] sm:text-xs text-[#9295A0] line-clamp-2 mt-1.5 leading-relaxed">
                {project.shortDescription}
              </p>
            )}
          </div>

          {/* Action Row with Know More & Arrow */}
          <div className="mt-3 pt-2.5 border-t border-[#161A26] flex items-center justify-between">
            <span className="font-['IBM_Plex_Mono'] text-[9.5px] uppercase tracking-wider text-[#7E8494] font-medium">
              {hasVideo ? 'HD Video Campaign' : totalVisualsCount > 1 ? `${totalVisualsCount} Scene Editorial` : 'High-Res Visual'}
            </span>

            <div className="flex items-center gap-1 font-['IBM_Plex_Mono'] text-[10.5px] font-bold uppercase tracking-wider text-[#F5F3EE] group-hover:text-white transition-colors">
              <span>Know More</span>
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: categoryInfo.buttonColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
