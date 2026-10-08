import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { calculateForecastConfidence } from '../../utils/weatherUtils';
import './ForecastConfidence.css';

export default function ForecastConfidence({ weather }) {
  const confidence = calculateForecastConfidence(weather);

  const getBadgeClass = (level) => {
    switch (level) {
      case 'HIGH':
        return 'confidence-badge-high';
      case 'MODERATE':
        return 'confidence-badge-mod';
      default:
        return 'confidence-badge-caution';
    }
  };

  return (
    <div className="forecast-confidence-card">
      <div className="confidence-header">
        <div className="confidence-title-row">
          <ShieldCheck size={18} className="confidence-icon" />
          <h3 className="confidence-title">Forecast Model Confidence</h3>
        </div>
        <div className={`confidence-level-badge ${getBadgeClass(confidence.level)}`}>
          <span>{confidence.level}</span>
          <span className="confidence-score-num">({confidence.score}%)</span>
        </div>
      </div>

      <p className="confidence-summary">{confidence.summary}</p>

      <div className="confidence-factors-list">
        {confidence.factors.map((factor, idx) => (
          <div key={`factor-${idx}`} className="confidence-factor-item">
            <CheckCircle2 size={13} className="factor-check-icon" />
            <span>{factor}</span>
          </div>
        ))}
      </div>

      <div className="confidence-disclaimer">
        <Info size={12} />
        <span>Synthesized from Open-Meteo ECMWF/GFS boundary layer stability & precipitation consistency.</span>
      </div>
    </div>
  );
}
