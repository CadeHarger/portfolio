import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { schoolProjects } from '../data';
import { CardGlow, CornerBrackets, EdgeRails, LevelBackdrop, SideOrnaments } from '../components/GeoDecor';

export default function SchoolProjectsPage() {
  return (
    <div className="min-h-screen bg-[#080c12]">
      <Navbar />
      <main className="relative pt-24 px-6 pb-24 overflow-hidden">
        <LevelBackdrop />
        <EdgeRails className="max-w-5xl left-1/2 -translate-x-1/2 opacity-50" />
        <SideOrnaments variant={2} className="opacity-75" />
        <div className="relative max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              School Projects
            </h1>
            <p className="text-slate-400 text-lg">
              Academic work from Trinity University (2021–2025)
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schoolProjects.map((project, i) => (
              <div
                key={project.name}
                className="group gd-platform-card flex flex-col rounded-xl border border-white/5 bg-white/[0.02] p-6 h-full hover:border-blue-500/20 transition-all"
              >
                <CardGlow variant={i} />
                <CornerBrackets size={12} padding={6} animDelay={0.2} />
                <h2 className="text-white font-semibold text-lg leading-tight mb-1">
                  {project.name}
                </h2>
                <p className="text-blue-400 text-xs mb-4">
                  {project.course} · {project.year}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.note && (
                  <p className="text-slate-500 text-xs italic">★ {project.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
