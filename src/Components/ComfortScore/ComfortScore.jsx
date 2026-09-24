import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { calculateComfortScore } from '../../utils/weatherUtils';
import './ComfortScore.css';

export default function ComfortScore({ weather }) {
  const comfort = calculateComfortScore(weather);

  // Determine meter color based on score
  let strokeColor = '#10b981'; // emerald
  if (comfort.score < 50) strokeColor = '#f43f5e'; // rose
  else if (comfort.score < 70) strokeColor = '#f59e0b'; // amber
  else if (comfort.score < 85) strokeColor = '#38bdf8'; // sky

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (comfort.score / 100) * circumference;

  return (
    <div className="comfort-score-card">
      <div className="comfort-header">
        <div className="comfort-title-row">
          <ShieldCheck size={18} className="comfort-shield-icon" />
          <h3 className="comfort-title">Weather Comfort Score</h3>
        </div>
        <span className="comfort-disclaimer-pill" title="Convenience calculation">
          <Info size={11} />
          <span>Application Indicator</span>
        </span>
      </div>

      <div className="comfort-body">
        {/* Circular score dial */}
        <div className="score-dial-wrap">
          <svg className="score-svg" width="96" height="96" viewBox="0 0 96 96">
            <circle
              className="score-track"
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="7"
            />
            <circle
              className="score-fill"
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="7"
              stroke={strokeColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
            />
          </svg>
          <div className="score-dial-center">
            <span className="score-number">{comfort.score}</span>
            <span className="score-total">/100</span>
          </div>
        </div>

        {/* Textual explanation */}
        <div className="comfort-text-group">
          <div className="comfort-status-badge" style={{ color: strokeColor }}>
            {comfort.label}
          </div>
          <p className="comfort-desc">{comfort.description}</p>
          <div className="comfort-factors">
            <span>Temp · Humidity · Wind · Rain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
