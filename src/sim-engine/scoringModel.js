/**
 * CYBERSIM — Deterministic Simulation Engine & Scoring Model
 */

const REPUTATION_LEVELS = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'CRITICAL'];

export function calculateReputationRisk(currentLevel, delta) {
  const currentIndex = REPUTATION_LEVELS.indexOf(currentLevel);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  // delta: positive increases risk, negative decreases risk
  const newIndex = Math.max(0, Math.min(REPUTATION_LEVELS.length - 1, safeIndex + delta));
  return REPUTATION_LEVELS[newIndex];
}

export function determinePhase(eventCategory, isCompleted) {
  if (isCompleted) return 'POST-INCIDENT';
  switch (eventCategory) {
    case 'INITIAL_ACCESS':
      return 'DETECTION';
    case 'PERSISTENCE':
    case 'PRIV_ESCALATION':
    case 'LATERAL_MOVEMENT':
      return 'CONTAINMENT';
    case 'IMPACT':
    case 'EXFILTRATION':
      return 'ERADICATION';
    case 'RECOVERY':
      return 'RECOVERY';
    default:
      return 'CONTAINMENT';
  }
}

export function determineSeverity(systemsAffected, financialImpact, dataExposed) {
  if (systemsAffected > 30 || financialImpact > 1000000 || dataExposed > 100000) {
    return 'SEV-1 (Critical)';
  }
  if (systemsAffected > 10 || financialImpact > 250000 || dataExposed > 20000) {
    return 'SEV-2 (High)';
  }
  if (systemsAffected > 2 || financialImpact > 50000 || dataExposed > 2000) {
    return 'SEV-3 (Moderate)';
  }
  return 'SEV-4 (Low)';
}

/**
 * Applies a user decision to the current simulation state.
 * Returns the updated immutable state.
 */
export function applyDecision(currentState, currentEvent, decision, nextEvent) {
  const newSecurityScore = Math.max(0, Math.min(100, currentState.securityScore + decision.securityImpact));
  const newBusinessContinuity = Math.max(0, Math.min(100, currentState.businessContinuity + decision.businessImpact));
  const newFinancialImpact = Math.max(0, currentState.financialImpact + decision.financialCost);
  const newDowntimeHours = Math.round((currentState.downtimeHours + decision.downtimeAddedHours) * 10) / 10;
  const newDataExposure = Math.max(0, currentState.dataExposureRecords + decision.dataExposureImpact);
  const newReputationRisk = calculateReputationRisk(currentState.reputationRisk, decision.reputationDelta);
  const newSystemsAffected = Math.max(0, currentState.systemsAffected + decision.systemsCompromisedDelta);

  const isCompleted = decision.nextEventId === 'SIMULATION_COMPLETE' || !nextEvent;

  const decisionRecord = {
    eventId: currentEvent.id,
    eventTitle: currentEvent.title,
    timestamp: currentEvent.timestamp,
    decisionId: decision.id,
    decisionLabel: decision.label,
    strategyCategory: decision.strategyCategory,
    securityImpact: decision.securityImpact,
    businessImpact: decision.businessImpact,
    financialCost: decision.financialCost,
    downtimeAddedHours: decision.downtimeAddedHours,
    dataExposureImpact: decision.dataExposureImpact,
    reputationResult: newReputationRisk,
    rationale: decision.rationale,
    feedback: decision.feedbackAnalysis
  };

  const newDecisionsMade = [...currentState.decisionsMade, decisionRecord];

  const updatedEventHistory = [
    ...currentState.eventHistory,
    {
      event: currentEvent,
      chosenDecision: decisionRecord
    }
  ];

  const newSeverity = determineSeverity(newSystemsAffected, newFinancialImpact, newDataExposure);
  const newPhase = determinePhase(nextEvent ? nextEvent.category : 'RECOVERY', isCompleted);

  let newContainmentStatus = currentState.containmentStatus;
  if (isCompleted) {
    newContainmentStatus = 'RESOLVED';
  } else if (newSecurityScore > 65 && currentState.systemsAffected < 15) {
    newContainmentStatus = 'CONTAINED';
  } else if (newSecurityScore > 50) {
    newContainmentStatus = 'PARTIALLY_CONTAINED';
  } else {
    newContainmentStatus = 'UNCONTAINED';
  }

  const durationMinutes = nextEvent
    ? nextEvent.elapsedMinutes
    : currentEvent.elapsedMinutes + 30;

  return {
    ...currentState,
    securityScore: newSecurityScore,
    businessContinuity: newBusinessContinuity,
    financialImpact: newFinancialImpact,
    downtimeHours: newDowntimeHours,
    dataExposureRecords: newDataExposure,
    reputationRisk: newReputationRisk,
    systemsAffected: newSystemsAffected,
    incidentSeverity: newSeverity,
    currentPhase: newPhase,
    containmentStatus: newContainmentStatus,
    decisionsMade: newDecisionsMade,
    eventHistory: updatedEventHistory,
    isCompleted,
    incidentDurationMinutes: durationMinutes
  };
}

