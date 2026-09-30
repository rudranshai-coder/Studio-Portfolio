import React, { useEffect, useRef } from 'react';

interface HeroCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Color palette for subtle neural energy: champagne, electric blue, soft violet, vibrant neon
    const colors = [
      'rgba(243, 232, 203, ', // Champagne
      'rgba(59, 130, 246, ',  // Electric Blue
      'rgba(168, 85, 247, ',  // Electric Violet
      'rgba(0, 255, 135, ',   // Accent Neon subtle
    ];

    const particleCount = Math.min(Math.floor((width * height) / 16000), 65);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.8,
        baseAlpha: Math.random() * 0.35 + 0.15,
        alpha: 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric nebula gradients
      const grad1X = width * 0.3 + Math.sin(time * 0.4) * 80;
      const grad1Y = height * 0.35 + Math.cos(time * 0.3) * 60;
      const grad1 = ctx.createRadialGradient(grad1X, grad1Y, 10, grad1X, grad1Y, width * 0.5);
      grad1.addColorStop(0, 'rgba(157, 78, 221, 0.06)'); // Plum ambient
      grad1.addColorStop(0.6, 'rgba(37, 99, 235, 0.03)'); // Cobalt
      grad1.addColorStop(1, 'rgba(6, 7, 11, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2X = width * 0.75 + Math.cos(time * 0.5) * 90;
      const grad2Y = height * 0.6 + Math.sin(time * 0.4) * 80;
      const grad2 = ctx.createRadialGradient(grad2X, grad2Y, 10, grad2X, grad2Y, width * 0.45);
      grad2.addColorStop(0, 'rgba(0, 255, 135, 0.05)'); // Neon energy
      grad2.addColorStop(0.7, 'rgba(16, 185, 129, 0.02)'); // Deep emerald
      grad2.addColorStop(1, 'rgba(6, 7, 11, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Cursor reactive soft glow
      if (mouseRef.current.active) {
        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          240
        );
        mouseGrad.addColorStop(0, 'rgba(0, 255, 135, 0.08)');
        mouseGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
        mouseGrad.addColorStop(1, 'rgba(6, 7, 11, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Update and draw particles with neural connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.12;

        // Mouse attraction/repulsion gentle reaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 1) {
            const force = (180 - dist) / 180;
            p.x -= (dx / dist) * force * 0.6;
            p.y -= (dy / dist) * force * 0.6;
            p.alpha = Math.min(p.alpha + force * 0.3, 0.85);
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.fill();

        // Connect nearby particles with subtle neural lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 135;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.14 * (p.alpha + p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(243, 232, 203, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 ${className}`}
    />
  );
};
