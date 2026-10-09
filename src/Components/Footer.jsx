import React from 'react';
import { SunMedium, ArrowUp, ShieldCheck } from 'lucide-react';

export default function Footer({ lastUpdated, unit }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '--:--';

  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950 py-10 px-4 sm:px-6 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Attribution */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <SunMedium size={16} />
          </div>
          <div>
            <span className="font-extrabold text-slate-200 block text-sm tracking-tight font-sans">
              WEATHER<span className="text-cyan-400">NOW</span> PLATFORM
            </span>
            <span className="text-[11px] text-slate-500">
              Powered by Open-Meteo High-Resolution Forecasting & RainViewer Doppler
            </span>
          </div>
        </div>

        {/* Telemetry info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400">
          <span>Active Units: °{unit} ({unit === 'C' ? 'Metric' : 'Imperial'})</span>
          <span>•</span>
          <span>Last Updated: {formattedTime}</span>
          <span>•</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
