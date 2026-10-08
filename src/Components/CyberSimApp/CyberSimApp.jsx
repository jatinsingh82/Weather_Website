import React, { useState, useEffect } from 'react';
import { ALL_SCENARIOS, getScenarioById } from '../../sim-engine/scenarioRegistry';
import { applyDecision } from '../../sim-engine/scoringModel';
import CyberNavbar from '../CyberNavbar/CyberNavbar';
import RiskPostureHUD from '../RiskPostureHUD/RiskPostureHUD';
import IncidentView from '../IncidentView/IncidentView';
import AttackTimeline from '../AttackTimeline/AttackTimeline';
import ExecutiveDashboard from '../ExecutiveDashboard/ExecutiveDashboard';
import PostMortemReport from '../PostMortemReport/PostMortemReport';
import ScenarioPickerModal from '../ScenarioPickerModal/ScenarioPickerModal';
import confetti from 'canvas-confetti';

export default function CyberSimApp() {
  const [selectedScenarioId, setSelectedScenarioId] = useState('scenario-ransomware-01');
  const [activeTab, setActiveTab] = useState('incident'); // 'incident' | 'decisions' | 'timeline' | 'executive' | 'postmortem'
  const [isScenarioPickerOpen, setIsScenarioPickerOpen] = useState(false);

  // Load current scenario definition
  const scenario = getScenarioById(selectedScenarioId);

  // Simulation Central State
  const [simulationState, setSimulationState] = useState(() => {
    try {
      const saved = localStorage.getItem(`cybersim_state_${selectedScenarioId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return { ...scenario.initialState };
  });

  // Current active event
  const currentEvent = scenario.events[simulationState.activeEventIndex] || null;

  // Persist state on change
  useEffect(() => {
    try {
      localStorage.setItem(`cybersim_state_${selectedScenarioId}`, JSON.stringify(simulationState));
    } catch (e) {
      // ignore storage quota
    }
  }, [simulationState, selectedScenarioId]);

  // Handle tactical decision execution
  const handleMakeDecision = (decision) => {
    if (!currentEvent) return;

    // Find next event in sequence
    let nextIndex = simulationState.activeEventIndex + 1;
    let nextEvent = scenario.events[nextIndex] || null;

    if (decision.nextEventId === 'SIMULATION_COMPLETE') {
      nextEvent = null;
    } else if (decision.nextEventId) {
      const explicitNext = scenario.events.findIndex((e) => e.id === decision.nextEventId);
      if (explicitNext !== -1) {
        nextIndex = explicitNext;
        nextEvent = scenario.events[nextIndex];
      }
    }

    const updatedState = applyDecision(simulationState, currentEvent, decision, nextEvent);

    if (updatedState.isCompleted) {
      // Trigger celebration / completion
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // no-op
      }
      setSimulationState({
        ...updatedState,
        activeEventIndex: scenario.events.length
      });
      setActiveTab('postmortem');
    } else {
      setSimulationState({
        ...updatedState,
        activeEventIndex: nextIndex
      });
    }
  };

  // Reset current scenario to clean slate
  const handleResetSimulation = () => {
    try {
      localStorage.removeItem(`cybersim_state_${selectedScenarioId}`);
    } catch (e) {
      // no-op
    }
    setSimulationState({ ...scenario.initialState });
    setActiveTab('incident');
  };

  // Switch scenario
  const handleSwitchScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    const newScenario = getScenarioById(scenarioId);
    try {
      const saved = localStorage.getItem(`cybersim_state_${scenarioId}`);
      if (saved) {
        setSimulationState(JSON.parse(saved));
      } else {
        setSimulationState({ ...newScenario.initialState });
      }
    } catch (e) {
      setSimulationState({ ...newScenario.initialState });
    }
    setActiveTab('incident');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Primary Cyber Navbar */}
      <CyberNavbar
        scenario={scenario}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        simulationState={simulationState}
        onResetSimulation={handleResetSimulation}
        onOpenScenarioPicker={() => setIsScenarioPickerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* Risk Posture Telemetry HUD Banner (always visible during simulation) */}
        <RiskPostureHUD
          state={simulationState}
          totalEndpoints={scenario.initialState.totalEndpoints}
        />

        {/* Dynamic Tab Workspace */}
        {activeTab === 'incident' && (
          <IncidentView
            scenario={scenario}
            currentEvent={currentEvent}
            simulationState={simulationState}
            onMakeDecision={handleMakeDecision}
            onViewPostMortem={() => setActiveTab('postmortem')}
          />
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold font-mono text-slate-100">
                DECISION ROOM & INCIDENT COMMAND LOG
              </h2>
              <p className="text-xs text-slate-400">
                Full ledger of tactical and strategic directives issued during this simulation.
              </p>
            </div>
            {simulationState.decisionsMade.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-900/60 rounded-xl border border-slate-800">
                No decisions executed yet. Head to Active Incident to issue initial directives.
              </div>
            ) : (
              <div className="space-y-3">
                {simulationState.decisionsMade.map((dec, i) => (
                  <div key={`dec-${i}`} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{dec.timestamp} · {dec.eventTitle}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                        {dec.strategyCategory}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold font-mono text-slate-100">
                      {dec.decisionLabel}
                    </h3>
                    <p className="text-xs text-slate-400">{dec.rationale}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <AttackTimeline
            simulationState={simulationState}
            scenario={scenario}
          />
        )}

        {activeTab === 'executive' && (
          <ExecutiveDashboard
            simulationState={simulationState}
            scenario={scenario}
          />
        )}

        {activeTab === 'postmortem' && (
          <PostMortemReport
            simulationState={simulationState}
            scenario={scenario}
            onRestartSimulation={handleResetSimulation}
            onSwitchScenario={() => setIsScenarioPickerOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">CYBERSIM</span>
            <span>·</span>
            <span>Deterministic Incident-Response & Executive Decision Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Framework: NIST SP 800-61 Rev 2</span>
            <span>·</span>
            <span>MITRE ATT&CK Matrix v14</span>
          </div>
        </div>
      </footer>

      {/* Scenario Picker Modal */}
      <ScenarioPickerModal
        isOpen={isScenarioPickerOpen}
        onClose={() => setIsScenarioPickerOpen(false)}
        scenarios={ALL_SCENARIOS}
        currentScenarioId={selectedScenarioId}
        onSelectScenario={handleSwitchScenario}
      />
    </div>
  );
}
