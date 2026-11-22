import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { FeaturedWork } from './components/FeaturedWork.tsx';
import { Services } from './components/Services.tsx';
import { Explorations } from './components/Explorations.tsx';
import { About } from './components/About.tsx';
import { ToolsGrid } from './components/ToolsGrid.tsx';
import { Recommender } from './components/Recommender.tsx';
import { Stats } from './components/Stats.tsx';
import { Contact } from './components/Contact.tsx';
import { WorkArchivePage } from './components/WorkArchivePage.tsx';
import { ScrollToTopButton } from './components/ScrollToTopButton.tsx';
import { MagneticCursor } from './components/MagneticCursor.tsx';
import { ReadingProgressBar } from './components/ReadingProgressBar.tsx';
import { StickySectionHeader } from './components/StickySectionHeader.tsx';
import { SectionDivider } from './components/SectionDivider.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';

function shouldSkipLoadingInitially(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('autostart') === '1';
}

const LandingPage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    <ReadingProgressBar />
    <StickySectionHeader />
    <Hero />
    <FeaturedWork />
    <SectionDivider variant="wave" />
    <Services />
    <SectionDivider variant="step" />
    <Explorations />
    <SectionDivider variant="node" />
    <About />
    <SectionDivider variant="wave" />
    <ToolsGrid />
    <SectionDivider variant="step" />
    <Recommender />
    <SectionDivider variant="node" />
    <Stats />
    <SectionDivider variant="wave" />
    <Contact />
  </motion.div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(() => !shouldSkipLoadingInitially());
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading-screen" onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <Header onOpenCommandPalette={openCommandPalette} />

      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/work" element={<WorkArchivePage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onOpen={openCommandPalette}
        onClose={closeCommandPalette}
      />
      <ScrollToTopButton />
      <MagneticCursor />
    </div>
  );
}
