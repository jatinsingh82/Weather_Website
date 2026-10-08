import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Terminal,
  CloudRain,
  Briefcase,
  Globe,
  CheckCircle2
} from 'lucide-react';

export default function PortfolioProjects({ onLaunchCyberSim }) {
  return (
    <section id="work" className="py-24 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              {'// Selected Engineering Work'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              Featured Systems & Applications
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-sm">
            Story-driven case studies illustrating architecture, threat modeling, API engineering, and business context.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* FLAGSHIP PROJECT: CYBERSIM (Visually Dominant Case Study)          */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-cyan-950/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top Pill Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                FLAGSHIP PROJECT
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-semibold">Incident Decision Lab</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Deterministic Engine</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">NIST SP 800-61 & MITRE ATT&CK</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Narrative: Storytelling */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-3xl font-black text-slate-100 font-mono tracking-tight flex items-center gap-2">
                  <ShieldAlert size={28} className="text-cyan-400" />
                  CYBERSIM
                </h3>
                <p className="text-sm font-mono text-cyan-300 mt-1 font-medium">
                  Interactive Cybersecurity Incident Decision Lab
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Most cybersecurity learning tools are static multiple-choice quizzes that fail to convey the agonizing trade-offs of incident response. CyberSim places the user in the role of an enterprise Incident Commander during an evolving multi-vector attack. Every tactical directive changes the security posture, operational downtime, data exfiltration, capital loss, and executive outcome.
              </p>

              {/* Problem / Approach / Outcome Grid */}
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <strong className="text-cyan-400 font-mono block">THE PROBLEM:</strong>
                  <span className="text-slate-300">
                    Security teams frequently operate in a silo: engineers want total network shutdown to guarantee containment, while C-suite executives cannot tolerate millions of dollars in business downtime.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <strong className="text-cyan-400 font-mono block">THE APPROACH & ARCHITECTURE:</strong>
                  <span className="text-slate-300">
                    Engineered a deterministic state machine modeling telemetry alerts, IOCs, and multi-branch decision trees. Configured real-world enterprise scenarios including Enterprise Ransomware (LockBit), Cloud IAM Exfiltration, and Phishing Session Hijacking (Evilginx AiTM).
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <strong className="text-cyan-400 font-mono block">THE OUTCOME:</strong>
                  <span className="text-slate-300">
                    Provides a live HUD tracking Security Posture, Business Continuity, Capital Impact ($), and Downtime Hours, culminating in an executive NIST-aligned post-mortem scorecard.
                  </span>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {['React 18', 'JavaScript ES6+', 'Deterministic Engine', 'NIST SP 800-61', 'MITRE ATT&CK', 'Tailwind CSS'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={onLaunchCyberSim}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs transition-all shadow-md shadow-cyan-950"
                >
                  <Terminal size={14} />
                  <span>Launch Interactive Simulator</span>
                  <ArrowRight size={14} />
                </button>

                <a
                  href="https://github.com/jatinsingh82/Weather_Website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-800 transition-colors"
                >
                  <span>Repository Code</span>
                  <ExternalLink size={13} className="text-slate-500" />
                </a>
              </div>
            </div>

            {/* Right Blueprint: Interactive Highlights */}
            <div className="lg:col-span-5 space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <span className="text-slate-400 font-bold block pb-2 border-b border-slate-800">
                  SIMULATION ENGINE CAPABILITIES
                </span>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>Multi-vector scenarios: Ransomware, IAM Cloud Role Hijack, Phishing AiTM.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>Real-world trade-offs: Total shutdown vs surgical micro-segmentation.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>Dynamic HUD tracking capital loss, legal disclosure clocks, and record leaks.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>NIST-aligned 5-dimension executive post-mortem rating.</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-sans">
                  Built to demonstrate product thinking, systems engineering, and genuine cybersecurity strategy to technical interviewers.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECONDARY PROJECTS GRID                                            */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-xl font-bold text-slate-100 font-mono">
              Selected Software & Analytics Projects
            </h3>
            <span className="text-xs font-mono text-slate-500">3 Production Implementations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 2: Weather Intelligence Platform */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                    <CloudRain size={16} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Full-Stack React
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100 font-mono">
                    Weather Intelligence Platform
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Real-Time Atmospheric Analytics & Radar
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  A high-precision meteorological intelligence app combining Open-Meteo & OpenWeather APIs, interactive RainViewer precipitation radar, algorithmic Comfort Scores, Activity Advisors, and location comparisons.
                </p>

                <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <div><strong>Architecture:</strong> Client TTL Caching, Geocoding</div>
                  <div><strong>Focus:</strong> Data transformation & responsive UX</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <a
                  href="https://weather-website-ten-phi.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://github.com/jatinsingh82/Weather_Website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-200"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Project 3: Job Portal Full-Stack Platform */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
                    <Briefcase size={16} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Full-Stack Web App
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100 font-mono">
                    Job Portal Platform
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Recruitment & Application Pipeline
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  A comprehensive employment platform featuring candidate authentication, structured vacancy posting workflows, application tracking, filtering algorithms, and profile management systems.
                </p>

                <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <div><strong>Architecture:</strong> Auth workflows, database schemas</div>
                  <div><strong>Focus:</strong> Role-based applicant pipelines</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <a
                  href="https://github.com/jatinsingh82"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
                <span className="text-slate-500 text-[10px]">Production Code</span>
              </div>
            </div>

            {/* Project 4: Rajdeep Enterprises */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
                    <Globe size={16} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Commercial Web Presence
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100 font-mono">
                    Rajdeep Enterprises
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Commercial Business Platform
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  A client-focused commercial business website engineered with responsive UX, catalog displays, direct customer contact integrations, and performance-tuned asset delivery.
                </p>

                <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <div><strong>Architecture:</strong> Responsive layout, SEO metadata</div>
                  <div><strong>Focus:</strong> Real-world commercial presentation</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <a
                  href="https://github.com/jatinsingh82"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>Repository</span>
                  <ExternalLink size={12} />
                </a>
                <span className="text-slate-500 text-[10px]">Client Web</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
