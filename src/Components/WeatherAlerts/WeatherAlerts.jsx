import React, { useState } from 'react';
import { AlertTriangle, Info, Wind, CloudRain, Flame, Snowflake, X } from 'lucide-react';
import './WeatherAlerts.css';

export default function WeatherAlerts({ weather }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !weather || !weather.current) return null;

  const { temp, windSpeed, condition } = weather.current;
  const condLower = (condition || '').toLowerCase();
  const maxRain = weather.hourly?.length > 0 ? Math.max(...weather.hourly.slice(0, 6).map((h) => h.pop || 0)) : 0;

  const alerts = [];

  if (condLower.includes('thunder') || condLower.includes('storm')) {
    alerts.push({
      type: 'thunderstorm',
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      title: 'Thunderstorm Active / Imminent',
      desc: 'Electrical activity detected in the area. Seek sturdy indoor shelter.',
      isOfficial: false,
    });
  } else if (maxRain >= 75 || condLower.includes('heavy rain')) {
    alerts.push({
      type: 'rain',
      icon: <CloudRain size={18} className="text-sky-400" />,
      title: 'Heavy Precipitation Advisory',
      desc: `High rainfall probability of ${maxRain}% expected within the next 6 hours. Expect road spray and standing water.`,
      isOfficial: false,
    });
  }

  if (windSpeed >= 42) {
    alerts.push({
      type: 'wind',
      icon: <Wind size={18} className="text-amber-400" />,
      title: 'High Wind Advisory',
      desc: `Sustained winds exceeding ${windSpeed} km/h. Secure loose outdoor items and exercise caution when driving high-sided vehicles.`,
      isOfficial: false,
    });
  }

  if (temp >= 36) {
    alerts.push({
      type: 'heat',
      icon: <Flame size={18} className="text-rose-400" />,
      title: 'Excessive Heat Advisory',
      desc: `Ambient temperatures reaching ${temp}°C. Stay hydrated, avoid strenuous midday activity, and stay in cool areas.`,
      isOfficial: false,
    });
  } else if (temp <= -2) {
    alerts.push({
      type: 'freeze',
      icon: <Snowflake size={18} className="text-cyan-400" />,
      title: 'Freezing Temperature Advisory',
      desc: `Sub-zero conditions at ${temp}°C. Watch for black ice on elevated roads and protect exposed plumbing.`,
      isOfficial: false,
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="alerts-container" role="region" aria-label="Weather Advisories">
      {alerts.map((alert, index) => (
        <div key={`alert-${alert.type}-${index}`} className={`alert-banner alert-${alert.type}`}>
          <div className="alert-content">
            <div className="alert-icon-wrap">{alert.icon}</div>
            <div className="alert-text">
              <div className="alert-title-row">
                <span className="alert-heading">{alert.title}</span>
                <span className="alert-tag">Weather-based application insight</span>
              </div>
              <p className="alert-desc">{alert.desc}</p>
            </div>
          </div>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={() => setDismissed(true)}
            title="Dismiss advisory"
            aria-label="Dismiss advisory"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
