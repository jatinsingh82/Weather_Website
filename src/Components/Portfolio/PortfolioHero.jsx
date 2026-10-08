import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Layers,
  Terminal,
  Lock,
  Binary
} from 'lucide-react';

export default function PortfolioHero({ onExploreCyberSim }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle ambient lighting / grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Direct Strategic Positioning */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Cyber Strategy & Transformation · Analyst</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 font-sans tracking-tight leading-[1.1]">
                Jatin Singh
              </h1>
              <p className="text-lg sm:text-xl font-mono text-cyan-400 font-medium">
                Cybersecurity × Technology × Business Strategy
              </p>
            </div>

            {/* Academic & Professional Dual-Track Foundation */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                B.Tech Computer Science Engineering
              </span>
              <span className="text-slate-600">+</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                MBA (IT) — Business Analytics
              </span>
            </div>

            {/* High-Impact Value Proposition Paragraph */}
            <p className="text-base text-slate-300 leading-relaxed font-sans max-w-xl">
              I build technology products and engineer systems at the intersection of{' '}
              <strong className="text-white font-semibold">cybersecurity architecture</strong>,{' '}
              <strong className="text-white font-semibold">data analytics</strong>, and{' '}
              <strong className="text-white font-semibold">executive business decision-making</strong>.
              I treat security not merely as technical compliance, but as operational resilience and strategic trust.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-md shadow-cyan-950"
              >
                <span>Explore Featured Work</span>
                <ArrowRight size={14} />
              </a>

              <button
                onClick={onExploreCyberSim}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xs"
              >
                <Terminal size={14} />
                <span>Launch CyberSim Lab</span>
              </button>

              <a
                href="https://github.com/jatinsingh82"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-mono text-xs border border-slate-800 transition-colors"
              >
                <span>GitHub</span>
                <ArrowUpRight size={13} className="text-slate-500" />
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Telemetry & Systems Blueprint Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-950/90 border border-slate-800 p-5 shadow-2xl space-y-4">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                  <span className="text-slate-400 text-[11px] ml-1">SYSTEM_TELEMETRY.IR</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              {/* Core System Triad Representation */}
              <div className="space-y-3 font-mono text-xs">
                {/* Node 1: Engineering */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                      <Cpu size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">SOFTWARE ARCHITECTURE</span>
                      <span className="text-[10px] text-slate-400 font-sans">Full-Stack React · Distributed Services</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    B.Tech CSE
                  </span>
                </div>

                {/* Node 2: Business Analytics */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400">
                      <Layers size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">BUSINESS & ANALYTICS</span>
                      <span className="text-[10px] text-slate-400 font-sans">Quantitative Modeling · Strategic Value</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    MBA (IT)
                  </span>
                </div>

                {/* Node 3: Cyber Defense */}
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-purple-950 border border-purple-800/80 flex items-center justify-center text-purple-400">
                      <Lock size={14} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">CYBERSECURITY STRATEGY</span>
                      <span className="text-[10px] text-slate-400 font-sans">Incident Decision Labs · Risk Governance</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                    Strategy
                  </span>
                </div>
              </div>

              {/* Bottom Telemetry Prompt */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Binary size={12} className="text-cyan-400" />
                  <span>Flagship: CyberSim Decision Lab</span>
                </span>
                <span className="text-slate-400">Deterministic Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
