import React from 'react';
import {
  BarChart3,
  Building2,
  DollarSign,
  Clock,
  Database,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrency, formatNumber, getSeverityStyle } from '../../utils/formatters';

export default function ExecutiveDashboard({ simulationState, scenario }) {
  const {
    securityScore,
    businessContinuity,
    financialImpact,
    downtimeHours,
    dataExposureRecords,
    reputationRisk,
    systemsAffected,
    totalEndpoints,
    incidentSeverity,
    containmentStatus,
    decisionsMade
  } = simulationState;

  const totalCostEstimate = financialImpact + (downtimeHours * 45000); // estimated hourly revenue loss

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
            <BarChart3 size={18} className="text-cyan-400" />
            C-SUITE & BOARD EXECUTIVE BRIEFING
          </h2>
          <p className="text-xs text-slate-400">
            Synthesized business impact, regulatory exposure, and operational resilience overview for leadership.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Entity: {scenario.organizationProfile.name}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            Status: {containmentStatus}
          </span>
        </div>
      </div>

      {/* High-Level Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Estimated Loss */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign size={14} className="text-amber-400" /> Estimated Financial Impact
            </span>
            <span className="font-mono text-amber-400 font-bold">Direct + Downtime</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {formatCurrency(totalCostEstimate)}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Includes ${formatNumber(financialImpact)} direct IR/forensics + est. ${formatNumber(downtimeHours * 45000)} commercial interruption.
          </p>
        </div>

        {/* Card 2: Operational Downtime */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-purple-400" /> Business Interruption
            </span>
            <span className="font-mono text-purple-400 font-bold">{downtimeHours}h Outage</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {businessContinuity}% <span className="text-xs font-normal text-slate-400">Availability</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Core payment clearing & client custody services operational ratio.
          </p>
        </div>

        {/* Card 3: Regulatory & Data Exposure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Database size={14} className="text-rose-400" /> Client Data Exposure
            </span>
            <span className="font-mono text-rose-400 font-bold">SEC / GDPR Clock</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300">
            {formatNumber(dataExposureRecords)} <span className="text-xs font-normal text-slate-400">records</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            PII documents and confidential records confirmed or suspected in flight.
          </p>
        </div>

        {/* Card 4: Brand & Reputation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Scale size={14} className="text-cyan-400" /> Reputation Risk
            </span>
            <span className="font-mono text-cyan-400 font-bold">{reputationRisk}</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {securityScore}% <span className="text-xs font-normal text-slate-400">Defensive Posture</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Market perception and institutional client trust rating.
          </p>
        </div>
      </div>

      {/* Leadership Action Matrix & Regulatory Mandates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Decisions Log for Board Review */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Layers size={14} className="text-cyan-400" />
              RECORD OF EXECUTIVE DIRECTIVES EXECUTED ({decisionsMade.length})
            </span>
          </div>

          {decisionsMade.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No directives logged. Execute choices in the Active Incident tab.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
              {decisionsMade.map((dec, idx) => (
                <div
                  key={`dec-audit-${idx}`}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{dec.timestamp} · {dec.eventTitle}</span>
                    <span className="text-cyan-400 font-bold">{dec.strategyCategory}</span>
                  </div>
                  <div className="text-slate-200 font-semibold font-mono">
                    {dec.decisionLabel}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Direct Cost: <strong className="text-amber-300">{formatCurrency(dec.financialCost)}</strong></span>
                    <span>Security Delta: <strong className={dec.securityImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{dec.securityImpact >= 0 ? `+${dec.securityImpact}` : dec.securityImpact}</strong></span>
                    <span>Availability Delta: <strong className={dec.businessImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{dec.businessImpact >= 0 ? `+${dec.businessImpact}` : dec.businessImpact}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Regulatory Compliance Status */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="pb-2 border-b border-slate-800 text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
            <FileSpreadsheet size={14} className="text-cyan-400" />
            REGULATORY OBLIGATIONS & JURISDICTIONS
          </div>

          <div className="space-y-3 text-xs">
            {scenario.organizationProfile.regulatoryFrameworks.map((framework, i) => (
              <div
                key={`reg-${i}`}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-cyan-300">{framework}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Active Notification Clock
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {framework === 'GDPR' && 'Mandatory 72-hour supervisory authority breach notification window.'}
                  {framework === 'SEC Reg S-P' && 'Material cybersecurity incidents must be disclosed on Form 8-K within 4 business days.'}
                  {framework === 'NYDFS 500' && '72-hour notification required to the Superintendent of Financial Services.'}
                  {framework === 'SOC 2 Type II' && 'Requires prompt notification of customer security contacts and root cause analysis report.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
