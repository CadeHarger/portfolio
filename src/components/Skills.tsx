import { skills, certs } from '../data';

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Skills</SectionLabel>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-12">
          Technologies & tools
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6"
            >
              <h3 className="text-sm font-semibold text-slate-300 mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/8 hover:border-white/15 hover:text-slate-300 transition-all"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certs */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Certifications</h3>
          <div className="flex flex-wrap gap-3">
            {certs.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-4 py-2 rounded-lg border border-white/8"
              >
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3">
      {children}
    </p>
  );
}
