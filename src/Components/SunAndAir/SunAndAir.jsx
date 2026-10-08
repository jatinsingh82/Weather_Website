import React from 'react';
import {
  Sunrise,
  Sunset,
  Sun,
  Clock,
  AlertCircle,
  Activity,
  Camera,
  Sparkles
} from 'lucide-react';
import { getSunProgress, calculateAstronomy } from '../../utils/weatherUtils';
import './SunAndAir.css';

export default function SunAndAir({ current, airQuality, timezoneOffsetSeconds }) {
  if (!current) return null;

  const sunData = getSunProgress(current.sunrise, current.sunset, timezoneOffsetSeconds);
  const astronomy = calculateAstronomy(current, timezoneOffsetSeconds);

  // SVG arc parameters for sun position
  const p = sunData.progress / 100;
  const x0 = 15, y0 = 85;
  const x1 = 100, y1 = 15;
  const x2 = 185, y2 = 85;
  const sunX = (1 - p) * (1 - p) * x0 + 2 * (1 - p) * p * x1 + p * p * x2;
  const sunY = (1 - p) * (1 - p) * y0 + 2 * (1 - p) * p * y1 + p * p * y2;

  // AQI level color
  let aqiColor = '#10b981'; // Good
  if (airQuality) {
    if (airQuality.index >= 4 || airQuality.aqi > 150) aqiColor = '#f43f5e';
    else if (airQuality.index === 3 || airQuality.aqi > 100) aqiColor = '#f59e0b';
    else if (airQuality.index === 2 || airQuality.aqi > 50) aqiColor = '#38bdf8';
  }

  return (
    <div className="sun-and-air-grid">
      {/* Sun & Daylight Arc Card */}
      <div className="card-item sun-arc-card">
        <div className="card-header">
          <div className="header-title-group">
            <Sun size={18} className="text-amber-400" />
            <h3 className="card-title">Sun & Daylight Arc</h3>
          </div>
          <span className="card-badge">{sunData.daylightDuration || 'Daylight'}</span>
        </div>

        {/* Visual arc */}
        <div className="arc-visual-container">
          <svg className="sun-arc-svg" viewBox="0 0 200 95">
            <line x1="10" y1="85" x2="190" y2="85" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
            <path
              d="M 15 85 Q 100 15 185 85"
              fill="none"
              stroke="rgba(251, 191, 36, 0.25)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <circle
              cx={sunX}
              cy={sunY}
              r="7"
              fill="#fbbf24"
              filter="drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))"
            />
            <circle cx={sunX} cy={sunY} r="3" fill="#ffffff" />
          </svg>
        </div>

        {/* Sunrise / Sunset timestamps */}
        <div className="arc-footer-row">
          <div className="arc-point">
            <Sunrise size={15} className="text-amber-400" />
            <div>
              <span className="point-label">Sunrise</span>
              <span className="point-time">{sunData.sunriseTime || '--:--'}</span>
            </div>
          </div>

          <div className="arc-center-info">
            <Clock size={12} />
            <span>{sunData.timeUntilSunset}</span>
          </div>

          <div className="arc-point right">
            <Sunset size={15} className="text-rose-400" />
            <div>
              <span className="point-label">Sunset</span>
              <span className="point-time">{sunData.sunsetTime || '--:--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photography & Astronomy Experience Card */}
      <div className="card-item photo-astronomy-card">
        <div className="card-header">
          <div className="header-title-group">
            <Camera size={18} className="text-indigo-400" />
            <h3 className="card-title">Photography & Astronomy</h3>
          </div>
          <div className="lunar-badge" title={`Illumination: ${astronomy.illumination}%`}>
            <span className="moon-icon">{astronomy.moonPhaseIcon}</span>
            <span>{astronomy.moonPhaseName} ({astronomy.illumination}%)</span>
          </div>
        </div>

        <div className="photo-windows-body">
          {/* Recommended photography window */}
          <div className="photo-window-hero">
            <div className="window-hero-top">
              <Sparkles size={13} className="text-amber-300" />
              <span className="window-hero-label">RECOMMENDED PHOTO WINDOW</span>
            </div>
            <span className="window-hero-time">{astronomy.bestPhotographyWindow}</span>
            <p className="window-hero-note">{astronomy.photoConditionsNote}</p>
          </div>

          {/* Golden & Blue hour strip */}
          <div className="light-hours-grid">
            <div className="light-hour-box">
              <span className="light-label">Morning Golden Hour</span>
              <span className="light-time">{astronomy.goldenHourMorning}</span>
            </div>
            <div className="light-hour-box">
              <span className="light-label">Evening Golden Hour</span>
              <span className="light-time">{astronomy.goldenHourEvening}</span>
            </div>
            <div className="light-hour-box">
              <span className="light-label">Dusk Blue Hour</span>
              <span className="light-time">{astronomy.blueHourEvening}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Air Quality & Atmosphere Card */}
      <div className="card-item air-quality-card">
        <div className="card-header">
          <div className="header-title-group">
            <Activity size={18} className="text-sky-400" />
            <h3 className="card-title">Air Quality & Atmosphere</h3>
          </div>
          {airQuality ? (
            <span className="aqi-level-badge" style={{ color: aqiColor, borderColor: aqiColor }}>
              {airQuality.level}
            </span>
          ) : (
            <span className="card-badge text-muted">Real-time Station</span>
          )}
        </div>

        {airQuality ? (
          <div className="air-quality-body">
            <div className="aqi-score-row">
              <div className="aqi-score-wrap">
                <span className="aqi-big-val" style={{ color: aqiColor }}>
                  {airQuality.aqi != null ? airQuality.aqi : airQuality.index}
                </span>
                <span className="aqi-scale">AQI Index</span>
              </div>
              <p className="aqi-explanation">
                {airQuality.level === 'Good'
                  ? 'Air quality is satisfactory with little to no risk for outdoor exposure.'
                  : airQuality.level === 'Moderate'
                  ? 'Acceptable air quality; sensitive individuals may experience minor irritation.'
                  : 'Elevated particle concentrations; reduce prolonged outdoor exertion.'}
              </p>
            </div>

            {/* Pollutants Breakdown */}
            <div className="pollutants-grid">
              {airQuality.pm2_5 != null && (
                <div className="pollutant-box">
                  <span className="p-label">PM2.5</span>
                  <span className="p-val">{airQuality.pm2_5} µg/m³</span>
                </div>
              )}
              {airQuality.pm10 != null && (
                <div className="pollutant-box">
                  <span className="p-label">PM10</span>
                  <span className="p-val">{airQuality.pm10} µg/m³</span>
                </div>
              )}
              {airQuality.no2 != null && (
                <div className="pollutant-box">
                  <span className="p-label">NO₂</span>
                  <span className="p-val">{airQuality.no2} µg/m³</span>
                </div>
              )}
              {airQuality.o3 != null && (
                <div className="pollutant-box">
                  <span className="p-label">O₃</span>
                  <span className="p-val">{airQuality.o3} µg/m³</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="air-unavailable-notice">
            <AlertCircle size={20} className="text-muted" />
            <p>
              Air quality telemetry is currently unavailable from regional monitoring stations for this exact location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
