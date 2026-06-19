import { Link } from 'react-router-dom';
import WordCloud3D from './WordCloud3D';
import { getYearsOfExperience, getCodingYears } from '../data';
import { ScanLine, CornerBrackets, EdgeRails, LevelBackdrop, PortalRing } from './GeoDecor';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 pt-14 overflow-hidden"
    >
      {/* ── Background layers (back to front) ─────────────────────────────── */}

      <LevelBackdrop dense />
      <EdgeRails className="max-w-7xl left-1/2 -translate-x-1/2" />

      {/* Scan lines sweeping top→bottom — like GD level laser floor */}
      <ScanLine />

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="relative max-w-6xl mx-auto w-full flex items-center gap-8">
        {/* Text column */}
        <div className="flex-1 min-w-0 relative">

          {/* Vertical accent bar — like the glowing edge of a GD platform */}
          <div
            className="absolute hidden lg:block"
            style={{
              left: -28,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 2,
              height: 110,
              background:
                'linear-gradient(to bottom, transparent, rgba(59,130,246,0.55), rgba(59,130,246,0.55), transparent)',
              animation: 'vline-glow 3.5s ease-in-out infinite',
            }}
          />

          <p className="text-blue-400 text-sm font-mono tracking-widest mb-6 uppercase">
            Software Engineer
          </p>

          {/* Name — framed with corner brackets like a GD target reticle */}
          <div className="relative inline-block mb-6">
            <CornerBrackets size={18} padding={-4} animDelay={0} />
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05] px-2 py-1">
              Cade<br />Harger
            </h1>
          </div>

          <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-10">
            Building Risk Management infrastructure and Agentic AI systems at{' '}
            <span className="text-slate-200">Deutsche Bank</span>. 
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/experience"
              className="group relative inline-flex items-center gap-2 overflow-hidden px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-70" />
              View Experience
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/CadeHarger"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-white/8 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/cadeharger"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-white/8 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:cade.harger@gmail.com"
                className="p-2.5 rounded-lg border border-white/8 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </div>

          {/* Location + YOE badges */}
          <div className="mt-12 flex items-center gap-5 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Raleigh, NC
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h4.073M15.75 3h5.25v5.25M10.5 13.5l10.25-10.25" />
              </svg>
              {getYearsOfExperience()} YOE
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              coding {getCodingYears()} years
            </div>
          </div>
        </div>

        {/* Word cloud column — hidden on small screens */}
        <div className="relative hidden lg:block flex-shrink-0 w-[460px]">
          <PortalRing className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={340} muted />
          <WordCloud3D />
        </div>
      </div>

      {/* Scroll hint — diamond replaced chevron (more GD-geometric) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-slate-600">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        {/* Animated stacked diamonds */}
        <div className="flex flex-col items-center gap-1">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              style={{
                width: 6,
                height: 6,
                border: '1px solid currentColor',
                transform: 'rotate(45deg)',
                animation: `bracket-pulse 1.5s ${delay}ms ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
