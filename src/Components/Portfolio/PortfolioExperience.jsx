import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PortfolioExperience() {
  return (
    <section id="experience" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              {'// Professional Career'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              Experience & Cyber Strategy
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-sm">
            Applied enterprise experience in Cyber Strategy, Risk, and Transformation.
          </p>
        </div>

        {/* Experience Timeline Item */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/30 space-y-6 max-w-4xl">
          {/* Timeline Node */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  CYBER STRATEGY & TRANSFORMATION
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-mono mt-0.5">
                  Cybersecurity Analyst
                </h3>
              </div>
              <div className="text-right text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-semibold block mb-1">
                  Deloitte
                </span>
                <span className="text-slate-500">Present</span>
              </div>
            </div>

            {/* Factual Narrative without fabricated metrics or claims */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Working within Deloitte’s <strong className="text-white font-semibold">Cyber Strategy & Transformation</strong> practice, advising organizations on evaluating security postures, aligning risk with business priorities, and operationalizing modern cybersecurity frameworks.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/5 font-sans">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Cyber Risk & Governance:</strong> Analyzing enterprise threat vectors and mapping defensive controls against industry frameworks (NIST CSF, ISO 27001).
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Strategic & Technical Translation:</strong> Bridging the communication gap between technical security operations (SOC, identity boundaries, network defense) and executive leadership stakeholders.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Business Impact & Resilience:</strong> Evaluating incident response procedures, operational continuity trade-offs, and risk exposure prioritization.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
