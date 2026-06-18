import { nav } from '../data';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080c12]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#hero"
          className="text-sm font-semibold tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          Cade Harger
        </a>
        <nav className="flex items-center gap-6">
          {nav.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="mailto:cade.harger@gmail.com"
            className="text-sm px-4 py-1.5 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
