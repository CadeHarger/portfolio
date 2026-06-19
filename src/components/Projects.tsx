import { Link } from 'react-router-dom';
import { projects } from '../data';
import ProjectIcon from './ProjectIcon';
import { CardGlow, CornerBrackets, EdgeRails, SideOrnaments } from './GeoDecor';

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 px-6 overflow-hidden">
      <EdgeRails className="max-w-6xl left-1/2 -translate-x-1/2 opacity-60" />
      <SideOrnaments variant={2} />
      <div className="relative max-w-5xl mx-auto">
        <SectionLabel>Projects</SectionLabel>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-12">
          Things I've built
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} index={i} />
          ))}
        </div>

        <p className="text-center mt-10 text-slate-400 text-sm">
          See also:{' '}
          <Link to="/projects/school" className="text-blue-400 hover:text-blue-300 transition-colors">
            School Projects →
          </Link>
        </p>
      </div>
    </section>
  );
}

type Project = {
  id?: string;
  icon?: string;
  name: string;
  subtitle: string;
  period?: string;
  description: string;
  tags: string[];
  highlight: string;
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardContent = (
    <>
      {/* Corner brackets — GD platform framing */}
      <CornerBrackets size={12} padding={6} animDelay={index * 0.6} />
      <CardGlow variant={index} />

      <div className="mb-4">
        {project.icon && (
          <div className="mb-3">
            <ProjectIcon icon={project.icon} name={project.name} size="sm" />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-lg leading-tight">{project.name}</h3>
          {project.period && (
            <span className="text-xs font-mono text-slate-500 shrink-0 mt-0.5">{project.period}</span>
          )}
        </div>
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
        {project.id && (
          <p className="text-blue-400 text-sm mt-4">View project →</p>
        )}
      </div>
    </>
  );

  const className =
    'group gd-platform-card relative flex flex-col rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all p-6 h-full overflow-hidden hover:-translate-y-0.5';

  if (project.id) {
    return (
      <Link to={`/project/${project.id}`} className={className}>
        {cardContent}
      </Link>
    );
  }

  return <div className={className}>{cardContent}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-blue-400 text-xs font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
      {/* GD-style bracket decoration around section labels */}
      <span className="text-white/20 select-none">[</span>
      {children}
      <span className="text-white/20 select-none">]</span>
    </p>
  );
}
