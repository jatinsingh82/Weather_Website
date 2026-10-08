import React, { useState, useEffect } from 'react';
import {
  Dna,
  CloudRain,
  Wind,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  generateWeatherDNA,
  formatTemp,
  formatTempUnit,
  calculatePersonalCompatibility
} from '../../utils/weatherUtils';
import './WeatherDNA.css';

const DEFAULT_PROFILE = {
  idealMin: 18,
  idealMax: 24,
  rainTolerance: 'low', // 'zero' | 'low' | 'any'
  windTolerance: 'moderate', // 'calm' | 'moderate' | 'high'
};

export default function WeatherDNA({ weather, hourly, currentTemp, unit }) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('weathernow_user_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weathernow_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save weather profile:', e);
    }
  }, [profile]);

  const dnaPhases = generateWeatherDNA(hourly, currentTemp);
  const compatibility = calculatePersonalCompatibility(weather, profile);

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="weather-dna-card" aria-label="Weather DNA & Personal Compatibility">
      <div className="dna-header">
        <div className="dna-title-group">
          <div className="dna-icon-wrap">
            <Dna size={20} className="dna-pulse-icon" />
          </div>
          <div>
            <h2 className="dna-heading">Weather DNA & Compatibility</h2>
            <p className="dna-subtitle">Daily atmospheric rhythm & personal comfort alignment</p>
          </div>
        </div>

        <div className="dna-header-actions">
          <button
            type="button"
            className={`dna-pref-toggle-btn ${showPreferences ? 'active' : ''}`}
            onClick={() => setShowPreferences(!showPreferences)}
            aria-expanded={showPreferences}
          >
            <Sliders size={13} />
            <span>My Comfort Profile</span>
            {showPreferences ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Personal Compatibility Spotlight */}
      <div className="personal-compatibility-spotlight">
        <div className="compat-score-col">
          <span className="compat-pct">{compatibility?.score ?? 80}%</span>
          <div className="compat-meta">
            <span className="compat-title">Today's Personal Compatibility</span>
            <span className="compat-grade">{compatibility?.matchGrade || 'Good Match'}</span>
          </div>
        </div>

        <div className="compat-breakdown-list">
          {(compatibility?.breakdown || []).map((item, idx) => (
            <div key={`compat-item-${idx}`} className="compat-item-row">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Personal Profile Customizer */}
      {showPreferences && (
        <div className="profile-customizer-panel">
          <div className="pref-row">
            <span className="pref-label">Ideal Temperature Range:</span>
            <div className="pref-chips-group">
              <button
                type="button"
                className={`pref-chip ${profile.idealMin === 15 && profile.idealMax === 20 ? 'selected' : ''}`}
                onClick={() => setProfile((p) => ({ ...p, idealMin: 15, idealMax: 20 }))}
              >
                Cool (15–20°C)
              </button>
              <button
                type="button"
                className={`pref-chip ${profile.idealMin === 18 && profile.idealMax === 24 ? 'selected' : ''}`}
                onClick={() => setProfile((p) => ({ ...p, idealMin: 18, idealMax: 24 }))}
              >
                Mild (18–24°C)
              </button>
              <button
                type="button"
                className={`pref-chip ${profile.idealMin === 22 && profile.idealMax === 28 ? 'selected' : ''}`}
                onClick={() => setProfile((p) => ({ ...p, idealMin: 22, idealMax: 28 }))}
              >
                Warm (22–28°C)
              </button>
            </div>
          </div>

          <div className="pref-row">
            <span className="pref-label">Precipitation Tolerance:</span>
            <div className="pref-chips-group">
              <button
                type="button"
                className={`pref-chip ${profile.rainTolerance === 'zero' ? 'selected' : ''}`}
                onClick={() => updateProfile('rainTolerance', 'zero')}
              >
                Zero Rain Only
              </button>
              <button
                type="button"
                className={`pref-chip ${profile.rainTolerance === 'low' ? 'selected' : ''}`}
                onClick={() => updateProfile('rainTolerance', 'low')}
              >
                Light Mist / Drizzle OK
              </button>
              <button
                type="button"
                className={`pref-chip ${profile.rainTolerance === 'any' ? 'selected' : ''}`}
                onClick={() => updateProfile('rainTolerance', 'any')}
              >
                All-Weather
              </button>
            </div>
          </div>

          <div className="pref-row">
            <span className="pref-label">Wind Preference:</span>
            <div className="pref-chips-group">
              <button
                type="button"
                className={`pref-chip ${profile.windTolerance === 'calm' ? 'selected' : ''}`}
                onClick={() => updateProfile('windTolerance', 'calm')}
              >
                Calm (&lt;18 km/h)
              </button>
              <button
                type="button"
                className={`pref-chip ${profile.windTolerance === 'moderate' ? 'selected' : ''}`}
                onClick={() => updateProfile('windTolerance', 'moderate')}
              >
                Moderate (Up to 28 km/h)
              </button>
              <button
                type="button"
                className={`pref-chip ${profile.windTolerance === 'high' ? 'selected' : ''}`}
                onClick={() => updateProfile('windTolerance', 'high')}
              >
                Wind Tolerant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Phases Atmospheric Personality Timeline Grid */}
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
