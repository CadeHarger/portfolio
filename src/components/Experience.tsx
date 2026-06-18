import { experience } from '../data';

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Experience</SectionLabel>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-12">
          Where I've worked
        </h2>

        <div className="space-y-1">
          {experience.map((job, i) => (
            <ExperienceCard key={i} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Job = {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
};

function ExperienceCard({ job }: { job: Job }) {
  return (
    <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-5">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">{job.company}</h3>
          <p className="text-blue-400 text-sm mt-1">{job.role}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-block text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full">
            {job.period}
          </span>
          <p className="text-slate-500 text-xs mt-1.5">{job.location}</p>
        </div>
      </div>
      <ul className="space-y-2.5">
        {job.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
            <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-blue-500/60" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3">
      {children}
    </p>
  );
}
