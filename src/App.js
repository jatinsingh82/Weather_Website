import React, { useState } from 'react';
import PortfolioNavbar from './Components/Portfolio/PortfolioNavbar';
import PortfolioHero from './Components/Portfolio/PortfolioHero';
import PortfolioAbout from './Components/Portfolio/PortfolioAbout';
import PortfolioProjects from './Components/Portfolio/PortfolioProjects';
import PortfolioExperience from './Components/Portfolio/PortfolioExperience';
import PortfolioSkills from './Components/Portfolio/PortfolioSkills';
import PortfolioJourney from './Components/Portfolio/PortfolioJourney';
import PortfolioThinking from './Components/Portfolio/PortfolioThinking';
import PortfolioContact from './Components/Portfolio/PortfolioContact';
import PortfolioFooter from './Components/Portfolio/PortfolioFooter';
import CyberSimApp from './Components/CyberSimApp/CyberSimApp';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState('portfolio');

  if (viewMode === 'cybersim') {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100">
        {/* Floating Return to Portfolio Banner */}
        <div className="sticky top-0 z-50 bg-slate-900 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-bold">CYBERSIM INCIDENT SIMULATION LAB</span>
            <span className="text-slate-500 hidden sm:inline">| Interactive Mode</span>
          </div>
          <button
            onClick={() => setViewMode('portfolio')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* Full CyberSim Simulator */}
        <CyberSimApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Navigation */}
      <PortfolioNavbar />

      {/* Main Portfolio Sections */}
      <main className="flex-1">
        <PortfolioHero onExploreCyberSim={() => setViewMode('cybersim')} />
        <PortfolioAbout />
        <PortfolioProjects onLaunchCyberSim={() => setViewMode('cybersim')} />
        <PortfolioExperience />
        <PortfolioSkills />
        <PortfolioJourney />
        <PortfolioThinking />
        <PortfolioContact />
      </main>

      {/* Footer */}
      <PortfolioFooter />
    </div>
  );
}

export default App;
