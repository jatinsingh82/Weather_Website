/**
 * Weather formatting and metric conversion helpers
 */

export function convertTemp(celsius, unit = 'C') {
  if (celsius == null) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function convertSpeed(kmh, unit = 'metric') {
  if (kmh == null) return '--';
  if (unit === 'imperial') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function convertPrecip(mm, unit = 'metric') {
  if (mm == null) return '0 mm';
  if (unit === 'imperial') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function convertPressure(hPa, unit = 'metric') {
  if (hPa == null) return '--';
  if (unit === 'imperial') {
    return `${(hPa * 0.02953).toFixed(2)} inHg`;
  }
  return `${Math.round(hPa)} hPa`;
}

export function formatTime(isoString) {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return isoString;
  }
}

export function formatHour(isoString) {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch {
    return isoString;
  }
}

export function formatDayName(isoDate, index = 0) {
  if (!isoDate) return '--';
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString([], { weekday: 'short' });
  } catch {
    return isoDate;
  }
}

export function formatFullDate(isoDate) {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return isoDate;
  }
}

export function getAqiCategory(aqi) {
  if (aqi == null) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
  return { label: 'Hazardous', color: 'text-red-600', bg: 'bg-red-500/10 border-red-500/20' };
}

export function getUvCategory(uv) {
  if (uv == null) return { label: 'Low', color: 'text-emerald-400' };
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400' };
  if (uv < 6) return { label: 'Moderate', color: 'text-yellow-400' };
  if (uv < 8) return { label: 'Very High', color: 'text-orange-400' };
  if (uv < 11) return { label: 'Extreme', color: 'text-rose-400' };
  return { label: 'Extreme Danger', color: 'text-purple-400' };
}
