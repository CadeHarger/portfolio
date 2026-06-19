export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      <div className="pointer-events-none absolute right-8 top-6 hidden h-10 w-10 rotate-45 border border-white/8 md:block" />
      <div className="relative max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-semibold tracking-tight">Cade Harger</p>
          <p className="text-slate-500 text-sm mt-1">Software Engineer · Raleigh, NC</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:cade.harger@gmail.com"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            cade.harger@gmail.com
          </a>
          <span className="text-white/10">·</span>
          <a
            href="https://github.com/CadeHarger"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span className="text-white/10">·</span>
          <a
            href="https://linkedin.com/in/cadeharger"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