/**
 * Calculates comprehensive executive scoring breakdown post-incident.
 */
export function calculatePostMortemScoring(state) {
  // Dimension 1: Security Hardening & Posture (0-100)
  const securityPosture = Math.round(state.securityScore);

  // Dimension 2: Business Continuity & Availability (0-100)
  const businessScore = Math.round(state.businessContinuity);

  // Dimension 3: Financial Prudence & Loss Mitigation (0-100)
  // Base 100, deducted by financial loss relative to enterprise threshold
  let financialDeduction = 0;
  if (state.financialImpact > 4000000) financialDeduction = 60;
  else if (state.financialImpact > 1000000) financialDeduction = 40;
  else if (state.financialImpact > 500000) financialDeduction = 25;
  else if (state.financialImpact > 150000) financialDeduction = 15;
  else financialDeduction = Math.min(10, (state.financialImpact / 50000) * 10);
  const financialScore = Math.max(20, Math.min(100, Math.round(100 - financialDeduction)));

  // Dimension 4: Data Protection & Confidentiality (0-100)
  let dataDeduction = 0;
  if (state.dataExposureRecords > 100000) dataDeduction = 50;
  else if (state.dataExposureRecords > 30000) dataDeduction = 30;
  else if (state.dataExposureRecords > 5000) dataDeduction = 15;
  else if (state.dataExposureRecords > 0) dataDeduction = 8;
  const dataProtectionScore = Math.max(25, Math.min(100, Math.round(100 - dataDeduction)));

  // Dimension 5: Response Speed & Tactical Decisiveness (0-100)
  // Derived from containment timeliness and ratio of positive tactical decisions
  const goodDecisions = state.decisionsMade.filter((d) => d.securityImpact > 0).length;
  const totalDecisions = Math.max(1, state.decisionsMade.length);
  const tacticalRatio = goodDecisions / totalDecisions;
  const responseSpeedScore = Math.round(50 + tacticalRatio * 45);

  // Weighted Overall Composite (NIST / CIS Aligned Model)
  const overallScore = Math.round(
    securityPosture * 0.3 +
    businessScore * 0.25 +
    financialScore * 0.2 +
    dataProtectionScore * 0.15 +
    responseSpeedScore * 0.1
  );

  let grade = 'NEEDS IMPROVEMENT';
  let gradeColor = 'text-amber-400';
  let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  let summaryRationale = '';

  if (overallScore >= 90) {
    grade = 'EXCELLENT';
    gradeColor = 'text-emerald-400';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    summaryRationale =
      'World-class incident command. Threat propagation was severed swiftly while preserving enterprise core operations, minimizing capital loss, and maintaining regulatory compliance.';
  } else if (overallScore >= 75) {
    grade = 'STRONG';
    gradeColor = 'text-cyan-400';
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    summaryRationale =
      'Sound tactical leadership. The incident was contained with acceptable business disruption, avoiding existential extortion payoffs while maintaining evidence chain of custody.';
  } else if (overallScore >= 60) {
    grade = 'NEEDS IMPROVEMENT';
    gradeColor = 'text-amber-400';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    summaryRationale =
      'Operational containment was achieved, but delayed segmentation or excessive collateral outages caused significant financial and data exposure liabilities.';
  } else {
    grade = 'CRITICAL FAILURE';
    gradeColor = 'text-rose-400';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    summaryRationale =
      'Severe crisis breakdown. Unchecked lateral movement, extortion capitulation, or catastrophic data loss resulted in severe regulatory and reputational penalties.';
  }

  return {
    overallScore,
    grade,
    gradeColor,
    badgeColor,
    summaryRationale,
    dimensions: [
      { name: 'Security Posture', score: securityPosture, weight: '30%', description: 'Integrity of identity boundaries, network segmentation, and endpoint defense' },
      { name: 'Business Continuity', score: businessScore, weight: '25%', description: 'Minimization of core system downtime and revenue interruption' },
      { name: 'Financial Prudence', score: financialScore, weight: '20%', description: 'Mitigation of extortion demands, legal costs, and recovery overhead' },
      { name: 'Data Protection', score: dataProtectionScore, weight: '15%', description: 'Prevention of client PII exfiltration and regulatory exposure' },
      { name: 'Response Decisiveness', score: responseSpeedScore, weight: '10%', description: 'Timeliness and tactical efficiency of containment actions' }
    ]
  };
}
