import React from 'react';
import {
  ShieldAlert,
  Activity,
  Layers,
  FileText,
  BarChart3,
  RotateCcw,
  Building2,
  Lock
} from 'lucide-react';

export default function CyberNavbar({
  scenario,
  activeTab,
  setActiveTab,
  simulationState,
  onResetSimulation,
  onOpenScenarioPicker
}) {
  const isCompleted = simulationState.isCompleted;

  const navItems = [
    { id: 'incident', label: 'Active Incident', icon: ShieldAlert, badge: isCompleted ? 'Resolved' : 'Live' },
    { id: 'decisions', label: 'Decision Room', icon: Layers, badge: `${simulationState.decisionsMade.length}` },
    { id: 'timeline', label: 'Attack Timeline', icon: Activity },
    { id: 'executive', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'postmortem', label: 'Post-Mortem Report', icon: FileText, disabled: !isCompleted }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Top Incident Status Banner */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/80 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
            <span className="font-mono text-slate-300 font-semibold tracking-wider">
              {isCompleted ? 'INCIDENT CONTAINED' : 'INCIDENT ACTIVE'}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Building2 size={13} className="text-cyan-400" />
            <span className="text-slate-300 font-medium">{scenario.organizationProfile.name}</span>
            <span className="text-slate-500 hidden sm:inline">({scenario.organizationProfile.industry})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Phase:</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
              {simulationState.currentPhase}
            </span>
          </div>
          <button
            onClick={onOpenScenarioPicker}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded border border-slate-700/60 hover:border-slate-600 transition-colors"
            title="Switch Incident Scenario"
          >
            <span className="text-xs font-mono">Scenario: {scenario.threatType}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-950/50 border border-cyan-400/30">
              <Lock size={17} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-widest text-base text-slate-100 font-mono">CYBERSIM</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  PRO SOC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Incident Response & Executive Decision Simulator</p>
            </div>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1" aria-label="Main navigation">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                    : tab.disabled
                    ? 'text-slate-600 cursor-not-allowed opacity-50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 transition-colors"
            title="Restart current simulation scenario"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">Restart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
