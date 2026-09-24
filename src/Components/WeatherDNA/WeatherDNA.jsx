import React from 'react';
import { Dna, Sparkles, CloudRain, Wind } from 'lucide-react';
import { generateWeatherDNA, formatTemp, formatTempUnit } from '../../utils/weatherUtils';
import './WeatherDNA.css';

export default function WeatherDNA({ hourly, currentTemp, unit }) {
  const dnaPhases = generateWeatherDNA(hourly, currentTemp);

  return (
    <section className="weather-dna-card" aria-label="Weather DNA">
      <div className="dna-header">
        <div className="dna-title-group">
          <div className="dna-icon-wrap">
            <Dna size={20} className="dna-pulse-icon" />
          </div>
          <div>
            <h2 className="dna-heading">Weather DNA</h2>
            <p className="dna-subtitle">Daily atmospheric personality & rhythm</p>
          </div>
        </div>

        <div className="dna-tag-badge">
          <Sparkles size={12} />
          <span>Calculated from Hourly Model</span>
        </div>
      </div>

      {/* 4 Phases Timeline Grid */}
      <div className="dna-timeline-grid">
        {dnaPhases.map((phase, idx) => (
          <div key={`dna-${phase.phase}-${idx}`} className="dna-phase-card">
            <div className="phase-top-bar">
              <span className="phase-name">{phase.phase}</span>
              <span className="phase-time">
                {phase.phase === 'Morning' && '6 AM – 12 PM'}
                {phase.phase === 'Afternoon' && '12 PM – 5 PM'}
                {phase.phase === 'Evening' && '5 PM – 9 PM'}
                {phase.phase === 'Night' && '9 PM – 6 AM'}
              </span>
            </div>

            <div className="phase-body">
              <img src={phase.icon} alt={phase.personality} className="phase-icon-img" />
              <div className="phase-info">
                <span className="phase-temp">
                  {formatTemp(phase.temp, unit)}{formatTempUnit(unit)}
                </span>
                <span className="phase-personality">{phase.personality}</span>
              </div>
            </div>

            <div className="phase-footer">
              {phase.pop > 10 ? (
                <span className="phase-metric text-rain">
                  <CloudRain size={12} /> {phase.pop}% rain
                </span>
              ) : (
                <span className="phase-metric text-wind">
                  <Wind size={12} /> {phase.wind || 10} km/h
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Continuous atmospheric bar */}
      <div className="dna-continuous-bar">
        <div className="bar-gradient" />
        <div className="bar-labels">
          <span>Dawn</span>
          <span>Midday</span>
          <span>Sunset</span>
          <span>Dusk</span>
          <span>Midnight</span>
        </div>
      </div>
    </section>
  );
}
