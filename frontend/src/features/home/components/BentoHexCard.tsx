import React, { useState, useEffect } from 'react';
import type { HomeMatrixResource } from '../types/homeExternal.types';

export interface HexSlotData {
  id: number;
  resource: HomeMatrixResource | null;
  col: number;
  row: number;
  innerBond?: { x1: number; y1: number; x2: number; y2: number };
}

interface BentoHexCardProps {
  slot: HexSlotData;
  isFlipped: boolean;
  isAllFlipped: boolean;
  isLoading: boolean;
  onClick: (id: number) => void;
  onTouchStart: () => void;
  onMouseEnter: (id: number) => void;
}

export const BentoHexCard: React.FC<BentoHexCardProps> = ({
  slot,
  isFlipped,
  isAllFlipped,
  isLoading,
  onClick,
  onTouchStart,
  onMouseEnter,
}) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc = slot.resource?.logoUrl || '';
  const title = slot.resource?.title || 'Base de datos médica';

  useEffect(() => {
    setImageError(false);
  }, [slot.resource?.logoUrl]);

  const hasValidLogo = Boolean(logoSrc && !imageError);

  const cx = 65 + slot.col * 72;
  const cy = 50 + slot.row * 83.138 + (slot.col % 2 !== 0 ? 41.569 : 0);
  const leftPct = ((cx - 48) / 510) * 100;
  const topPct = ((cy - 41.569) / 360) * 100;
  const widthPct = (96 / 510) * 100;
  const heightPct = (83.138 / 360) * 100;

  const topColor = '#00a859';
  const botColor = '#008744';

  return (
    <div
      className="absolute cursor-pointer select-none touch-manipulation transition-all duration-200"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        perspective: '800px',
        zIndex: isFlipped ? 30 : 10,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      }}
      onClick={() => onClick(slot.id)}
      onTouchStart={onTouchStart}
      onMouseEnter={() => onMouseEnter(slot.id)}
      title={title}
      role="button"
      tabIndex={0}
      aria-label={`Recurso: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(slot.id);
        }
      }}
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 ease-out preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transitionDelay: isAllFlipped ? `${slot.col * 40 + slot.row * 30}ms` : '0ms',
        }}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <svg viewBox="0 0 96 83.14" className="w-full h-full drop-shadow-xs overflow-visible">
            <defs>
              <linearGradient id={`grad-${slot.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={topColor} />
                <stop offset="100%" stopColor={botColor} />
              </linearGradient>
            </defs>
            <polygon
              points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
              fill={`url(#grad-${slot.id})`}
              stroke="#0f172a"
              strokeWidth="2"
              className="transition-colors duration-200"
            />
            {slot.innerBond && (
              <line
                x1={slot.innerBond.x1}
                y1={slot.innerBond.y1}
                x2={slot.innerBond.x2}
                y2={slot.innerBond.y2}
                stroke="#8cf9a9"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.45"
              />
            )}
          </svg>
        </div>

        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <svg viewBox="0 0 96 83.14" className="w-full h-full drop-shadow-md overflow-hidden">
            <defs>
              <clipPath id={`hex-clip-${slot.id}`}>
                <polygon points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57" />
              </clipPath>
            </defs>
            <polygon
              points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
              fill={hasValidLogo ? "#ffffff" : "#0f172a"}
              stroke={hasValidLogo ? "#0f172a" : "#00a859"}
              strokeOpacity={hasValidLogo ? "0.15" : "1"}
              strokeWidth={hasValidLogo ? "1" : "2"}
            />
            {hasValidLogo && (
              <g clipPath={`url(#hex-clip-${slot.id})`}>
                <image
                  href={logoSrc}
                  x="12"
                  y="10"
                  width="72"
                  height="63"
                  preserveAspectRatio="xMidYMid meet"
                  onError={() => setImageError(true)}
                />
              </g>
            )}
          </svg>

          {!hasValidLogo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5 text-center select-none pointer-events-none">
              {isLoading || !slot.resource ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#008744]/30 border-t-[#8cf9a9] animate-spin" />
                  <span className="text-[#8cf9a9] font-bold text-[7px] tracking-wider uppercase">
                    Cargando...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-1 max-w-[78px]">
                  {slot.resource.primaryCourse && (
                    <span className="text-[#8cf9a9] font-black text-[7px] uppercase tracking-wider truncate max-w-[70px] mb-0.5">
                      {slot.resource.primaryCourse}
                    </span>
                  )}
                  <span className="text-white font-extrabold text-[8px] sm:text-[9px] leading-tight line-clamp-3 text-center">
                    {slot.resource.title}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
