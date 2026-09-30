import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ambientAudio } from '../services/ambientAudio';

interface SoundToggleProps {
  className?: string;
  compact?: boolean;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  className = '',
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Subscribe to sound engine state
    const unsubscribe = ambientAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });

    // If user previously turned sound on, resume on first user interaction (to satisfy browser autoplay policies)
    const checkSaved = () => {
      try {
        const wasEnabled = localStorage.getItem('rudransh_ambient_sound_enabled') === 'true';
        if (wasEnabled && !ambientAudio.getIsPlaying()) {
          const handleFirstGesture = () => {
            ambientAudio.play();
            window.removeEventListener('pointerdown', handleFirstGesture);
            window.removeEventListener('keydown', handleFirstGesture);
          };
          window.addEventListener('pointerdown', handleFirstGesture, { once: true });
          window.addEventListener('keydown', handleFirstGesture, { once: true });
        }
      } catch {
        // ignore
      }
    };

    checkSaved();

    return () => unsubscribe();
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    ambientAudio.toggle();
  };

  return (
    <button
      id="global-ambient-sound-toggle"
      onClick={handleToggle}
      aria-label={isPlaying ? 'Mute cinematic ambient audio' : 'Play cinematic ambient audio'}
      title={isPlaying ? 'Mute ambient sound (Cinematic Lo-Fi)' : 'Enable ambient sound (Cinematic Lo-Fi)'}
      className={`group relative flex items-center gap-2.5 transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF87] ${
        isPlaying
          ? 'bg-[#051E14]/80 border border-[#00FF87]/40 text-[#00FF87] shadow-[0_0_15px_rgba(0,255,135,0.15)] hover:border-[#00FF87]/70 hover:shadow-[0_0_20px_rgba(0,255,135,0.25)]'
          : 'bg-[#10121A] border border-[#232738] text-[#9295A0] hover:text-[#F5F3EE] hover:border-[#38405C]'
      } ${compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'} ${className}`}
    >
      {/* Sound Visualizer Equalizer / Icon */}
      <div className="relative flex items-center justify-center w-4 h-4">
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3.5 w-3.5" aria-hidden="true">
            <span className="w-[2px] bg-[#00FF87] rounded-full animate-[soundWave1_0.8s_ease-in-out_infinite_alternate]" />
            <span className="w-[2px] bg-[#00FF87] rounded-full animate-[soundWave2_0.6s_ease-in-out_infinite_alternate]" />
            <span className="w-[2px] bg-[#00FF87] rounded-full animate-[soundWave3_0.9s_ease-in-out_infinite_alternate]" />
            <span className="w-[2px] bg-[#00FF87] rounded-full animate-[soundWave4_0.7s_ease-in-out_infinite_alternate]" />
          </div>
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#7B8092] group-hover:text-[#F5F3EE] transition-colors" />
        )}
      </div>

      {/* Label */}
      <span className="font-['IBM_Plex_Mono'] text-[11px] font-medium tracking-wider uppercase whitespace-nowrap">
        {isPlaying ? (
          <span className="flex items-center gap-1.5 text-[#00FF87]">
            <span>SOUND</span>
            <span className="text-[9px] opacity-75 font-normal tracking-widest">[ON]</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span>SOUND</span>
            <span className="text-[9px] text-[#636879] group-hover:text-[#9295A0] tracking-widest">[OFF]</span>
          </span>
        )}
      </span>

      {/* Active Subtle Pulsing Indicator Dot */}
      {isPlaying && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF87]" />
        </span>
      )}
    </button>
  );
};
