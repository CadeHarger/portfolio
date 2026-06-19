import { Link } from 'react-router-dom';
import { CardGlow, CornerBrackets, PortalRing, SideOrnaments } from './GeoDecor';

export default function Bio() {
  return (
    <section id="bio" className="relative py-24 px-6 overflow-hidden">
      <PortalRing className="-left-10 top-20 hidden lg:block" size={150} muted />
      <SideOrnaments variant={1} className="opacity-80" />
      <div className="relative max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

          {/* Photo */}
          <div className="shrink-0 relative group">
            {/* Pixelated speech bubble */}
            <img
              src="/pixel-speech-bubble.png"
              alt="Hi there!"
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none select-none z-10"
              style={{ width: 160, bottom: '70%', left: '55%', imageRendering: 'pixelated' }}
            />

            <img
              src="/ProfilePic.jpg"
              alt="Cade Harger"
              className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl object-cover border border-white/10 shadow-xl shadow-blue-950/20"
            />
            <CornerBrackets size={18} padding={-8} animDelay={0.4} />
          </div>

          {/* Text */}
          <div className="group gd-platform-card flex-1 rounded-2xl border border-white/5 bg-white/[0.018] p-6 sm:p-8">
            <CardGlow variant={1} />
            <CornerBrackets size={14} padding={8} animDelay={0.2} />
            <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3">About</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
              Hi, I'm Cade.
            </h2>

            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                I'm a software engineer at Deutsche Bank, where I build risk management infrastructure and architect agentic AI
                systems for risk surveillance. I graduated cum laude from Trinity University
                in 2025 with a B.S. in Computer Science and a minor in Data Science.
              </p>
              <p>
                Outside of work I spend much of my time building. My projects range from{' '}
                <Link to="/project/scepter" className="text-slate-300 hover:text-white transition-colors underline underline-offset-2 decoration-white/20">
                  a fully-agentic AutoML forecasting platform
                </Link>{' '}
                to{' '}
                <Link to="/project/cathode" className="text-slate-300 hover:text-white transition-colors underline underline-offset-2 decoration-white/20">
                  a RAG-powered music discovery app
                </Link>{' '}
                to{' '}
                <Link to="/project/glassbrain" className="text-slate-300 hover:text-white transition-colors underline underline-offset-2 decoration-white/20">
                  a visual programming language for neural networks
                </Link>{' '}
                that won me $5K in pre-seed funding during college. With the rest of my time, you can find me playing chess, going hiking, playing volleyball, or going out with friends.
              </p>
              <p>
                I'm most excited by problems at the intersection of AI and big data systems, especially predictive ones. I love working on the cutting edge of what's possible.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/experience"
                className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                Experience & Skills →
              </Link>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer bg-transparent"
              >
                View Projects →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
