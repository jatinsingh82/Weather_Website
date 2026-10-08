import React, { useState } from 'react';
import {
  AlertTriangle,
  Wind,
  CloudRain,
  Flame,
  Snowflake,
  Sun,
  TrendingDown,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { detectSmartWeatherEvents } from '../../utils/weatherUtils';
import './WeatherAlerts.css';

export default function WeatherAlerts({ weather }) {
  const [dismissedIds, setDismissedIds] = useState(new Set());

  if (!weather || !weather.current) return null;

  const { temp, windSpeed, condition } = weather.current;
  const condLower = (condition || '').toLowerCase();
  const timezoneOffsetSeconds = weather.timezoneOffsetSeconds || 0;

  // 1. Proactive Timed Smart Events
  const smartEvents = detectSmartWeatherEvents(weather, timezoneOffsetSeconds);

  // 2. Severe Threshold Alerts
  const severeAlerts = [];

  if (condLower.includes('thunder') || condLower.includes('storm')) {
    severeAlerts.push({
      id: 'storm-critical',
      type: 'thunderstorm',
      severity: 'warning',
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      title: 'Thunderstorm Active in Immediate Vicinity',
      timing: 'Active Now',
      desc: 'Electrical activity detected in the local Doppler sweep. Seek indoor shelter.',
    });
  }

  if (windSpeed >= 42) {
    severeAlerts.push({
      id: 'wind-severe',
      type: 'wind',
      severity: 'advisory',
      icon: <Wind size={18} className="text-amber-400" />,
      title: `High Sustained Winds (${windSpeed} km/h)`,
      timing: 'Ongoing',
      desc: 'Secure loose outdoor items and exercise caution when driving high-sided vehicles.',
    });
  }

  if (temp >= 36) {
    severeAlerts.push({
      id: 'heat-severe',
      type: 'heat',
      severity: 'warning',
      icon: <Flame size={18} className="text-rose-400" />,
      title: `Excessive Heat Advisory (${temp}°C)`,
      timing: 'Peak Hours',
      desc: 'Elevated thermal stress. Maintain hydration and minimize strenuous midday exposure.',
    });
  } else if (temp <= -2) {
    severeAlerts.push({
      id: 'freeze-severe',
      type: 'freeze',
      severity: 'warning',
      icon: <Snowflake size={18} className="text-cyan-400" />,
      title: `Sub-Zero Freeze Advisory (${temp}°C)`,
      timing: 'Active',
      desc: 'Watch for black ice formation on untreated bridges and road surfaces.',
    });
  }

  // Combine and deduplicate
  const allEvents = [...severeAlerts, ...smartEvents].filter(
    (e) => !dismissedIds.has(e.id)
  );

  if (allEvents.length === 0) return null;

  const dismissEvent = (id) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const getEventIcon = (event) => {
    if (event.icon) return event.icon;
    switch (event.type) {
      case 'rain':
        return <CloudRain size={18} className="text-sky-400" />;
      case 'clear':
        return <Sparkles size={18} className="text-emerald-400" />;
      case 'temp-drop':
        return <TrendingDown size={18} className="text-sky-400" />;
      case 'uv':
        return <Sun size={18} className="text-amber-400" />;
      case 'wind':
        return <Wind size={18} className="text-amber-400" />;
      case 'freeze':
        return <Snowflake size={18} className="text-cyan-400" />;
      default:
        return <AlertTriangle size={18} className="text-amber-400" />;
    }
  };

  return (
    <div className="alerts-container" role="region" aria-label="Smart Weather Events & Advisories">
      {allEvents.map((evt) => (
        <div key={`alert-${evt.id}`} className={`alert-banner alert-${evt.severity || 'advisory'}`}>
          <div className="alert-content">
            <div className="alert-icon-wrap">{getEventIcon(evt)}</div>
            <div className="alert-text">
              <div className="alert-title-row">
                <span className="alert-heading">{evt.title}</span>
                {evt.timing && (
                  <span className="alert-timing-pill">
                    <Clock size={11} />
                    <span>{evt.timing}</span>
                  </span>
                )}
              </div>
              <p className="alert-desc">{evt.desc || evt.description}</p>
            </div>
          </div>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={() => dismissEvent(evt.id)}
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
