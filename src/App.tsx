import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bio from './components/Bio';
import Projects from './components/Projects';
import Footer from './components/Footer';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SchoolProjectsPage from './pages/SchoolProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import { GDDivider } from './components/GeoDecor';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <GDDivider />
        <Bio />
        <GDDivider />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<><ScrollToTop /><MainLayout /></>} />
      <Route path="/experience" element={<><ScrollToTop /><ExperiencePage /></>} />
      <Route path="/project/:projectId" element={<><ScrollToTop /><ProjectDetailPage /></>} />
      <Route path="/projects/school" element={<><ScrollToTop /><SchoolProjectsPage /></>} />
    </Routes>
  );
}
