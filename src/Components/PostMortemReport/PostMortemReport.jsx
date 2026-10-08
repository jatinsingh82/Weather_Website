import React from 'react';
import {
  FileText,
  Award,
  ShieldCheck,
  TrendingDown,
  Clock,
  DollarSign,
  Database,
  Layers,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { calculatePostMortemScoring } from '../../sim-engine/scoringModel';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function PostMortemReport({
  simulationState,
  scenario,
  onRestartSimulation,
  onSwitchScenario
}) {
  const scoring = calculatePostMortemScoring(simulationState);
  const { decisionsMade = [] } = simulationState;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Executive Post-Mortem Cover */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-slate-400">
              <FileText size={15} className="text-cyan-400" />
              <span>INCIDENT POST-MORTEM & EXECUTIVE BRIEFING</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-300 font-semibold">{scenario.threatType}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 font-mono tracking-tight">
              {scenario.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Target Entity: <strong className="text-slate-200">{scenario.organizationProfile.name}</strong> · Forensic Containment Cycle Completed
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRestartSimulation}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors border border-slate-700"
            >
              <RotateCcw size={14} />
              <span>Re-run Scenario</span>
            </button>
            <button
              onClick={onSwitchScenario}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-cyan-950/60"
            >
              <span>Explore Next Scenario</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Overall Scorecard Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
          {/* Left score ring display */}
          <div className="md:col-span-4 bg-slate-950/80 border border-slate-800 rounded-xl p-6 text-center space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              NIST Composite Rating
            </span>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <span className={`text-6xl font-black tracking-tight ${scoring.gradeColor}`}>
                {scoring.overallScore}
              </span>
              <span className="text-xl font-bold text-slate-500">/ 100</span>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${scoring.badgeColor}`}>
                {scoring.grade}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-snug pt-2 font-sans">
              Evaluated across security posture, business continuity, cost containment, data protection, and response speed.
            </p>
          </div>

          {/* Right dimension breakdown */}
          <div className="md:col-span-8 space-y-3">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Performance Dimensions Breakdown:
            </h3>
            {scoring.dimensions.map((dim, idx) => (
              <div key={`dim-${idx}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    {dim.name} <span className="text-slate-500 font-mono text-[10px]">({dim.weight})</span>
                  </span>
                  <span className="font-mono font-bold text-slate-200">{dim.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      dim.score >= 75 ? 'bg-emerald-500' : dim.score >= 55 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">{dim.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Incident Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <DollarSign size={14} className="text-amber-400" /> Total Capital Loss
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {formatCurrency(simulationState.financialImpact)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Ransom & recovery expenses</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock size={14} className="text-purple-400" /> Operational Outage
          </div>
          <div className="text-xl font-bold font-mono text-slate-200">
            {simulationState.downtimeHours} hours
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Critical path interruption</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Database size={14} className="text-rose-400" /> Records Compromised
          </div>
          <div className="text-xl font-bold font-mono text-rose-300">
            {formatNumber(simulationState.dataExposureRecords)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Client confidential PII records</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <ShieldCheck size={14} className="text-cyan-400" /> Terminal Defense
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300">
            {simulationState.securityScore}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Final post-incident baseline</span>
        </div>
      </div>

      {/* Critical Tactical Decisions Audit */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              TACTICAL DECISION AUDIT TRAIL
            </h3>
            <p className="text-xs text-slate-400">
              Post-mortem breakdown of trade-offs, tactical outcomes, and regulatory compliance considerations.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
            {decisionsMade.length} Decisions Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {decisionsMade.map((dec, idx) => (
            <div
              key={`post-dec-${idx}`}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs font-mono">
                <span className="text-slate-400">
                  Event: <strong className="text-slate-200">{dec.eventTitle}</strong> ({dec.timestamp})
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                  {dec.strategyCategory}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100 font-mono mb-1">
                  {dec.decisionLabel}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {dec.rationale}
                </p>
              </div>

              {/* Feedback Pros / Cons */}
              {dec.feedback && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                      POSITIVE OUTCOMES:
                    </span>
                    {dec.feedback.tacticalPros?.map((pro, p) => (
                      <div key={`p-${p}`} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                        <span className="text-emerald-400 font-mono">✓</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-rose-400 font-bold block">
                      TRADE-OFFS & LIABILITIES:
                    </span>
                    {dec.feedback.tacticalCons?.map((con, c) => (
                      <div key={`c-${c}`} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                        <span className="text-rose-400 font-mono">✗</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance Note */}
              {dec.feedback?.complianceNote && (
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300/90 font-mono flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">COMPLIANCE ADVISORY:</span>
                  <span>{dec.feedback.complianceNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Strategic Remediations (NIST Aligned) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          EXECUTIVE REMEDIATION ROADMAP (NEXT 90 DAYS)
        </h3>
        <p className="text-xs text-slate-400">
          Core technical controls and operational governance changes recommended to prevent recurrence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono block">1. Hardware-Backed FIDO2 Phishing-Resistant MFA</strong>
            <p className="text-slate-400 leading-relaxed">
              Mandate YubiKey / FIDO2 security keys for all privileged domain admins, VPN access, and service account tokens to neutralize AiTM session theft.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono block">2. Micro-Segmentation & Tier-0 Domain Isolation</strong>
            <p className="text-slate-400 leading-relaxed">
              Enforce software-defined network isolation between corporate workstation subnets, billing servers, and core database clusters to block lateral SMB/WMI spread.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono block">3. Immutable Air-Gapped Storage Snapshots</strong>
            <p className="text-slate-400 leading-relaxed">
              Maintain cryptographically write-once-read-many (WORM) offline backups to guarantee swift restoration without relying on extortion decryptors.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono block">4. Privileged Access Management (PAM) & Ephemeral Credentials</strong>
            <p className="text-slate-400 leading-relaxed">
              Eliminate static service account passwords and implement just-in-time (JIT) credential leasing with automated Kerberos session rotation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
