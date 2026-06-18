import { projects } from '../data';

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Projects</SectionLabel>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-12">
          Things I've built
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Project = {
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  highlight: string;
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all p-6 h-full">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg leading-tight">{project.name}</h3>
        <p className="text-blue-400 text-xs mt-1">{project.subtitle}</p>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">{project.description}</p>

      <div className="mt-auto">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-slate-500 text-xs font-mono">{project.highlight}</p>
      </div>
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
