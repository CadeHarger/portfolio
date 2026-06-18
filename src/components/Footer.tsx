export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
