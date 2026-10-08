/**
 * Formatting and telemetry helpers for CyberSim SOC
 */

export function formatCurrency(amount) {
  if (amount == null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num) {
  if (num == null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function getSeverityStyle(severity) {
  const sev = (severity || '').toUpperCase();
  if (sev.includes('CRITICAL') || sev.includes('SEV-1')) {
    return {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/50',
      text: 'text-rose-400',
      dot: 'bg-rose-500'
    };
  }
  if (sev.includes('HIGH') || sev.includes('SEV-2')) {
    return {
      bg: 'bg-orange-950/60',
      border: 'border-orange-500/50',
      text: 'text-orange-400',
      dot: 'bg-orange-500'
    };
  }
  if (sev.includes('MEDIUM') || sev.includes('MODERATE') || sev.includes('SEV-3')) {
    return {
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      dot: 'bg-amber-500'
    };
  }
  return {
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500'
  };
}

export function getCategoryBadge(category) {
  switch (category) {
    case 'INITIAL_ACCESS':
      return { label: 'Initial Access', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    case 'PRIV_ESCALATION':
      return { label: 'Privilege Escalation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    case 'LATERAL_MOVEMENT':
      return { label: 'Lateral Movement', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
    case 'IMPACT':
      return { label: 'Impact / Encryption', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    case 'EXFILTRATION':
      return { label: 'Data Exfiltration', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    case 'RECOVERY':
      return { label: 'Eradication & Recovery', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    default:
      return { label: category || 'Incident Event', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
  }
}
