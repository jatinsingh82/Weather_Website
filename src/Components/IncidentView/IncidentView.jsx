import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  Terminal,
  Crosshair,
  Shield,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { getSeverityStyle, getCategoryBadge } from '../../utils/formatters';

export default function IncidentView({
  scenario,
  currentEvent,
  simulationState,
  onMakeDecision,
  onViewPostMortem
}) {
  const [selectedDecisionId, setSelectedDecisionId] = useState(null);
  const [activeLogTab, setActiveLogTab] = useState('telemetry'); // 'telemetry' | 'iocs' | 'brief'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (simulationState.isCompleted) {
    return (
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-8 text-center max-w-3xl mx-auto my-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <FileCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 font-mono mb-2">
          INCIDENT RESOLVED & CONTAINMENT CERTIFIED
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
          All active adversary command channels have been severed. Operational infrastructure has transitioned to forensic post-mortem and executive review.
        </p>
        <button
          onClick={onViewPostMortem}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/60"
        >
          <span>Open Executive Post-Mortem & Remediation Report</span>
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active incident event detected.
      </div>
    );
  }

  const sevStyle = getSeverityStyle(currentEvent.severity);
  const catBadge = getCategoryBadge(currentEvent.category);
  const selectedDecision = currentEvent.availableDecisions.find((d) => d.id === selectedDecisionId);

  const handleSubmitDecision = () => {
    if (!selectedDecision || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onMakeDecision(selectedDecision);
      setSelectedDecisionId(null);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className={`p-4 rounded-xl border ${sevStyle.bg} ${sevStyle.border} shadow-lg transition-all`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded-md ${sevStyle.bg} border ${sevStyle.border} ${sevStyle.text}`}>
              <AlertOctagon size={18} />
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              EVENT #{simulationState.eventHistory.length + 1} OF {scenario.events.length}
            </span>
            <span className="text-slate-600">·</span>
            <span className={`text-xs px-2 py-0.5 rounded border font-mono ${catBadge.color}`}>
              {catBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock size={13} className="text-cyan-400" />
              <span>Timestamp: <strong className="text-slate-200">{currentEvent.timestamp}</strong></span>
            </span>
            <span className="text-slate-600">|</span>
            <span className={`px-2 py-0.5 rounded border font-bold ${sevStyle.bg} ${sevStyle.border} ${sevStyle.text}`}>
              {currentEvent.severity}
            </span>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-slate-100 font-mono tracking-tight mt-1 mb-2">
          {currentEvent.title}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {currentEvent.headline}
        </p>

        {/* Affected Assets Strip */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Targeted Assets:</span>
          {currentEvent.affectedAssets.map((asset, i) => (
            <span
              key={`asset-${i}`}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 font-mono text-cyan-300"
            >
              {asset}
            </span>
          ))}
          <span className="text-slate-600 mx-1">|</span>
          <span className="text-slate-400 font-medium">MITRE ATT&CK:</span>
          {currentEvent.mitreTactics.map((tactic, i) => (
            <span
              key={`mitre-${i}`}
              className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/60 font-mono text-slate-300 text-[11px]"
            >
              {tactic}
            </span>
          ))}
        </div>
      </div>

      {/* Two-Column Incident Workspace: Left Evidence, Right Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Forensic Evidence & Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {/* Tab Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal size={14} className="text-cyan-400" />
                <span>FORENSIC TELEMETRY STREAM</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveLogTab('telemetry')}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeLogTab === 'telemetry' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Logs
                </button>
                <button
                  onClick={() => setActiveLogTab('iocs')}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeLogTab === 'iocs' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  IOCs ({currentEvent.indicatorsOfCompromise.length})
                </button>
                <button
                  onClick={() => setActiveLogTab('brief')}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeLogTab === 'brief' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Brief
                </button>
              </div>
            </div>

            {/* Tab 1: Live Telemetry Logs */}
            {activeLogTab === 'telemetry' && (
              <div className="p-3 bg-slate-950/90 font-mono text-xs space-y-2.5 max-h-[360px] overflow-y-auto">
                {currentEvent.telemetryLogs.map((log, i) => (
                  <div
                    key={`log-${i}`}
                    className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/60">
                      <span className="text-cyan-400 font-bold">{log.source}</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-300 leading-snug break-all text-[11px]">
                      {log.logText}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Indicators of Compromise (IOCs) */}
            {activeLogTab === 'iocs' && (
              <div className="p-3 bg-slate-950/90 font-mono text-xs space-y-2 max-h-[360px] overflow-y-auto">
                {currentEvent.indicatorsOfCompromise.map((ioc, i) => (
                  <div
                    key={`ioc-${i}`}
                    className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-xs"
                  >
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ioc.type}
                    </span>
                    <span className="text-cyan-300 text-[11px] font-mono break-all ml-2">
                      {ioc.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Detailed Brief */}
            {activeLogTab === 'brief' && (
              <div className="p-4 bg-slate-950/90 text-xs text-slate-300 leading-relaxed max-h-[360px] overflow-y-auto font-sans">
                {currentEvent.detailedBrief}
              </div>
            )}
          </div>

          {/* Adversary Profile Pill */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs font-mono space-y-1.5">
            <div className="text-slate-400 flex items-center gap-1.5">
              <Crosshair size={13} className="text-rose-400" />
              <span>THREAT ACTOR ATTRIBUTION:</span>
            </div>
            <div className="text-slate-200 font-bold">{scenario.threatActor}</div>
            <div className="text-[11px] text-slate-400">
              Target Profile: {scenario.organizationProfile.name} · {scenario.organizationProfile.headcount} seats
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Tactical Decisions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers size={17} className="text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-mono">
                  TACTICAL DECISION POINT
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Select an operational course of action
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Carefully balance tactical containment speed, operational business uptime, legal exposure, and capital cost. Every decision alters future simulation events.
            </p>

            {/* Decision Options List */}
            <div className="space-y-3">
              {currentEvent.availableDecisions.map((decision) => {
                const isSelected = selectedDecisionId === decision.id;
                return (
                  <div
                    key={decision.id}
                    onClick={() => setSelectedDecisionId(decision.id)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                              : 'border-slate-600 bg-slate-900'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-100 font-mono">
                              {decision.label}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {decision.strategyCategory}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-snug">
                            {decision.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Decision Details when selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-2">
                        <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                          <strong className="text-cyan-400 font-mono block mb-0.5">STRATEGIC RATIONALE:</strong>
                          {decision.rationale}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Execute Button */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                {selectedDecision ? 'Ready to execute directive' : 'Select a decision option above'}
              </span>
              <button
                disabled={!selectedDecision || isSubmitting}
                onClick={handleSubmitDecision}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md ${
                  selectedDecision && !isSubmitting
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/80'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
              >
                <span>{isSubmitting ? 'Simulating Telemetry...' : 'Execute Tactical Directive'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
