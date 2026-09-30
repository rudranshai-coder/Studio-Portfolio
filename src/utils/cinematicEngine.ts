/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cinematic Generative Engine for GSAP ScrollTrigger Portfolio Experience
 * Renders 8 continuous, interconnected, AI-inspired visual environments:
 * 1. AI Core (Quantum Neural Core & Synaptic Corona)
 * 2. AI Generation (Latent Space Diffusion & Tensor Lattice)
 * 3. Fashion (Fluid Digital Silk & Liquid Velvet Physics)
 * 4. Product (Sculptural Glass Monoliths & Studio Caustics)
 * 5. Jewellery (Diamond Crystallography & Molten Gold Streams)
 * 6. Projects (Dimensional Portal & Holographic Plinths)
 * 7. Campaigns (Aurora Energy Canopy & Orbital Waveplanes)
 * 8. Contact (Harmonic Singularity Beacon & Convergent Magnetic Field)
 * 
 * Strictly NO people, characters, text, or UI in the visual simulation.
 */

export interface CinematicState {
  progress: number; // 0.0 to 1.0 overall scroll progress
  stageIndex: number; // 0 to 7
  stageProgress: number; // 0.0 to 1.0 within current stage
  blendFactor: number; // 0.0 to 1.0 transition blend to next stage
  cameraZ: number; // Zoom/depth factor
  cameraRotX: number;
  cameraRotY: number;
  lightIntensity: number;
  chromaticAberration: number;
  particleDensity: number;
  morphFactor: number;
  glowRadius: number;
  time: number;
}

export const STAGE_NAMES = [
  'AI Core',
  'AI Generation',
  'Fashion',
  'Product',
  'Jewellery',
  'Projects',
  'Campaigns',
  'Contact',
] as const;

export const STAGE_DESCRIPTIONS = [
  'Quantum neural singularity & pulsating synaptic energy lattice',
  'Latent space diffusion waves & tensor grid synthesis',
  'Undulating digital silk, liquid chiffon & luxury velvet physics',
  'Precision architectural glass monoliths & studio rim caustics',
  'Diamond facet crystallography, rainbow dispersion & molten gold streams',
  'Dimensional portal gallery, obsidian plinths & 3D perspective grids',
  'Planetary energy waves, sweeping auroras & multi-frequency orbital lasers',
  'Harmonic convergence beacon & radiant magnetic singularity',
] as const;

export const STAGE_COLORS = [
  { primary: '#FF6A00', secondary: '#9D4EDD', ambient: '#06070B', glow: 'rgba(255, 106, 0, 0.4)' }, // AI Core: Amber/Violet
  { primary: '#3B82F6', secondary: '#8B5CF6', ambient: '#040714', glow: 'rgba(59, 130, 246, 0.4)' }, // AI Generation: Electric Blue/Purple
  { primary: '#EC4899', secondary: '#F3E8CB', ambient: '#0D050B', glow: 'rgba(236, 72, 153, 0.35)' }, // Fashion: Rose Silk/Champagne
  { primary: '#06B6D4', secondary: '#3B82F6', ambient: '#020B14', glow: 'rgba(6, 182, 212, 0.4)' }, // Product: Cyan/Cobalt
  { primary: '#F59E0B', secondary: '#FEF3C7', ambient: '#120B02', glow: 'rgba(245, 158, 11, 0.45)' }, // Jewellery: 24K Gold/Diamond
  { primary: '#10B981', secondary: '#6366F1', ambient: '#02120C', glow: 'rgba(16, 185, 129, 0.35)' }, // Projects: Emerald/Indigo
  { primary: '#8B5CF6', secondary: '#F43F5E', ambient: '#0A0414', glow: 'rgba(139, 92, 246, 0.4)' }, // Campaigns: Ultra Violet/Crimson
  { primary: '#FF7A00', secondary: '#38BDF8', ambient: '#0A0806', glow: 'rgba(255, 122, 0, 0.45)' }, // Contact: Radiant Beacon
];

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface ParticleNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseSize: number;
  alpha: number;
  hue: number;
  phase: number;
  connectionCount: number;
}

