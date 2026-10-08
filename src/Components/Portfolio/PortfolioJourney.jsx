import React from 'react';

export default function PortfolioJourney() {
  const steps = [
    {
      step: '01',
      title: 'Computer Science Engineering (B.Tech)',
      subtitle: 'Technical Rigor & Software Foundations',
      description:
        'Built a strong algorithmic, architectural, and coding foundation. Explored operating systems, networks, data structures, and hands-on full-stack web development.',
      badge: 'Engineering Foundation',
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800'
    },
    {
      step: '02',
      title: 'Full-Stack Software Development',
      subtitle: 'Building Usable Platforms & Applications',
      description:
        'Engineered production web applications including the Weather Intelligence Platform and commercial portals. Mastered asynchronous data workflows, API transformations, and responsive design systems.',
      badge: 'Systems & Web',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-800'
    },
    {
      step: '03',
      title: 'MBA (IT) — Business Analytics',
      subtitle: 'Financial Impact, Risk Modeling & Strategy',
      description:
        'Expanded perspective beyond the code editor into enterprise finance, regulatory frameworks, operational trade-offs, and data-driven business analytics.',
      badge: 'Business Analytics',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800'
    },
    {
      step: '04',
      title: 'Cybersecurity Analyst — Deloitte',
      subtitle: 'Cyber Strategy & Enterprise Transformation',
      description:
        'Advising enterprise stakeholders on cyber strategy, posture assessments, and incident preparedness. Translating technical security indicators into boardroom clarity.',
      badge: 'Enterprise Cyber',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800'
    },
    {
      step: '05',
      title: 'The Synthesis: CyberSim & Beyond',
      subtitle: 'Technology × Security × Business Decision Systems',
      description:
        'Building simulation labs and interactive software where security, engineering, and business strategy converge into actionable user experiences.',
      badge: 'Current Frontier',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
    }
  ];

  return (
    <section id="journey" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              {'// Trajectory & Progression'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              The Path to Cyber Strategy & Engineering
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-sm">
            How computer science, business analytics, and cybersecurity fused into one unified discipline.
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-8 pb-4">
          {steps.map((item, idx) => (
            <div key={item.step} className="relative pl-6 md:pl-10">
              {/* Timeline marker */}
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold text-cyan-300">
                {idx + 1}
              </div>

              <div className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Milestone {item.step}</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
