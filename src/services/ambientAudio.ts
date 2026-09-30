/**
 * Cinematic Lo-Fi Ambient Sound Engine
 * Generates an evolving, warm analog ambient soundscape via the Web Audio API.
 * Features warm analog pad chords (Dm9 - Bbmaj7 - Fadd9 - Gm9),
 * deep sub-bass drone, subtle tape flutter warmth, and auto-ducking on video playback.
 */

type SoundStateListener = (isPlaying: boolean) => void;

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;
  private isDucked = false;
  private chordIntervalId: number | null = null;
  private activeVoices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private listeners: Set<SoundStateListener> = new Set();
  private chordIndex = 0;

  // Cinematic Lo-Fi chord progressions (frequencies in Hz)
  // Dm9 -> Bbmaj7 -> Fadd9 -> Gm9 (evokes moody, luxury cinematic atmosphere)
  private chords = [
    // Dm9: D2 (73.4), A2 (110.0), F3 (174.6), C4 (261.6), E4 (329.6)
    [73.42, 110.0, 174.61, 261.63, 329.63],
    // Bbmaj7: Bb1 (58.27), F2 (87.31), D3 (146.83), A3 (220.0), D4 (293.66)
    [58.27, 87.31, 146.83, 220.0, 293.66],
    // Fadd9: F1 (43.65), C2 (65.41), A2 (110.0), G3 (196.0), C4 (261.63)
    [43.65, 65.41, 110.0, 196.0, 261.63],
    // Gm9: G1 (49.0), D2 (73.42), Bb2 (116.54), F3 (174.61), A3 (220.0)
    [49.0, 73.42, 116.54, 174.61, 220.0],
  ];

  constructor() {
    // Listen for video or audio playback events from project cards & modals to duck ambient sound
    if (typeof window !== 'undefined') {
      window.addEventListener('portfolio-audio-play', () => {
        this.duck(true);
      });
      window.addEventListener('portfolio-modal-open', () => {
        this.duck(true);
      });
      window.addEventListener('portfolio-audio-stop', () => {
        this.duck(false);
      });
      window.addEventListener('portfolio-modal-close', () => {
        this.duck(false);
      });
    }
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Gain for user volume / mute control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    // Duck Gain for auto-lowering ambient volume during video playback
    this.duckGain = this.ctx.createGain();
    this.duckGain.gain.setValueAtTime(1, this.ctx.currentTime);

    // Warm Low-pass Filter for vintage analog lo-fi texture (cuts harsh high freqs)
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(620, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.1, this.ctx.currentTime);

    // Subtle LFO modulation on filter frequency for gentle breathing movement
    try {
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.06, this.ctx.currentTime); // very slow 16s cycle
      lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      lfo.start();
    } catch {
      // safe fallback if LFO fails
    }

    // Connect node graph:
    // Voices -> FilterNode -> DuckGain -> MasterGain -> Destination
    this.filterNode.connect(this.duckGain);
    this.duckGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Start subtle analog tape warmth
    this.startTapeWarmth();
  }

  // Generates subtle analog tape warmth / vinyl-like floor noise
  private startTapeWarmth() {
    if (!this.ctx || !this.duckGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      // Pink noise algorithm
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.015;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Bandpass filter for tape warmth (around 900Hz)
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(850, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.duckGain);
      this.noiseNode.start();
    } catch {
      // safe fallback if audio buffer creation fails
    }
  }

  private playChord(freqs: number[]) {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const chordDuration = 7.5; // seconds per chord
    const attack = 2.4;
    const release = 3.2;

    const newVoices: { osc: OscillatorNode; gain: GainNode }[] = [];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;
      // Main oscillator (sine for pure warmth or triangle for body)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Lower notes use sine for pure bass, higher notes use soft triangle
      osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
      
      // Micro-detune (+/- 2.5 to 5 cents) for lush analog chorusing
      const detune = (idx - 2) * 3.5;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      // Volume envelope
      // Sub-bass is balanced; higher harmonics are gentle and spacious
      const voiceMaxVol = idx === 0 ? 0.08 : 0.035 / (idx + 0.5);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(voiceMaxVol, now + attack);
      gain.gain.setValueAtTime(voiceMaxVol, now + chordDuration);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration + release);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(now);
      osc.stop(now + chordDuration + release + 0.1);

      newVoices.push({ osc, gain });
    });

    this.activeVoices.push(...newVoices);

    // Clean up expired voices
    setTimeout(() => {
      this.activeVoices = this.activeVoices.filter(v => newVoices.indexOf(v) === -1);
    }, (chordDuration + release + 1) * 1000);
  }

  private startChordLoop() {
    this.chordIndex = 0;
    this.playChord(this.chords[this.chordIndex]);

    this.chordIntervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
      this.playChord(this.chords[this.chordIndex]);
    }, 7000);
  }

  private stopChordLoop() {
    if (this.chordIntervalId) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.activeVoices.forEach(({ gain, osc }) => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
          osc.stop(now + 0.7);
        } catch {
          // ignore
        }
      });
      this.activeVoices = [];
    }
  }

  public async play(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return false;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.isPlaying = true;
      const now = this.ctx.currentTime;

      // Smooth fade in over 1.8s
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.85, now + 1.8);

      this.startChordLoop();
      this.notifyListeners();

      try {
        localStorage.setItem('rudransh_ambient_sound_enabled', 'true');
      } catch {
        // ignore
      }

      return true;
    } catch (err) {
      console.warn('Failed to start ambient audio:', err);
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    }
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      // Smooth fade out over 0.8s
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    }

    setTimeout(() => {
      this.stopChordLoop();
    }, 850);

    try {
      localStorage.setItem('rudransh_ambient_sound_enabled', 'false');
    } catch {
      // ignore
    }

    this.notifyListeners();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public duck(shouldDuck: boolean): void {
    if (!this.ctx || !this.duckGain || !this.isPlaying) return;
    this.isDucked = shouldDuck;
    const now = this.ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    const targetGain = shouldDuck ? 0.08 : 1.0;
    this.duckGain.gain.setValueAtTime(this.duckGain.gain.value, now);
    this.duckGain.gain.exponentialRampToValueAtTime(Math.max(targetGain, 0.001), now + (shouldDuck ? 0.4 : 1.2));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isPlaying));
  }
}

export const ambientAudio = new AmbientAudioEngine();
