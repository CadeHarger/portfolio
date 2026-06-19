import { useEffect, useRef } from 'react';

const WORDS = [
  'Startup Founder',
  '$5K Funding',
  'Agentic AI',
  'Instant Payments',
  'Hazelcast Jet',
  'AutoML',
  'Music Discovery Agent',
  '24/7 Kalshi Bot',
  'Neural Network IDE',
  'Prediction Markets',
  'RAG Systems',
  'PyTorch',
  'Spring Boot',
  '$200K Contract',
  'NLP Research',
  'Google Cloud',
  'Full-Stack',
  'Cum Laude',
  '99.7% Speedup',
  'React',
  'CI/CD',
  'Risk Surveillance',
  'Deutsche Bank',
  'Electron',
  'Terraform',
  'Web Scraping',
  'Political Bias Research',
  'Data Science',
];

const BASE_RADIUS = 185;
const MAX_RADIUS = 320;
const PERSPECTIVE = 600;
const LERP = 0.06;

// Fibonacci lattice for uniform sphere distribution
function fibonacciSphere(n: number): [number, number][] {
  const pts: [number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const theta = golden * i;
    pts.push([Math.acos(y), theta]);
  }
  return pts;
}

function rotateX(x: number, y: number, z: number, angle: number): [number, number, number] {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateY(x: number, y: number, z: number, angle: number): [number, number, number] {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [x * c + z * s, y, -x * s + z * c];
}

export default function WordCloud3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    rotX: 0.3,
    rotY: 0,
    targetRotX: 0.3,
    targetRotY: 0,
    scrollRadius: BASE_RADIUS,
    targetScrollRadius: BASE_RADIUS,
    raf: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sphereCoords = fibonacciSphere(WORDS.length);
    const spans = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-word]'));

    let autoAngle = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      // Normalize mouse relative to viewport center so cloud responds everywhere in hero
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / (window.innerWidth / 2);
      const ny = (e.clientY - cy) / (window.innerHeight / 2);
      stateRef.current.targetRotY = nx * Math.PI * 0.6;
      stateRef.current.targetRotX = 0.3 + ny * Math.PI * 0.35;
      // suppress unused warning
      void rect;
    }

    function onScroll() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      // progress 0→1 as hero scrolls out of view
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      stateRef.current.targetScrollRadius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * progress;
    }

    function frame() {
      const s = stateRef.current;
      s.rotX += (s.targetRotX - s.rotX) * LERP;
      s.rotY += (s.targetRotY - s.rotY) * LERP;
      s.scrollRadius += (s.targetScrollRadius - s.scrollRadius) * LERP;

      autoAngle += 0.0015;
      const effectiveRotY = s.rotY + autoAngle;

      const r = s.scrollRadius;

      for (let i = 0; i < spans.length; i++) {
        const [phi, theta] = sphereCoords[i];
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.cos(phi);
        let z = r * Math.sin(phi) * Math.sin(theta);

        [x, y, z] = rotateX(x, y, z, s.rotX);
        [x, y, z] = rotateY(x, y, z, effectiveRotY);

        const scale = PERSPECTIVE / (PERSPECTIVE - z);
        const px = x * scale;
        const py = y * scale;

        // depth: -1 (back) to 1 (front)
        const depth = (z + r) / (2 * r);
        const opacity = 0.2 + depth * 0.8;
        const fontSize = 10 + depth * 7;

        const el = spans[i];
        el.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px)`;
        el.style.opacity = String(opacity.toFixed(3));
        el.style.fontSize = `${fontSize.toFixed(1)}px`;
        el.style.zIndex = String(Math.round(depth * 100));
      }

      s.raf = requestAnimationFrame(frame);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    stateRef.current.raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(stateRef.current.raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: `${PERSPECTIVE}px`, minHeight: '460px' }}
      aria-hidden="true"
    >
      {WORDS.map((word) => (
        <span
          key={word}
          data-word
          className="absolute left-1/2 top-1/2 whitespace-nowrap font-semibold text-blue-300/90 cursor-default pointer-events-none transition-colors"
          style={{
            transform: 'translate(-50%, -50%)',
            willChange: 'transform, opacity, font-size',
            letterSpacing: '0.02em',
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
