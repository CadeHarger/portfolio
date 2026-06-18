import { education } from '../data';

export default function Education() {
  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Education</SectionLabel>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-12">
          Academic background
        </h2>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
            <div>
              <h3 className="text-white font-semibold text-xl">{education.school}</h3>
              <p className="text-blue-400 text-sm mt-1">{education.degree}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                {education.period}
              </span>
              <p className="text-slate-500 text-xs mt-1.5">{education.location}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Involvement
            </p>
            <ul className="space-y-2">
              {education.involvement.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-400">
                  <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-blue-500/60" />
                  {item}
                </li>
              ))}
            </ul>
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
