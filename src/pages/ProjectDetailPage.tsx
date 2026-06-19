import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectIcon from '../components/ProjectIcon';
import { CardGlow, CornerBrackets, EdgeRails, LevelBackdrop, PortalRing, SideOrnaments } from '../components/GeoDecor';
import { projectDetails } from '../data';

function Lightbox({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-5 text-slate-400 hover:text-white text-3xl leading-none transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <img
        src={src}
        alt={caption}
        className="max-w-full max-h-[80vh] rounded-xl border border-white/10 shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {caption && (
        <p className="mt-4 text-slate-400 text-sm text-center max-w-2xl" onClick={(e) => e.stopPropagation()}>
          {caption}
        </p>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectDetails.find((p) => p.id === projectId);
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#080c12]">
        <Navbar />
        <main className="pt-24 px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
            <p className="text-slate-400">The project you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c12]">
      <Navbar />
      <main className="relative pt-24 px-6 pb-24 overflow-hidden">
        <LevelBackdrop />
        <EdgeRails className="max-w-5xl left-1/2 -translate-x-1/2 opacity-50" />
        <SideOrnaments variant={1} className="opacity-75" />
        <PortalRing className="right-[7%] top-28 hidden lg:block" size={118} muted />
        <div className="relative max-w-4xl mx-auto">
          <header className="group gd-platform-card mb-12 rounded-2xl border border-white/5 bg-white/[0.018] p-6 sm:p-7">
            <CardGlow variant={1} />
            <CornerBrackets size={14} padding={8} animDelay={0.1} />
            <div className="flex items-center gap-5 mb-4">
              <ProjectIcon icon={project.icon} name={project.name} size="lg" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {project.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-blue-400 text-sm">{project.subtitle}</p>
                  {project.period && (
                    <span className="text-xs font-mono text-slate-500">{project.period}</span>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/8 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>

          {(project.links.length > 0 || project.pdfUrl) && (
            <div className="flex flex-wrap gap-2 mb-12">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-blue-600/70 hover:bg-blue-600 text-blue-100 font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
                >
                  {link.label}
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
              {project.pdfUrl && (
                <a
                  href={project.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-slate-400 hover:text-slate-200 font-medium transition-all"
                >
                  View Paper
                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-5">Highlights</h2>
              <div className="group gd-platform-card rounded-xl border border-white/5 bg-white/[0.02] p-6 sm:p-7">
                <CardGlow variant={2} />
                <ul className="space-y-2.5">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <div className="space-y-5 mb-16">
            {project.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-slate-300 leading-relaxed [&_.inline-link]:text-slate-200 [&_.inline-link]:underline [&_.inline-link]:underline-offset-2 [&_.inline-link]:decoration-white/25 [&_.inline-link:hover]:text-white [&_.inline-link:hover]:decoration-white/60 [&_.inline-link]:transition-colors"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>

          {project.features && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Features</h2>
              <div className="space-y-8">
                {project.features.map((feature, i) => (
                  <div key={feature.category} className="group gd-platform-card rounded-xl border border-white/5 bg-white/[0.018] p-5">
                    <CardGlow variant={i} />
                    <h3 className="text-white font-semibold mb-3">{feature.category}</h3>
                    <ul className="space-y-2">
                      {feature.items.map((item) => (
                        <li key={item} className="text-slate-300 text-sm leading-relaxed flex gap-2">
                          <span className="text-blue-400 shrink-0">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.images.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.map((image, i) => (
                  <figure key={image.src} className="group">
                    <button
                      className="relative w-full overflow-hidden rounded-xl text-left"
                      onClick={() => setLightbox({ src: image.src, caption: image.caption })}
                      aria-label={`Expand: ${image.caption}`}
                    >
                      <CardGlow variant={i + 1} />
                      <img
                        src={image.src}
                        alt={image.caption}
                        className="w-full rounded-xl border border-white/5 group-hover:border-blue-500/30 group-hover:brightness-110 transition-all cursor-zoom-in"
                      />
                    </button>
                    <figcaption className="text-slate-500 text-sm mt-2 leading-relaxed">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      {lightbox && <Lightbox src={lightbox.src} caption={lightbox.caption} onClose={closeLightbox} />}
    </div>
  );
}
