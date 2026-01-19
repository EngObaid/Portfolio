import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../theme-provider';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
  type: 'dot' | 'line';
  angle: number;
  speed: number;
  parallaxFactor: number;
  pulseAngle: number;
}

interface HeroParticlesProps {
  isEnergyBoosted?: boolean;
}

export function HeroParticles({ isEnergyBoosted = false }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000, active: false });
  const globalParallax = useRef({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const { theme } = useTheme();
  
  // Refs for stable animation loop
  const themeRef = useRef(theme);
  const boostRef = useRef(isEnergyBoosted);
  const frameIdRef = useRef<number>(0);

  // Synchronize refs with props/state
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { boostRef.current = isEnergyBoosted; }, [isEnergyBoosted]);

  // Premium Constants
  const CONNECTION_RADIUS = 160;
  const REPULSION_RADIUS = 220;
  const REPULSION_STRENGTH = 1.4;
  const RETURN_SPEED = 0.04;
  const FRICTION = 0.93;
  const PARALLAX_INTENSITY = 0.06;

  const COLORS = [
    'rgba(66, 133, 244, alpha)',  // Google Blue
    'rgba(99, 102, 241, alpha)',  // Indigo
    'rgba(167, 139, 250, alpha)', // Purple
    'rgba(56, 189, 248, alpha)',  // Sky Blue
  ];

  const initParticles = useCallback((width: number, height: number) => {
    const area = width * height;
    const count = Math.min(250, Math.max(100, Math.floor(area / 4500)));
    const newParticles: Particle[] = [];
    
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random()) * Math.min(width, height) * 0.85;
        
        const x = centerX + r * Math.cos(theta);
        const y = centerY + r * Math.sin(theta);
        
        const type = Math.random() > 0.7 ? 'line' : 'dot';
        const size = type === 'line' ? Math.random() * 5 + 4 : Math.random() * 3.5 + 1.5;
        
        newParticles.push({
          x,
          y,
          originX: x,
          originY: y,
          size,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.4 + 0.3,
          vx: 0,
          vy: 0,
          type,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.005,
          parallaxFactor: Math.random() * 0.8 + 0.2,
          pulseAngle: Math.random() * Math.PI * 2,
        });
    }
    particles.current = newParticles;
  }, []);

  const drawConnections = useCallback((
    ctx: CanvasRenderingContext2D, 
    ps: Particle[],
    isDark: boolean,
    isBoosted: boolean
  ) => {
    const boost = isBoosted ? 1.5 : 1;
    const radius = CONNECTION_RADIUS * boost;

    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const p1 = ps[i];
        const p2 = ps[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const baseOpacity = isDark ? 0.15 : 0.2;
          const opacity = (1 - dist / radius) * baseOpacity * boost;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p1.color.replace('alpha', opacity.toString());
          ctx.lineWidth = isBoosted ? 0.8 : 0.5;
          ctx.stroke();
        }
      }
    }
  }, []);

  const animate = useCallback(() => {
    if (!canvasRef.current || reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Use Refs for instantaneous theme/boost reactive access
    const currentTheme = themeRef.current;
    const isBoosted = boostRef.current;
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Dynamic style based on theme
    ctx.fillStyle = isDark 
        ? (isBoosted ? 'rgba(10, 10, 25, 0.15)' : 'rgba(10, 10, 20, 0.12)')
        : (isBoosted ? 'rgba(235, 245, 255, 0.15)' : 'rgba(255, 255, 255, 0.12)');
    ctx.fillRect(0, 0, width, height);

    const speedBoost = isBoosted ? 2.2 : 1;

    // Update global parallax
    const targetPX = (mouse.current.x - width / 2) * PARALLAX_INTENSITY;
    const targetPY = (mouse.current.y - height / 2) * PARALLAX_INTENSITY;
    globalParallax.current.x += (targetPX - globalParallax.current.x) * 0.05;
    globalParallax.current.y += (targetPY - globalParallax.current.y) * 0.05;

    particles.current.forEach((p) => {
      const dx = p.x - mouse.current.x;
      const dy = p.y - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const repRad = REPULSION_RADIUS * (isBoosted ? 1.4 : 1);
      if (dist < repRad && mouse.current.active) {
        const force = (repRad - dist) / repRad;
        const push = REPULSION_STRENGTH * 10 * speedBoost;
        p.vx += (dx / dist) * force * push;
        p.vy += (dy / dist) * force * push;
      }

      const targetX = p.originX + globalParallax.current.x * p.parallaxFactor;
      const targetY = p.originY + globalParallax.current.y * p.parallaxFactor;
      
      p.vx += (targetX - p.x) * RETURN_SPEED;
      p.vy += (targetY - p.y) * RETURN_SPEED;

      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'line') p.angle += p.speed * speedBoost;
      p.pulseAngle += 0.02 * speedBoost;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.type === 'line') ctx.rotate(p.angle);

      const alphaPulse = Math.sin(p.pulseAngle) * 0.1;
      const themeAlphaBoost = isDark ? 1.0 : 1.2;
      const finalAlpha = Math.max(0.1, Math.min(1.0, (p.alpha + alphaPulse) * (isBoosted ? 1.4 : 1) * themeAlphaBoost));
      
      ctx.fillStyle = p.color.replace('alpha', finalAlpha.toString());
      ctx.strokeStyle = p.color.replace('alpha', finalAlpha.toString());

      if (p.type === 'dot') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        if (isBoosted) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color.replace('alpha', isDark ? '0.6' : '0.4');
        }
        ctx.fill();
      } else {
        ctx.beginPath();
        const lineLen = isBoosted ? p.size * 2.5 : p.size * 2;
        ctx.lineWidth = isBoosted ? 2 : 1;
        ctx.moveTo(-lineLen, 0);
        ctx.lineTo(lineLen, 0);
        ctx.stroke();
      }
      ctx.restore();
    });

    drawConnections(ctx, particles.current, isDark, isBoosted);
    frameIdRef.current = requestAnimationFrame(animate);
  }, [drawConnections, reducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      const targetW = Math.floor(rect.width * dpr);
      const targetH = Math.floor(rect.height * dpr);

      if (canvasRef.current.width !== targetW || canvasRef.current.height !== targetH) {
          canvasRef.current.width = targetW;
          canvasRef.current.height = targetH;
          canvasRef.current.style.width = `${rect.width}px`;
          canvasRef.current.style.height = `${rect.height}px`;
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) ctx.scale(dpr, dpr);
          
          initParticles(rect.width, rect.height);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      mouse.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true
      };
    };

    const handleGlobalMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000, active: false };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('touchstart', handleGlobalMouseMove, { passive: true });
    window.addEventListener('touchmove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleGlobalMouseLeave);
    
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchstart', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave);
      cancelAnimationFrame(frameIdRef.current);
      mediaQuery.removeEventListener('change', listener);
    };
  }, [animate, initParticles]);

  if (reducedMotion) {
      return (
          <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:40px_40px]" />
          </div>
      );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        className="block"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none transition-colors duration-500" />
    </div>
  );
}
