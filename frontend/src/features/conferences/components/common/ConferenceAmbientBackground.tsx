import React, { useEffect, useRef } from 'react';

export const ConferenceAmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let step = 0;
    let animId: number;

    const waves = [
      { color: 'rgba(0, 135, 68, 0.10)', amplitude: 42, speed: 0.010, frequency: 0.0032, yOffset: 0.22 },
      { color: 'rgba(0, 168, 89, 0.12)', amplitude: 52, speed: 0.016, frequency: 0.0026, yOffset: 0.52 },
      { color: 'rgba(0, 135, 68, 0.10)', amplitude: 38, speed: 0.012, frequency: 0.0038, yOffset: 0.74 },
    ];

    const resizeCanvas = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderWaves = () => {
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(0.5, '#ffffff');
      bg.addColorStop(1, '#ffffff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      waves.forEach((w, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        const currentY = height * w.yOffset;
        const phase = step * w.speed + idx * 1.8;

        for (let x = 0; x <= width; x += 10) {
          const y =
            currentY +
            Math.sin(x * w.frequency + phase) * w.amplitude +
            Math.cos(x * w.frequency * 0.5 + phase * 0.7) * (w.amplitude * 0.4);

          if (x === 0) ctx.lineTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      const lightX = width * (0.5 + Math.sin(step * 0.006) * 0.28);
      const lightY = height * (0.4 + Math.cos(step * 0.008) * 0.22);
      const radGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, width * 0.45);
      radGrad.addColorStop(0, 'rgba(0, 135, 68, 0.15)');
      radGrad.addColorStop(0.5, 'rgba(0, 135, 68, 0.05)');
      radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      if (!prefersReduced) {
        step++;
        animId = requestAnimationFrame(renderWaves);
      }
    };

    renderWaves();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85" />
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div
        className="absolute text-[#008744] opacity-55 pointer-events-none select-none anim-gentle"
        style={{ top: '12%', left: '5%' }}
        title="Base de Datos Médica"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      </div>

      <div
        className="absolute text-[#008744] opacity-55 pointer-events-none select-none anim-reverse"
        style={{ top: '14%', right: '6%' }}
        title="Libro / Literatura Médica"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>

      <div
        className="absolute text-[#008744] opacity-55 pointer-events-none select-none anim-slow"
        style={{ top: '40%', left: '4%' }}
        title="Estetoscopio Clínico"
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 2.5v5a7.5 7.5 0 0 0 15 0v-5" />
          <path d="M12 15v2a3.5 3.5 0 0 0 3.5 3.5h0.5a3.5 3.5 0 0 0 3.5-3.5v-2" />
          <circle cx="19.5" cy="15" r="2.5" fill="rgba(0, 135, 68, 0.25)" />
          <path d="M3.5 2.5h2" />
          <path d="M18.5 2.5h2" />
        </svg>
      </div>

      <div
        className="absolute text-[#008744] opacity-55 pointer-events-none select-none anim-gentle"
        style={{ top: '42%', right: '5%' }}
        title="Pulso Cardiaco (EKG)"
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>

      <div
        className="absolute text-[#008744] opacity-50 pointer-events-none select-none anim-reverse"
        style={{ bottom: '14%', right: '7%' }}
        title="Cruz Médica"
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="3" width="6" height="18" rx="1.5" fill="rgba(0, 135, 68, 0.15)" />
          <rect x="3" y="9" width="18" height="6" rx="1.5" fill="rgba(0, 135, 68, 0.15)" />
        </svg>
      </div>

      <div
        className="absolute text-[#008744] opacity-55 pointer-events-none select-none anim-slow"
        style={{ bottom: '12%', left: '6%' }}
        title="Símbolo Oficial de Medicina (Vara de Esculapio)"
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <circle cx="12" cy="2" r="1.3" fill="currentColor" />
          <path d="M7.8 5.5c1.8-2 5.5-1.5 5.5 1.5 0 2.5-4.5 3.5-4 6.5s5 2 4.5 5-3.5 2-4 2.5" />
          <path d="M7.6 5.5l1.6-1.2" />
        </svg>
      </div>
    </div>
  );
};
