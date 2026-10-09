import React from 'react';
import { Award, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function PortfolioCertifications() {
  const credentials = [
    {
      category: 'Academic Degrees',
      icon: GraduationCap,
      accent: 'text-cyan-400',
      items: [
        {
          title: 'Bachelor of Technology (B.Tech)',
          field: 'Computer Science Engineering',
          detail: 'Algorithmic rigor, software systems architecture, database design, and web platforms.'
        },
        {
          title: 'Master of Business Administration (MBA - IT)',
          field: 'Information Technology & Business Analytics',
          detail: 'Quantitative risk valuation, enterprise IT strategy, financial modeling, and operational decision-making.'
        }
      ]
    },
    {
      category: 'Enterprise Frameworks & Standards',
      icon: ShieldCheck,
      accent: 'text-purple-400',
      items: [
        {
          title: 'NIST Cybersecurity Framework (CSF 2.0)',
          field: 'Enterprise Risk & Governance',
          detail: 'Operationalizing Identify, Protect, Detect, Respond, and Recover pillars across organizational tiers.'
        },
        {
          title: 'NIST SP 800-61 Rev. 2',
          field: 'Computer Security Incident Handling Guide',
          detail: 'Structuring containment phases, eradication workflows, forensic evidence handling, and post-mortems.'
        },
        {
          title: 'ISO/IEC 27001 Standard',
          field: 'Information Security Management',
          detail: 'Evaluating controls, risk assessment methodologies, and governance alignment with compliance objectives.'
        },
        {
          title: 'MITRE ATT&CK Enterprise Matrix',
          field: 'Adversary Tactics, Techniques & Common Knowledge',
          detail: 'Mapping attacker TTPs to telemetry detection rules and threat modeling.'
        }
      ]
    }
  ];

  return (
    <section id="certifications" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              {'// Credentials & Standards'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              Academic Credentials & Frameworks
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-sm">
            Dual-track academic foundations paired with recognized global security and governance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.category}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 shadow-lg"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Icon size={18} className={group.accent} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 font-mono">
                    {group.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-200 font-mono">
                          {item.title}
                        </h4>
                        <Award size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      </div>
                      <span className="text-xs font-mono text-cyan-400 block font-medium">
                        {item.field}
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Strip */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>Dual Academic Discipline: Computer Science Engineering + MBA (IT) Business Analytics</span>
          </div>
          <span className="text-slate-500">Deloitte Cyber Strategy Practice Focus</span>
        </div>
      </div>
    </section>
  );
}
