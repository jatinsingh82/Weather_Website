import React from 'react';
import { Lock, ArrowUp } from 'lucide-react';

export default function PortfolioFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 bg-[#06090e] py-12 px-4 sm:px-6 text-xs font-mono text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lock size={14} />
          </div>
          <div>
            <span className="font-bold text-slate-200 block text-sm">JATIN SINGH</span>
            <span className="text-[11px] text-slate-500 font-sans">
              Cybersecurity × Technology × Business Strategy
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/jatinsingh82"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:immanuel.0747@gmail.com"
            className="hover:text-slate-300 transition-colors"
          >
            Email
          </a>
          <a
            href="#work"
            className="hover:text-slate-300 transition-colors"
          >
            Featured Work
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            title="Scroll to top of page"
          >
            <span>Top</span>
            <ArrowUp size={12} />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-slate-600 text-[11px]">
          © {new Date().getFullYear()} Jatin Singh. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
