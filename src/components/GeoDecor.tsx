import type { CSSProperties } from 'react';

/**
 * GeoDecor - non-intrusive geometric decorations inspired by GD level design.
 * All elements are pointer-events-none overlays; use inside relative containers.
 */

// ── Deterministic particle layout ──────────────────────────────────────────
const PARTICLES = [
  { x:  5, y: 12, type: 'tri', size:  9, rot:   0, delay:   0, dur: 14 },
  { x: 18, y: 64, type: 'dia', size:  6, rot:  45, delay:  -4, dur: 11 },
  { x: 28, y: 30, type: 'sq',  size:  7, rot:  20, delay:  -8, dur: 15 },
  { x: 74, y: 14, type: 'tri', size:  8, rot: 180, delay:  -6, dur: 12 },
  { x: 83, y: 73, type: 'dia', size:  7, rot:  45, delay:  -2, dur: 16 },
  { x: 44, y: 82, type: 'sq',  size:  5, rot:  35, delay:  -9, dur: 10 },
  { x: 61, y: 39, type: 'tri', size: 10, rot:  60, delay:  -5, dur: 13 },
  { x: 10, y: 80, type: 'dia', size:  6, rot:  45, delay:  -7, dur: 15 },
  { x: 91, y: 36, type: 'sq',  size:  8, rot:  10, delay:  -1, dur: 12 },
  { x: 35, y:  6, type: 'tri', size:  7, rot: 120, delay: -11, dur: 11 },
  { x: 52, y: 91, type: 'dia', size:  5, rot:  45, delay:  -3, dur: 14 },
  { x: 69, y: 57, type: 'tri', size:  6, rot: 240, delay: -10, dur: 15 },
] as const;

type Beam = {
  top: string;
  width: number;
  rot: number;
  delay: string;
  tone: 'blue' | 'white';
  left?: string;
  right?: string;
};

const BEAMS: Beam[] = [
  { top: '17%', left: '-8%', width: 420, rot: -4, delay: '-2s', tone: 'blue' },
  { top: '36%', right: '6%', width: 360, rot: -12, delay: '-7s', tone: 'white' },
  { top: '58%', left: '8%', width: 240, rot: 7, delay: '-11s', tone: 'blue' },
  { top: '78%', right: '-6%', width: 300, rot: 5, delay: '-15s', tone: 'white' },
] as const;

/**
 * Floating outline triangles/diamonds/squares - low-contrast background decoration.
 * Place as an absolute child inside an overflow-hidden relative container.
 */
