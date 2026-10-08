import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { formatCurrency, getSeverityStyle, getCategoryBadge } from '../../utils/formatters';

export default function AttackTimeline({ simulationState, scenario }) {
  const { eventHistory = [] } = simulationState;

  if (eventHistory.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center max-w-xl mx-auto my-8">
        <Activity size={32} className="text-cyan-400 mx-auto mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-slate-200 font-mono mb-1">
          INCIDENT TIMELINE INITIALIZING
        </h3>
        <p className="text-xs text-slate-400">
          No tactical decisions recorded yet. Execute the initial directive in the Active Incident view to begin logging chronology.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
            <Activity size={18} className="text-cyan-400" />
            INCIDENT ATTACK & DECISION TIMELINE
          </h2>
          <p className="text-xs text-slate-400">
            Chronological audit log tracking adversary TTPs, telemetry alerts, and defensive directives executed.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {eventHistory.length} Recorded Milestones
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-6 pb-4">
        {eventHistory.map((item, index) => {
          const { event, chosenDecision } = item;
          const sevStyle = getSeverityStyle(event.severity);
          const catBadge = getCategoryBadge(event.category);

          return (
            <div key={`timeline-${index}`} className="relative pl-6 md:pl-8">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-md space-y-3">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">T+{event.elapsedMinutes}m</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-semibold">{event.timestamp}</span>
                    <span className="text-slate-600">·</span>
                    <span className={`px-2 py-0.2 rounded border text-[10px] ${catBadge.color}`}>
                      {catBadge.label}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${sevStyle.bg} ${sevStyle.border} ${sevStyle.text}`}>
                    {event.severity}
                  </span>
                </div>

                {/* Event Summary */}
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-mono mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {event.headline}
                  </p>
                </div>

                {/* Tactical Decision Executed Box */}
                {chosenDecision && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={13} />
                        DIRECTIVE EXECUTED:
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                        {chosenDecision.strategyCategory}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-mono font-semibold">
                      {chosenDecision.decisionLabel}
                    </p>

                    {/* Impact Deltas Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>Security:</span>
                        <span className={chosenDecision.securityImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {chosenDecision.securityImpact >= 0 ? `+${chosenDecision.securityImpact}` : chosenDecision.securityImpact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>Continuity:</span>
                        <span className={chosenDecision.businessImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {chosenDecision.businessImpact >= 0 ? `+${chosenDecision.businessImpact}` : chosenDecision.businessImpact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>Cost:</span>
                        <span className="text-amber-300">
                          {formatCurrency(chosenDecision.financialCost)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>Outage:</span>
                        <span className="text-purple-300">
                          +{chosenDecision.downtimeAddedHours}h
                        </span>
                      </div>
                    </div>

                    {/* Feedback Pro/Con Points */}
                    {chosenDecision.feedback && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] space-y-1 font-sans">
                        {chosenDecision.feedback.tacticalPros?.map((pro, pIdx) => (
                          <div key={`pro-${pIdx}`} className="text-emerald-400/90 flex items-start gap-1.5">
                            <span className="font-mono text-emerald-500 font-bold">✓</span>
                            <span>{pro}</span>
                          </div>
                        ))}
                        {chosenDecision.feedback.tacticalCons?.map((con, cIdx) => (
                          <div key={`con-${cIdx}`} className="text-rose-400/90 flex items-start gap-1.5">
                            <span className="font-mono text-rose-500 font-bold">✗</span>
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
