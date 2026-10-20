import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface WaterParticle {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  vy: number;
  charIndex: number;
  intensity: number;
}

export interface FluidHandle {
  /** Pull the water toward a point in viewport coordinates, or release it with null. */
  attract: (point: { x: number; y: number } | null) => void;
  /** Send a ripple out from a point in viewport coordinates. */
  ripple: (point: { x: number; y: number }) => void;
}

const WATER_CHARS = ['~', '≈', '∼', '⌐', '¬', '∩', '∪', '°', '·', '`', ',', '.', ':', ';', '▴', '▾', '◆', '◇'];
const PARTICLE_SIZE = 14;
const POOL_HEIGHT = 160;
const SPACING = 8;

/** Returns the centre of an element in viewport coordinates. */
export function centreOf(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

const FluidCanvas = forwardRef<FluidHandle, {}>(function FluidCanvas(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<WaterParticle[]>([]);
  const attractorRef = useRef<{ x: number; y: number } | null>(null);
  const rippleRef = useRef({ active: false, x: 0, y: 0, intensity: 0, time: 0 });
  const timeRef = useRef(0);
  const frameRef = useRef<number>();
  const reducedMotionRef = useRef(false);

  useImperativeHandle(ref, () => ({
    attract: (point) => {
      attractorRef.current = point;
    },
    ripple: (point) => {
      rippleRef.current = { active: true, x: point.x, y: point.y, intensity: 8, time: 0 };
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;

    let width = 0;
    let height = 0;

    const initialise = () => {
      particlesRef.current = [];
      const cols = Math.floor(width / SPACING);
      const rows = Math.floor(POOL_HEIGHT / (SPACING * 0.7));
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseY = height - POOL_HEIGHT + row * (SPACING * 0.7);
          particlesRef.current.push({
            x: col * SPACING + SPACING / 2 + (Math.random() - 0.5) * 2,
            y: baseY + (Math.random() - 0.5) * 2,
            baseY,
            vx: 0,
            vy: 0,
            charIndex: Math.floor(Math.random() * 6),
            intensity: 0.5 + Math.random() * 0.3,
          });
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initialise();
      if (reducedMotionRef.current) render();
    };

    const update = () => {
      timeRef.current += 0.016;
      const ripple = rippleRef.current;
      if (ripple.active) {
        ripple.time += 0.016;
        ripple.intensity *= 0.98;
        if (ripple.intensity < 0.1) ripple.active = false;
      }
      const attractor = attractorRef.current;

      for (const p of particlesRef.current) {
        const wave = Math.sin(timeRef.current * 0.6 + p.x * 0.008) * 1.5;
        const restY = p.baseY + wave;

        if (attractor) {
          const dx = attractor.x - p.x;
          const dy = attractor.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 400) {
            const force = Math.pow((400 - dist) / 400, 2) * 1.2;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force - force * 2;
          }
        }

        if (ripple.active) {
          const dx = ripple.x - p.x;
          const dy = ripple.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 300) {
            const w = Math.sin(dist * 0.02 - ripple.time * 8) * ripple.intensity;
            p.vx += (dx / dist) * w * 0.4;
            p.vy += (dy / dist) * w * 0.4;
          }
        }

        p.vy += (restY - p.y) * 0.02;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y > height - 20) p.y = height - 20;

        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        const lift = Math.max(0, p.baseY - p.y);
        if (speed > 3 || lift > 40) p.charIndex = 8 + Math.floor(Math.random() * 4);
        else if (speed > 1.5 || lift > 15) p.charIndex = 4 + Math.floor(Math.random() * 4);
        else p.charIndex = Math.floor(Math.random() * 4);
      }
    };

    const render = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0F172A');
      gradient.addColorStop(0.3, '#1E293B');
      gradient.addColorStop(0.7, '#334155');
      gradient.addColorStop(1, '#475569');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${PARTICLE_SIZE}px "JetBrains Mono", Monaco, Consolas, "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const attractor = attractorRef.current;
      for (const p of particlesRef.current) {
        const speed = Math.hypot(p.vx, p.vy);
        const dist = attractor ? Math.hypot(attractor.x - p.x, attractor.y - p.y) : Infinity;
        if (dist < 150) ctx.fillStyle = 'rgba(0, 255, 255, 0.95)';
        else if (dist < 300) ctx.fillStyle = 'rgba(64, 224, 255, 0.8)';
        else if (speed > 2) ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
        else ctx.fillStyle = 'rgba(120, 180, 220, 0.6)';
        ctx.fillText(WATER_CHARS[Math.min(p.charIndex, WATER_CHARS.length - 1)], p.x, p.y);
      }
    };

    const loop = () => {
      update();
      render();
      frameRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frameRef.current || reducedMotionRef.current) return;
      frameRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        stop();
        render();
      } else {
        start();
      }
    };

    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0" aria-hidden="true" />;
});

export default FluidCanvas;
