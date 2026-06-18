import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <div className="border-t border-white/5" />
        <Experience />
        <div className="border-t border-white/5" />
        <Projects />
        <div className="border-t border-white/5" />
        <Skills />
        <div className="border-t border-white/5" />
        <Education />
      </main>
      <Footer />
    </div>
  );
}
