import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectIcon from '../components/ProjectIcon';
import { CardGlow, CornerBrackets, EdgeRails, LevelBackdrop } from '../components/GeoDecor';
import { experience, education, skills, certs, getYearsOfExperience, formatYOE } from '../data';

export default function ExperiencePage() {
  const yoe = formatYOE(getYearsOfExperience());
  return (
    <div className="min-h-screen bg-[#080c12]">
      <Navbar />
      <main className="relative pt-24 px-6 pb-24 overflow-hidden">
        <LevelBackdrop />
        <EdgeRails className="max-w-5xl left-1/2 -translate-x-1/2 opacity-55" />
        <div className="relative max-w-4xl mx-auto">

          {/* Header */}
          <header className="mb-16">
            <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="text-white/20 select-none">[</span>
              Career
              <span className="text-white/20 select-none">]</span>
            </p>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Experience
              </h1>
              <div className="inline-flex items-center gap-1.5 text-sm text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><span className="text-white font-medium">{yoe}</span> experience</span>
              </div>
            </div>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Software engineer with a focus on high-throughput systems, agentic AI, and full-stack product work.
            </p>
          </header>

          {/* Jobs */}
          <section className="mb-20">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-2 bottom-2 w-px bg-white/5 hidden sm:block" />

              <div className="space-y-10">
                {experience.map((job, i) => (
                  <div key={i} className="sm:pl-8 relative">
                    {/* Timeline dot — diamond shape (GD-inspired) */}
                    <div
                      className="absolute hidden sm:block"
                      style={{
                        left: 0,
                        top: 10,
                        width: 7,
                        height: 7,
                        border: '1px solid rgba(59,130,246,0.7)',
                        transform: 'translateX(-50%) rotate(45deg)',
                        background: 'rgba(59,130,246,0.25)',
                        boxShadow: '0 0 6px rgba(59,130,246,0.3)',
                      }}
                    />

                    <div className="group gd-platform-card rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all p-6 sm:p-8 relative overflow-hidden">
                      <CornerBrackets size={12} padding={6} animDelay={i * 0.5} />
                      <CardGlow variant={i} />
                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
                        <div className="flex items-start gap-4">
                          {job.icon && (
                            <ProjectIcon icon={job.icon} name={job.company} size="md" />
                          )}
                          <div>
                            <h2 className="text-white font-semibold text-xl leading-tight">{job.company}</h2>
                            <p className="text-blue-400 text-sm mt-1">{job.role}</p>
                          </div>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <span className="inline-block text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                            {job.period}
                          </span>
                          <p className="text-slate-500 text-xs mt-1.5">{job.location}</p>
                        </div>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-2.5 mb-6">
                        {job.bullets.map((b, j) => (
                          <li key={j} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                            <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-blue-500/60" />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {job.projectId && (
                        <div className="mt-5 pt-5 border-t border-white/5">
                          <Link
                            to={`/project/${job.projectId}`}
                            className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View project →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-20">
            <SectionLabel>Education</SectionLabel>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Academic background</h2>
            <div className="group gd-platform-card rounded-xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 relative overflow-hidden">
              <CornerBrackets size={12} padding={6} animDelay={0.3} />
              <CardGlow variant={1} />
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div className="flex items-start gap-4">
                  {education.icon && (
                    <img
                      src={education.icon}
                      alt={education.school}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-semibold text-lg">{education.school}</h3>
                    <p className="text-blue-400 text-sm mt-1">{education.degree}</p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="inline-block text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                    {education.period}
                  </span>
                  <p className="text-slate-500 text-xs mt-1.5">{education.location}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {education.involvement.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                    <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-blue-500/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-20">
            <SectionLabel>Skills</SectionLabel>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Technologies & tools</h2>
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              {Object.entries(skills).map(([category, items]) => (
                <div
                  key={category}
                  className="group gd-platform-card rounded-xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <CardGlow variant={category.length} />
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/[0.08] hover:border-white/20 hover:text-slate-300 transition-all"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Certs */}
            <div className="group gd-platform-card rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <CardGlow variant={2} />
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-3">
                {certs.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-lg border border-white/[0.08]"
                  >
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
      <span className="text-white/20 select-none">[</span>
      {children}
      <span className="text-white/20 select-none">]</span>
    </p>
  );
}