export function GeometricParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `geo-float ${p.dur}s ${p.delay}s infinite linear`,
            opacity: 0.07,
          }}
        >
          {p.type === 'tri' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 10 10"
              fill="none"
              style={{ transform: `rotate(${p.rot}deg)`, display: 'block' }}
            >
              <polygon
                points="5,1 9,9 1,9"
                stroke="white"
                strokeWidth="1.3"
                fill="none"
              />
            </svg>
          )}
          {p.type === 'dia' && (
            <div
              style={{
                width: p.size,
                height: p.size,
                border: '1px solid white',
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {p.type === 'sq' && (
            <div
              style={{
                width: p.size,
                height: p.size,
                border: '1px solid white',
                transform: `rotate(${p.rot}deg)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// -- Level-scale background dressing ----------------------------------------

export function LevelBackdrop({ dense = false }: { dense?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 gd-circuit-grid opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_74%_42%,rgba(255,255,255,0.055),transparent_24%),radial-gradient(circle_at_50%_90%,rgba(37,99,235,0.08),transparent_30%)]" />
      <BeamField />
      {dense && (
        <>
          <PortalRing className="left-[4%] top-[18%] hidden md:block" size={86} />
          <PortalRing className="right-[8%] bottom-[14%] hidden lg:block" size={112} delay="-4s" muted />
        </>
      )}
    </div>
  );
}

export function BeamField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {BEAMS.map((beam, i) => {
        const style: CSSProperties = {
          top: beam.top,
          width: beam.width,
          transform: `rotate(${beam.rot}deg)`,
          animationDelay: beam.delay,
          ...(beam.left ? { left: beam.left } : { right: beam.right }),
        };

        return (
          <div
            key={i}
            className={`gd-beam absolute h-px ${beam.tone === 'blue' ? 'gd-beam-blue' : 'gd-beam-white'}`}
            style={style}
          />
        );
      })}
    </div>
  );
}

export function EdgeRails({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div className="gd-rail absolute left-0 top-16 bottom-12 w-px" />
      <div className="gd-rail absolute right-0 top-28 bottom-24 w-px opacity-70" />
      <div className="absolute left-0 top-[18%] h-px w-20 bg-gradient-to-r from-blue-400/30 to-transparent" />
      <div className="absolute right-0 top-[63%] h-px w-24 bg-gradient-to-l from-white/18 to-transparent" />
    </div>
  );
}

export function SideOrnaments({
  className = '',
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const leftSteps = variant % 2 === 0
    ? ['top-[18%] w-12', 'top-[31%] w-7', 'top-[74%] w-10']
    : ['top-[24%] w-8', 'top-[48%] w-12', 'top-[82%] w-6'];
  const rightSteps = variant % 2 === 0
    ? ['top-[26%] w-9', 'top-[56%] w-12', 'top-[86%] w-7']
    : ['top-[14%] w-11', 'top-[39%] w-6', 'top-[68%] w-10'];

  return (
    <div className={`absolute inset-y-0 inset-x-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute left-4 md:left-8 top-10 bottom-10 hidden w-20 md:block">
        <div className="gd-side-rail absolute left-0 top-0 bottom-0 w-px" />
        <div className="gd-side-node absolute left-[-3px] top-[12%]" />
        <div className="gd-side-node absolute left-[-3px] top-[63%]" />
        {leftSteps.map((step, i) => (
          <div
            key={step}
            className={`gd-step-mark absolute left-0 h-px ${step}`}
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </div>

      <div className="absolute right-4 md:right-8 top-16 bottom-14 hidden w-20 md:block">
        <div className="gd-side-rail absolute right-0 top-0 bottom-0 w-px opacity-70" />
        <div className="gd-side-node absolute right-[-3px] top-[22%]" />
        <div className="gd-side-node absolute right-[-3px] top-[79%]" />
        {rightSteps.map((step, i) => (
          <div
            key={step}
            className={`gd-step-mark absolute right-0 h-px ${step}`}
            style={{ animationDelay: `${0.35 + i * 0.7}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function PortalRing({
  className = '',
  size = 96,
  delay = '0s',
  muted = false,
}: {
  className?: string;
  size?: number;
  delay?: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`absolute ${muted ? 'opacity-20' : 'opacity-35'} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full gd-portal" style={{ animationDelay: delay }}>
        <div className="absolute inset-2 rounded-full border border-blue-300/20" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />
      </div>
    </div>
  );
}

export function CardGlow({ variant = 0 }: { variant?: number }) {
  const sheenClass = ['gd-card-sheen', 'gd-card-sheen-offset', 'gd-card-sheen-orbit'][variant % 3];
  const lineClass = [
    'via-white/20',
    'via-blue-300/25',
    'via-white/12',
  ][variant % 3];

  return (
    <>
      <div className={`${sheenClass} pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden="true" />
      <div className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${lineClass} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden="true" />
    </>
  );
}

// ── Corner bracket reticle ──────────────────────────────────────────────────

interface CornerBracketsProps {
  size?: number;
  padding?: number;
  animDelay?: number;
  className?: string;
}

/**
 * Four L-shaped corner brackets framing a card — like GD rectangular platform outlines.
 * Requires the parent to have `relative` and `overflow-hidden` (or `overflow-visible`).
 */
export function CornerBrackets({
  size = 14,
  padding = 8,
  animDelay = 0,
  className = '',
}: CornerBracketsProps) {
  const color = 'rgba(255,255,255,0.22)';
  const anim = `bracket-pulse 4s ${animDelay}s ease-in-out infinite`;
  const p = padding;

  const corner = (pos: CSSProperties): CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    animation: anim,
    ...pos,
  });

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div style={corner({ top: p, left: p,     borderTop:    `1px solid ${color}`, borderLeft:   `1px solid ${color}` })} />
      <div style={corner({ top: p, right: p,    borderTop:    `1px solid ${color}`, borderRight:  `1px solid ${color}` })} />
      <div style={corner({ bottom: p, left: p,  borderBottom: `1px solid ${color}`, borderLeft:   `1px solid ${color}` })} />
      <div style={corner({ bottom: p, right: p, borderBottom: `1px solid ${color}`, borderRight:  `1px solid ${color}` })} />
    </div>
  );
}

// ── Scan line ───────────────────────────────────────────────────────────────

/**
 * Two offset scan lines that sweep from top to bottom — like GD floor/ceiling lasers.
 * Place inside an overflow-hidden container.
 */
export function ScanLine() {
  const lineStyle = (offset: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    background:
      'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.03) 80%, transparent 100%)',
    animation: `scan-sweep 20s ${offset} linear infinite`,
    pointerEvents: 'none',
  });

  return (
    <>
      <div style={lineStyle('0s')} />
      <div style={lineStyle('-10s')} />
    </>
  );
}

// ── Section divider ─────────────────────────────────────────────────────────

/**
 * Diamond-center section divider - like the decorative accent marks between GD platforms.
 */
export function GDDivider() {
  return (
    <div className="flex items-center px-6 py-0.5">
      <div
        className="flex-1 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.08) 100%)',
        }}
      />
      <div className="mx-4 shrink-0 flex items-center gap-2">
        <div
          style={{
            width: 4,
            height: 4,
            border: '1px solid rgba(255,255,255,0.18)',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          style={{
            width: 6,
            height: 6,
            border: '1px solid rgba(255,255,255,0.22)',
            animation: 'diamond-spin 12s linear infinite',
          }}
        />
        <div
          style={{
            width: 4,
            height: 4,
            border: '1px solid rgba(255,255,255,0.18)',
            transform: 'rotate(45deg)',
          }}
        />
      </div>
      <div
        className="flex-1 h-px"
        style={{
          background:
            'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.08) 100%)',
        }}
      />
    </div>
  );
}
