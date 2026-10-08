import React from 'react';
import { ShieldCheck, Compass, BarChart3, Binary } from 'lucide-react';

export default function PortfolioAbout() {
  return (
    <section id="about" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              {'// Professional Philosophy'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              I like building at the intersection of technology and decisions.
            </h2>
            <p className="text-sm text-slate-400 font-mono leading-relaxed">
              Modern enterprises don’t fail from a lack of technical tools — they fail from disconnected decisions between security operations, technical infrastructure, and business leadership.
            </p>
          </div>

          {/* Right Column: Grounded Multi-Disciplinary Foundation */}
          <div className="lg:col-span-7 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
            <p>
              My background bridges dual worlds:{' '}
              <strong className="text-white font-semibold">Computer Science Engineering</strong> gave me the rigorous foundation in algorithms, systems architecture, and web development. Subsequently, pursuing an{' '}
              <strong className="text-white font-semibold">MBA in Information Technology and Business Analytics</strong> taught me how organizations prioritize risk, calculate capital costs, and justify operational trade-offs.
            </p>

            <p>
              Currently working as a{' '}
              <strong className="text-cyan-300 font-semibold">Cybersecurity Analyst in Cyber Strategy & Transformation</strong>, I focus on how organizations navigate complex threat landscapes, operationalize security frameworks, and translate technical indicators into executive clarity.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Binary size={15} />
                  <span>SYSTEMS ENGINEERING</span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Designing robust, maintainable React and full-stack software with strict state control and zero unnecessary bloat.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <ShieldCheck size={15} />
                  <span>CYBERSECURITY DEFENSE</span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Deep grounding in incident command, identity boundaries, network segmentation, and realistic threat trade-offs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <BarChart3 size={15} />
                  <span>BUSINESS ANALYTICS</span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Quantifying downtime, regulatory liability, and capital impact to turn technical data into leadership decisions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Compass size={15} />
                  <span>PRODUCT THINKING</span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Crafting refined interfaces that make complex data intuitive, actionable, and visually authoritative.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
