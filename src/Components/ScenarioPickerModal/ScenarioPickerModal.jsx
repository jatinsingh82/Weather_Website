import React from 'react';
import {
  ShieldAlert,
  Cloud,
  Mail,
  Clock,
  Building2,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';

export default function ScenarioPickerModal({
  isOpen,
  onClose,
  scenarios,
  currentScenarioId,
  onSelectScenario
}) {
  if (!isOpen) return null;

  const getThreatIcon = (type) => {
    switch (type) {
      case 'RANSOMWARE':
        return ShieldAlert;
      case 'CLOUD_EXPOSURE':
        return Cloud;
      case 'ACCOUNT_TAKEOVER':
        return Mail;
      default:
        return ShieldAlert;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              SELECT INCIDENT RESPONSE SCENARIO
            </h2>
            <p className="text-xs text-slate-400">
              Choose an enterprise cyber threat profile to simulate.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {scenarios.map((sc) => {
            const Icon = getThreatIcon(sc.threatType);
            const isSelected = sc.id === currentScenarioId;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-100 font-mono">
                          {sc.title}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-snug mb-2 font-sans">
                        {sc.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 size={12} className="text-cyan-400" />
                          {sc.organizationProfile.name}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-purple-400" />
                          {sc.estimatedDuration}
                        </span>
                        <span>·</span>
                        <span className="text-amber-400">
                          {sc.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1 transition-all shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Play size={12} />
                    <span>{isSelected ? 'Reset' : 'Launch'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>All scenarios utilize deterministic simulation logic & MITRE ATT&CK mapping.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