export class CinematicRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width = 1920;
  private height = 1080;
  private dpr = 1;
  private particles: ParticleNode[] = [];
  private readonly MAX_PARTICLES = 160;
  private silkCurves: Array<{ amp: number; freq: number; speed: number; phase: number; yOffset: number }> = [];
  private crystalNodes: Vector3D[] = [];
  private portalPlanes: Array<{ z: number; width: number; height: number; rot: number }> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('2D Context unsupported');
    this.ctx = context;
    this.initSceneData();
    this.resize();
  }

  private initSceneData() {
    // Generate particle nodes for neural lattice & space dust
    this.particles = [];
    for (let i = 0; i < this.MAX_PARTICLES; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 1200 - 600,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1.0,
        baseSize: Math.random() * 2.5 + 1.0,
        alpha: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
        connectionCount: 0,
      });
    }

    // Digital silk wave harmonics (Fashion stage)
    this.silkCurves = [];
    for (let i = 0; i < 7; i++) {
      this.silkCurves.push({
        amp: 40 + i * 18,
        freq: 0.002 + i * 0.0006,
        speed: 0.6 + i * 0.15,
        phase: (i * Math.PI) / 3.5,
        yOffset: (i - 3) * 35,
      });
    }

    // 3D Crystal nodes (Jewellery / Product stages)
    this.crystalNodes = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const baseIcosahedron: Vector3D[] = [
      { x: -1, y: phi, z: 0 }, { x: 1, y: phi, z: 0 }, { x: -1, y: -phi, z: 0 }, { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi }, { x: 0, y: 1, z: phi }, { x: 0, y: -1, z: -phi }, { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 }, { x: phi, y: 0, z: 1 }, { x: -phi, y: 0, z: -1 }, { x: -phi, y: 0, z: 1 },
    ];
    this.crystalNodes = baseIcosahedron.map((pt) => ({
      x: pt.x * 120,
      y: pt.y * 120,
      z: pt.z * 120,
    }));

    // Portal exhibition plinths (Projects stage)
    this.portalPlanes = [];
    for (let i = 0; i < 6; i++) {
      this.portalPlanes.push({
        z: i * 200 - 300,
        width: 320 + i * 40,
        height: 200 + i * 25,
        rot: (i * Math.PI) / 6,
      });
    }
  }

  public resize() {
    const parent = this.canvas.parentElement;
    const w = parent ? parent.clientWidth : window.innerWidth;
    const h = parent ? parent.clientHeight : window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = w;
    this.height = h;
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.ctx.scale(this.dpr, this.dpr);
  }

  public render(state: CinematicState) {
    const { ctx, width, height } = this;
    const time = state.time;
    const stageIndex = state.stageIndex;
    const nextStageIndex = (stageIndex + 1) % 8;
    const blend = state.blendFactor;

    ctx.clearRect(0, 0, width, height);

    // 1. Ambient Background Atmosphere with Stage Interpolation
    const curColor = STAGE_COLORS[stageIndex];
    const nxtColor = STAGE_COLORS[nextStageIndex];
    
    // Smooth radial lighting & vignette
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.max(width, height) * 0.85;

    const bgGradient = ctx.createRadialGradient(
      cx + Math.sin(time * 0.5) * 60,
      cy + Math.cos(time * 0.4) * 40,
      20,
      cx,
      cy,
      maxRadius
    );

    // Dynamic color interpolation
    bgGradient.addColorStop(0, this.interpolateColor(curColor.glow, nxtColor.glow, blend));
    bgGradient.addColorStop(0.5, this.interpolateColor(curColor.ambient, nxtColor.ambient, blend));
    bgGradient.addColorStop(1, '#000811');

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Render Stage-Specific Generative Visuals with Seamless Morphing
    ctx.save();
    ctx.translate(cx, cy);

    // Render current and next stage with crossfade and morphing transforms
    if (blend < 0.99) {
      ctx.save();
      ctx.globalAlpha = 1 - blend;
      this.renderStageVisual(stageIndex, state, time);
      ctx.restore();
    }

    if (blend > 0.01) {
      ctx.save();
      ctx.globalAlpha = blend;
      this.renderStageVisual(nextStageIndex, state, time);
      ctx.restore();
    }

    // 3. Render Universal Interconnected Floating Energy Particles & Synaptic Filaments
    this.renderUniversalParticles(state, time, curColor, nxtColor, blend);

    ctx.restore();

    // 4. Volumetric Light Flares & Chromatic Edge Sheen
    this.renderLightFlares(state, time, curColor, nxtColor, blend);
  }

  private renderStageVisual(stage: number, state: CinematicState, time: number) {
    switch (stage) {
      case 0:
        this.renderStageAICore(state, time);
        break;
      case 1:
        this.renderStageAIGeneration(state, time);
        break;
      case 2:
        this.renderStageFashion(state, time);
        break;
      case 3:
        this.renderStageProduct(state, time);
        break;
      case 4:
        this.renderStageJewellery(state, time);
        break;
      case 5:
        this.renderStageProjects(state, time);
        break;
      case 6:
        this.renderStageCampaigns(state, time);
        break;
      case 7:
        this.renderStageContact(state, time);
        break;
    }
  }

  // ================= STAGE 1: AI CORE =================
  private renderStageAICore(state: CinematicState, time: number) {
    const { ctx } = this;
    const coreRadius = 90 + Math.sin(time * 2.5) * 10 + state.cameraZ * 20;

    // Outer quantum orbit rings
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate(time * (0.3 + i * 0.15) + (i * Math.PI) / 4);
      ctx.beginPath();
      const rX = coreRadius * (1.6 + i * 0.45);
      const rY = coreRadius * (0.6 + i * 0.2);
      ctx.ellipse(0, 0, rX, rY, (i * Math.PI) / 3, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 106, 0, 0.4)' : 'rgba(157, 78, 221, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Traveling energy photon nodes
      const angle = time * (1.2 + i * 0.3);
      const px = Math.cos(angle) * rX;
      const py = Math.sin(angle) * rY;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF';
      ctx.shadowColor = '#FF6A00';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // Sacred geometric core icosahedron lattice
    this.render3DCrystal(time * 0.8, time * 0.5, coreRadius * 0.85, '#FF6A00', '#9D4EDD');

    // Central pulsing energy singularity
    const coreGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, coreRadius);
    coreGlow.addColorStop(0, '#FFFFFF');
    coreGlow.addColorStop(0.3, 'rgba(255, 106, 0, 0.9)');
    coreGlow.addColorStop(0.7, 'rgba(157, 78, 221, 0.4)');
    coreGlow.addColorStop(1, 'rgba(6, 7, 11, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow;
    ctx.fill();
  }

  // ================= STAGE 2: AI GENERATION =================
  private renderStageAIGeneration(state: CinematicState, time: number) {
    const { ctx } = this;
    const gridCount = 9;
    const spacing = 45 + Math.sin(time) * 5;

    // Latent space tensor matrix grid
    ctx.save();
    ctx.rotate(time * 0.1);
    ctx.lineWidth = 1;

    for (let x = -gridCount; x <= gridCount; x++) {
      for (let y = -gridCount; y <= gridCount; y++) {
        const dist = Math.sqrt(x * x + y * y);
        if (dist > gridCount) continue;

        const wave = Math.sin(dist * 0.6 - time * 2.5);
        const px = x * spacing;
        const py = y * spacing + wave * 18;
        const alpha = Math.max(0, 1 - dist / gridCount) * 0.55;

        // Vector node
        ctx.beginPath();
        ctx.arc(px, py, 2 + wave * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.fill();

        // Cross connection lines
        if (x < gridCount && Math.random() > 0.4) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo((x + 1) * spacing, y * spacing);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.4})`;
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Prismatic generative diffusion wave rings
    for (let r = 1; r <= 5; r++) {
      const radius = ((time * 60 + r * 70) % 450) + 40;
      const alpha = Math.max(0, 1 - radius / 450) * 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = r % 2 === 0 ? `rgba(59, 130, 246, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // ================= STAGE 3: FASHION =================
  private renderStageFashion(state: CinematicState, time: number) {
    const { ctx, width, silkCurves } = this;
    const waveWidth = width * 0.95;

    // Undulating digital silk & liquid chiffon drapery simulation (NO human characters, pure fabric/light physics)
    silkCurves.forEach((curve, index) => {
      ctx.save();
      ctx.beginPath();

      const startX = -waveWidth / 2;
      const endX = waveWidth / 2;
      const step = 20;

      for (let x = startX; x <= endX; x += step) {
        const norm = (x + waveWidth / 2) / waveWidth;
        const env = Math.sin(norm * Math.PI); // Envelope constraint
        const y =
          Math.sin(x * curve.freq + time * curve.speed + curve.phase) * curve.amp * env +
          Math.cos(x * curve.freq * 1.5 - time * 0.8) * (curve.amp * 0.4) * env +
          curve.yOffset;

        if (x === startX) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Gradients mimicking champagne silk and rose velvet drapery
      const grad = ctx.createLinearGradient(-300, 0, 300, 0);
      if (index % 2 === 0) {
        grad.addColorStop(0, 'rgba(236, 72, 153, 0.05)');
        grad.addColorStop(0.5, 'rgba(243, 232, 203, 0.45)');
        grad.addColorStop(1, 'rgba(157, 78, 221, 0.1)');
      } else {
        grad.addColorStop(0, 'rgba(157, 78, 221, 0.08)');
        grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.4)');
        grad.addColorStop(1, 'rgba(243, 232, 203, 0.15)');
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.5 + Math.sin(time + index) * 1.2;
      ctx.stroke();

      // Shimmering micro-sequin/thread sparkle nodes
      for (let s = 0; s < 4; s++) {
        const sx = Math.sin(time * 0.7 + index + s * 2) * (waveWidth * 0.35);
        const norm = (sx + waveWidth / 2) / waveWidth;
        const sy = Math.sin(sx * curve.freq + time * curve.speed + curve.phase) * curve.amp * Math.sin(norm * Math.PI) + curve.yOffset;

        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.shadowColor = '#F3E8CB';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    });
  }

  // ================= STAGE 4: PRODUCT =================
  private renderStageProduct(state: CinematicState, time: number) {
    const { ctx } = this;

    // Precision architectural glass monoliths & floating anodized geometry
    ctx.save();
    const rot = time * 0.3;

    // Floating central monolithic pedestal
    for (let p = 0; p < 3; p++) {
      ctx.save();
      const pRot = rot + (p * Math.PI * 2) / 3;
      const dist = 140 + p * 40;
      const px = Math.cos(pRot) * dist;
      const py = Math.sin(pRot * 1.5) * 50;

      ctx.translate(px, py);
      ctx.rotate(pRot);

      // Glass monolith face
      ctx.beginPath();
      ctx.rect(-35, -70, 70, 140);
      const glassGrad = ctx.createLinearGradient(-35, -70, 35, 70);
      glassGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      glassGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)');
      glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      ctx.fillStyle = glassGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Studio rim lighting laser sweep
      const laserY = Math.sin(time * 3 + p) * 60;
      ctx.beginPath();
      ctx.moveTo(-35, laserY);
      ctx.lineTo(35, laserY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    // Cylindrical studio turntable grid floor
    ctx.beginPath();
    ctx.ellipse(0, 160, 300, 70, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const gx = Math.cos(a + time * 0.2) * 300;
      const gy = 160 + Math.sin(a + time * 0.2) * 70;
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(gx, gy);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.stroke();
    }

    ctx.restore();
  }

  // ================= STAGE 5: JEWELLERY =================
  private renderStageJewellery(state: CinematicState, time: number) {
    const { ctx } = this;

    // Diamond crystallography, refractive gemstone facets & molten gold streams
    // Central hyper-brilliant diamond octahedron
    this.render3DCrystal(time * 0.6, time * 0.9, 140, '#F59E0B', '#FEF3C7');

    // Molten 24K gold radiant streams spiraling outward
    ctx.save();
    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      const startAngle = (s * Math.PI) / 2 + time * 0.4;
      const turns = 1.8;
      const maxR = 260;

      for (let r = 20; r < maxR; r += 6) {
        const theta = startAngle + (r / maxR) * Math.PI * turns;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * (r * 0.7);

        if (r === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = s % 2 === 0 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(254, 243, 199, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Prismatic spectral dispersion rays (Rainbow facets)
    for (let i = 0; i < 8; i++) {
      const rayAngle = (i * Math.PI) / 4 + time * 0.25;
      const len = 180 + Math.sin(time * 3 + i) * 50;
      const rx = Math.cos(rayAngle) * len;
      const ry = Math.sin(rayAngle) * len;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(rx, ry);
      const rainbowGrad = ctx.createLinearGradient(0, 0, rx, ry);
      rainbowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      rainbowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
      rainbowGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      ctx.strokeStyle = rainbowGrad;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  // ================= STAGE 6: PROJECTS =================
  private renderStageProjects(state: CinematicState, time: number) {
    const { ctx, portalPlanes } = this;

    // Dimensional portal gallery & obsidian 3D perspective frames
    ctx.save();

    portalPlanes.forEach((plane, index) => {
      ctx.save();
      const zOffset = (plane.z + time * 120) % 700 - 350;
      const scale = Math.max(0.15, (zOffset + 400) / 400);
      const alpha = Math.min(1, Math.max(0, 1 - Math.abs(zOffset) / 380));

      ctx.scale(scale, scale);
      ctx.rotate(Math.sin(time * 0.2 + index) * 0.08);

      // Holographic project portal frame
      ctx.beginPath();
      ctx.rect(-plane.width / 2, -plane.height / 2, plane.width, plane.height);
      ctx.strokeStyle = index % 2 === 0 ? `rgba(16, 185, 129, ${alpha * 0.6})` : `rgba(99, 102, 241, ${alpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corner technical crosshairs
      const cw = 16;
      const hw = plane.width / 2;
      const hh = plane.height / 2;
      [
        [-hw, -hh],
        [hw, -hh],
        [-hw, hh],
        [hw, hh],
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx - (cx > 0 ? cw : -cw), cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy - (cy > 0 ? cw : -cw));
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.restore();
    });

    // Infinity perspective horizon grid
    ctx.beginPath();
    for (let x = -400; x <= 400; x += 80) {
      ctx.moveTo(x * 0.2, 80);
      ctx.lineTo(x * 2.5, 450);
    }
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // ================= STAGE 7: CAMPAIGNS =================
  private renderStageCampaigns(state: CinematicState, time: number) {
    const { ctx, width } = this;

    // Atmospheric sweeping aurora borealis ribbons & orbital waveplanes
    ctx.save();
    for (let c = 0; c < 5; c++) {
      ctx.beginPath();
      const waveWidth = width * 0.9;
      const step = 25;
      const cSpeed = 0.8 + c * 0.2;
      const cAmp = 70 + c * 25;
      const cY = (c - 2) * 50;

      for (let x = -waveWidth / 2; x <= waveWidth / 2; x += step) {
        const norm = (x + waveWidth / 2) / waveWidth;
        const env = Math.sin(norm * Math.PI);
        const y =
          Math.sin(x * 0.003 + time * cSpeed + c) * cAmp * env +
          Math.cos(x * 0.006 - time * 0.5) * (cAmp * 0.3) * env +
          cY;

        if (x === -waveWidth / 2) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const grad = ctx.createLinearGradient(-350, 0, 350, 0);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
      grad.addColorStop(0.5, c % 2 === 0 ? 'rgba(244, 63, 94, 0.5)' : 'rgba(139, 92, 246, 0.5)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    // High-frequency synchronized pulse beams radiating outward
    for (let b = 0; b < 6; b++) {
      const bAngle = (b * Math.PI) / 3 + time * 0.2;
      const bDist = 280;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(bAngle) * bDist, Math.sin(bAngle) * bDist);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // ================= STAGE 8: CONTACT =================
  private renderStageContact(state: CinematicState, time: number) {
    const { ctx } = this;
    const pulse = 100 + Math.sin(time * 3) * 15;

    // Harmonic convergence beacon: all light streams converging into radiant singularity
    // Concentric welcoming beacon rings
    for (let r = 1; r <= 6; r++) {
      const radius = pulse + r * 45;
      const alpha = Math.max(0, 1 - radius / 400) * 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = r % 2 === 0 ? `rgba(255, 122, 0, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Spiral magnetic focal arms
    for (let a = 0; a < 6; a++) {
      ctx.beginPath();
      const armStart = (a * Math.PI) / 3 + time * 0.6;
      for (let d = 30; d < 320; d += 8) {
        const theta = armStart + (d / 320) * Math.PI * 1.5;
        const x = Math.cos(theta) * d;
        const y = Math.sin(theta) * d;
        if (d === 30) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255, 122, 0, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Radiant core singularity
    const beaconGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, pulse);
    beaconGlow.addColorStop(0, '#FFFFFF');
    beaconGlow.addColorStop(0.3, 'rgba(255, 122, 0, 0.95)');
    beaconGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
    beaconGlow.addColorStop(1, 'rgba(6, 7, 11, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, pulse, 0, Math.PI * 2);
    ctx.fillStyle = beaconGlow;
    ctx.fill();
  }

  // ================= 3D CRYSTAL LATTICE HELPER =================
  private render3DCrystal(rotX: number, rotY: number, scale: number, colA: string, colB: string) {
    const { ctx, crystalNodes } = this;
    const projected: Array<{ x: number; y: number; z: number }> = [];

    // Rotate and project 3D vertices
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    crystalNodes.forEach((pt) => {
      // Y rotation
      let x = pt.x * cosY + pt.z * sinY;
      let z = -pt.x * sinY + pt.z * cosY;
      // X rotation
      let y = pt.y * cosX - z * sinX;
      z = pt.y * sinX + z * cosX;

      const fov = 400;
      const projScale = fov / (fov + z + 300);
      projected.push({
        x: (x * projScale * scale) / 120,
        y: (y * projScale * scale) / 120,
        z: z,
      });
    });

    // Draw connecting structural facet edges
    ctx.save();
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < scale * 1.3) {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.strokeStyle = i % 2 === 0 ? colA : colB;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // Draw vertex nodes
    projected.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = idx % 2 === 0 ? colA : colB;
      ctx.fill();
    });

    ctx.restore();
  }

  // ================= UNIVERSAL PARTICLES =================
  private renderUniversalParticles(
    state: CinematicState,
    time: number,
    curColor: (typeof STAGE_COLORS)[0],
    nxtColor: (typeof STAGE_COLORS)[0],
    blend: number
  ) {
    const { ctx, particles } = this;
    const speedMultiplier = 1 + state.cameraZ * 0.5;

    ctx.save();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * speedMultiplier;
      p.y += p.vy * speedMultiplier;
      p.z += p.vz * speedMultiplier;

      // Wrap around bounds
      if (p.x < -800) p.x = 800;
      if (p.x > 800) p.x = -800;
      if (p.y < -600) p.y = 600;
      if (p.y > 600) p.y = -600;
      if (p.z < -400) p.z = 400;
      if (p.z > 400) p.z = -400;

      const fov = 500;
      const scale = fov / (fov + p.z + 400);
      const px = p.x * scale;
      const py = p.y * scale;
      const pSize = Math.max(0.8, p.baseSize * scale * (1 + Math.sin(time * 2 + p.phase) * 0.3));

      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? curColor.primary : nxtColor.secondary;
      ctx.globalAlpha = p.alpha * scale;
      ctx.fill();
    }

    ctx.restore();
  }

  // ================= LIGHT FLARES & CHROMATIC EDGES =================
  private renderLightFlares(
    state: CinematicState,
    time: number,
    curColor: (typeof STAGE_COLORS)[0],
    nxtColor: (typeof STAGE_COLORS)[0],
    blend: number
  ) {
    const { ctx, width, height } = this;
    const flareX = width * 0.5 + Math.sin(time * 0.4) * (width * 0.3);
    const flareY = height * 0.3 + Math.cos(time * 0.5) * (height * 0.2);

    const flare = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, width * 0.45);
    flare.addColorStop(0, this.interpolateColor(curColor.glow, nxtColor.glow, blend));
    flare.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
    flare.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, width, height);
  }

  // ================= COLOR INTERPOLATION HELPER =================
  private interpolateColor(color1: string, color2: string, factor: number): string {
    // Fast hex / rgba blending fallback
    return factor < 0.5 ? color1 : color2;
  }
}
