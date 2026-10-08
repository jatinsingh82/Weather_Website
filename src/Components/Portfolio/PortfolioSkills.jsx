import React from 'react';
import { Code2, Database, Shield, Wrench } from 'lucide-react';

export default function PortfolioSkills() {
  const skillCategories = [
    {
      category: 'Software Engineering',
      icon: Code2,
      accent: 'text-cyan-400',
      skills: [
        { name: 'React 18 & Hooks', level: 'Production Core' },
        { name: 'JavaScript (ES6+)', level: 'Advanced' },
        { name: 'Node.js & Express', level: 'Backend APIs' },
        { name: 'HTML5 & Modern CSS3', level: 'Semantic / Glassmorphism' },
        { name: 'Tailwind CSS', level: 'Design Systems' },
        { name: 'RESTful API Architecture', level: 'Integration & Caching' }
      ]
    },
    {
      category: 'Cybersecurity & Strategy',
      icon: Shield,
      accent: 'text-purple-400',
      skills: [
        { name: 'Incident Response (NIST SP 800-61)', level: 'Simulation Lead' },
        { name: 'Threat Modeling (MITRE ATT&CK)', level: 'TTP Mapping' },
        { name: 'Identity & Access Management (IAM)', level: 'FIDO2 / SSO / PAM' },
        { name: 'Cyber Risk & Governance', level: 'Enterprise Frameworks' },
        { name: 'Network Segmentation & Zero Trust', level: 'Defense-in-Depth' },
        { name: 'Cloud Security Fundamentals', level: 'AWS IAM / GuardDuty' }
      ]
    },
    {
      category: 'Data & Business Analytics',
      icon: Database,
      accent: 'text-blue-400',
      skills: [
        { name: 'Python for Analytics', level: 'Data Processing' },
        { name: 'SQL & Relational Schemas', level: 'PostgreSQL / MySQL' },
        { name: 'Quantitative Risk Modeling', level: 'Loss & Cost Modeling' },
        { name: 'Business Continuity Analysis', level: 'Downtime & SLA Impact' },
        { name: 'Data Visualization & Reporting', level: 'Executive Dashboards' }
      ]
    },
    {
      category: 'Tooling & Deployment',
      icon: Wrench,
      accent: 'text-emerald-400',
      skills: [
        { name: 'Git & GitHub Workflows', level: 'Version Control' },
        { name: 'Vercel Deployment', level: 'CI/CD Platform' },
        { name: 'Linux / Bash Telemetry', level: 'Terminal & Scripting' },
        { name: 'Web Performance Optimization', level: 'Bundle & Caching' },
        { name: 'Jest / Testing Library', level: 'Unit Testing' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              {'// Core Competencies'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-sans tracking-tight">
              Technical & Strategic Skills
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-sm">
            Organized by genuine technical depth across engineering, cyber defense, data, and product systems.
          </p>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.category}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Icon size={18} className={group.accent} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 font-mono">
                    {group.category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-200">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
