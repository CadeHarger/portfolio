import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { nav } from '../data';

const PAGE_ROUTES = ['/experience'];

export default function Navbar() {
  const location = useLocation();
  const isDetailRoute =
    location.pathname.startsWith('/project') ||
    location.pathname === '/projects/school' ||
    PAGE_ROUTES.includes(location.pathname);

  const [nameVisible, setNameVisible] = useState(isDetailRoute);

  useEffect(() => {
    if (isDetailRoute) {
      setNameVisible(true);
      return;
    }
    function onScroll() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      // fade in once the bottom of the hero clears the top of the viewport
      setNameVisible(hero.getBoundingClientRect().bottom < 80);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDetailRoute]);

  return (
    <header className="gd-nav-glow fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#080c12]/80 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/25 to-transparent" />
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className={`text-sm font-semibold tracking-tight text-white hover:text-blue-400 transition-all duration-500 ${nameVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          Cade Harger
        </Link>
        <nav className="flex items-center gap-6">
          {isDetailRoute ? (
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Portfolio
            </Link>
          ) : (
            nav.map((item) => {
              if (item === 'Experience') {
                return (
                  <Link
                    key={item}
                    to="/experience"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                );
              }
              return (
                <button
                  key={item}
                  onClick={() =>
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  {item}
                </button>
              );
            })
          )}
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
