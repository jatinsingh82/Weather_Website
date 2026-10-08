import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Clock,
  Database,
  Server,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatNumber, getSeverityStyle } from '../../utils/formatters';

export default function RiskPostureHUD({ state, totalEndpoints }) {
  const sevStyle = getSeverityStyle(state.incidentSeverity);

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBar = (score) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const infectedPercent = Math.min(100, Math.round((state.systemsAffected / (totalEndpoints || 1)) * 100));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 mb-5 shadow-lg">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">TELEMETRY POSTURE HUD:</span>
          <span className={`px-2 py-0.5 rounded font-bold border ${sevStyle.bg} ${sevStyle.border} ${sevStyle.text}`}>
            {state.incidentSeverity}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Containment: <strong className="text-cyan-300 font-mono">{state.containmentStatus}</strong></span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Duration: <strong className="text-slate-200">{state.incidentDurationMinutes}m elapsed</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Security Posture */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck size={12} className="text-cyan-400" /> Security
            </span>
            <span className={`text-xs font-mono font-bold ${getScoreColor(state.securityScore)}`}>
              {state.securityScore}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getScoreBar(state.securityScore)}`}
              style={{ width: `${state.securityScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Active defensive perimeter</span>
        </div>

        {/* Metric 2: Business Continuity */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <TrendingUp size={12} className="text-blue-400" /> Continuity
            </span>
            <span className={`text-xs font-mono font-bold ${getScoreColor(state.businessContinuity)}`}>
              {state.businessContinuity}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getScoreBar(state.businessContinuity)}`}
              style={{ width: `${state.businessContinuity}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Operational availability</span>
        </div>

        {/* Metric 3: Financial Impact */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
            <DollarSign size={12} className="text-amber-400" /> Financial Loss
          </span>
          <div className="text-sm font-mono font-bold text-amber-300">
            {formatCurrency(state.financialImpact)}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">IR costs & ransom exposure</span>
        </div>

        {/* Metric 4: Downtime */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
            <Clock size={12} className="text-purple-400" /> Total Outage
          </span>
          <div className="text-sm font-mono font-bold text-slate-200">
            {state.downtimeHours} <span className="text-xs text-slate-400">hours</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Critical workflow interruption</span>
        </div>

        {/* Metric 5: Data Exposure */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
            <Database size={12} className="text-rose-400" /> Data Exfiltrated
          </span>
          <div className="text-sm font-mono font-bold text-rose-300">
            {formatNumber(state.dataExposureRecords)} <span className="text-xs text-slate-400">recs</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Client records in flight</span>
        </div>

        {/* Metric 6: Compromised Systems */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Server size={12} className="text-orange-400" /> Blast Radius
            </span>
            <span className="text-xs font-mono font-bold text-orange-300">
              {state.systemsAffected} / {totalEndpoints}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${infectedPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Compromised endpoints</span>
        </div>
      </div>
    </div>
  );
}
