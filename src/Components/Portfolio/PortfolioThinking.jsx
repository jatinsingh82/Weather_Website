import React from 'react';
import { Wrench, BarChart2, ShieldCheck, RefreshCw } from 'lucide-react';

export default function PortfolioThinking() {
  const principles = [
    {
      title: 'Build Usable Systems',
      subtitle: 'Engineering',
      icon: Wrench,
      description:
        'Ideas are only as valuable as their execution. I turn conceptual architectures into responsive, resilient software that solves real friction for end users.',
      accent: 'border-cyan-500/30 text-cyan-400'
    },
    {
      title: 'Analyze Business Realities',
      subtitle: 'Analytics',
      icon: BarChart2,
      description:
        'Every technical decision carries an operational and capital price tag. I evaluate telemetry and risk through financial impact, downtime SLAs, and strategic return.',
      accent: 'border-blue-500/30 text-blue-400'
    },
    {
      title: 'Design for Hostile Environments',
      subtitle: 'Security',
      icon: ShieldCheck,
      description:
        'Zero-trust isn’t a marketing slogan — it’s assuming failure. I prioritize defense-in-depth, explicit identity verification, and graceful containment over brittle optimism.',
      accent: 'border-purple-500/30 text-purple-400'
    },
    {
      title: 'Iterate from Evidence',
      subtitle: 'Improvement',
      icon: RefreshCw,
      description:
        'Never cling to outdated dogma. Post-mortems, forensic telemetry, and user feedback drive the next hardening cycle and product evolution.',
      accent: 'border-emerald-500/30 text-emerald-400'
    }
  ];

  return (
    <section id="thinking" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              {'// Mental Models & Approach'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              I don't just build features. I think about the system around them.
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-sm">
            Four operating principles uniting engineering craftsmanship, cyber resilience, and business acumen.
          </p>
        </div>

        {/* 4 Thinking Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Icon size={19} className={p.accent.split(' ')[1]} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                      {p.subtitle}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 font-mono mt-0.5">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className={`pt-3 border-t border-slate-800 text-[10px] font-mono ${p.accent.split(' ')[1]}`}>
                  System Principle
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
