import React from 'react';
import { Mail, ArrowUpRight, Code2 } from 'lucide-react';

export default function PortfolioContact() {
  return (
    <section id="contact" className="py-24 border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            {`// Let's Connect`}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 font-sans tracking-tight">
            Have an interesting problem?
          </h2>
          <p className="text-lg text-slate-300 font-mono">
            {`Let's build something worth talking about.`}
          </p>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed pt-2">
            Whether you want to discuss enterprise cybersecurity strategy, incident response architectures, business analytics modeling, or prospective technical roles — my inbox is always open.
          </p>
        </div>

        {/* Contact Links Card */}
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-2xl max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email link */}
            <a
              href="mailto:immanuel.0747@gmail.com"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <Mail size={18} className="text-cyan-400" />
                <ArrowUpRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <span className="text-xs font-mono uppercase text-slate-500 block">Direct Email</span>
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                immanuel.0747@gmail.com
              </span>
            </a>

            {/* GitHub Profile */}
            <a
              href="https://github.com/jatinsingh82"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <Code2 size={18} className="text-cyan-400" />
                <ArrowUpRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <span className="text-xs font-mono uppercase text-slate-500 block">Code Repositories</span>
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors font-mono">
                github.com/jatinsingh82
              </span>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500">
            <span>Location: India</span>
            <span>·</span>
            <span>Focus: Cyber Strategy & Engineering</span>
            <span>·</span>
            <span className="text-emerald-400">● Open to Dialogue</span>
          </div>
        </div>
      </div>
    </section>
  );
}
