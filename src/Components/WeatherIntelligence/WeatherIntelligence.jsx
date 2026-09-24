import React from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  CloudRain,
  Wind,
  Droplets,
  BookOpen,
  CalendarRange
} from 'lucide-react';
import {
  detectWeatherChanges,
  generateWeatherStory,
  formatHourTime
} from '../../utils/weatherUtils';
import './WeatherIntelligence.css';

export default function WeatherIntelligence({ weather, timezoneOffsetSeconds }) {
  if (!weather || !weather.current) return null;

  const changes = detectWeatherChanges(weather);
  const story = generateWeatherStory(weather);
  const next12Hours = (weather.hourly || []).slice(0, 12);

  // Peak rain window calculation
  const maxRainHour = next12Hours.reduce(
    (max, h) => (h.pop > (max?.pop || 0) ? h : max),
    null
  );
  const hasRain = maxRainHour && maxRainHour.pop >= 20;

  return (
    <section className="weather-intelligence-card" aria-label="Weather Intelligence">
      <div className="intelligence-header">
        <div className="intel-title-row">
          <div className="intel-icon-wrap">
            <Sparkles size={18} className="intel-sparkle-icon" />
          </div>
          <div>
            <h2 className="intel-heading">Weather Intelligence & Insights</h2>
            <p className="intel-subtitle">Atmospheric trend analysis & forecast narrative</p>
          </div>
        </div>
      </div>

      <div className="intel-grid">
        {/* Today's Weather Story */}
        <div className="intel-box story-box">
          <div className="box-header">
            <BookOpen size={16} className="text-sky-400" />
            <h3 className="box-title">Today's Weather Story</h3>
          </div>
          <p className="story-paragraph">{story}</p>
        </div>

        {/* Weather Changes Detector */}
        <div className="intel-box changes-box">
          <div className="box-header">
            <TrendingUp size={16} className="text-amber-400" />
            <h3 className="box-title">Weather Changes Ahead</h3>
          </div>
          {changes.length > 0 ? (
            <div className="changes-list">
              {changes.map((change, idx) => (
                <div key={`change-${idx}`} className={`change-item change-${change.severity}`}>
                  <div className="change-icon">
                    {change.type === 'temp-drop' && <TrendingDown size={15} className="text-sky-400" />}
                    {change.type === 'temp-rise' && <TrendingUp size={15} className="text-amber-400" />}
                    {change.type === 'rain-arrival' && <CloudRain size={15} className="text-sky-400" />}
                    {change.type === 'wind-increase' && <Wind size={15} className="text-amber-400" />}
                    {change.type === 'humidity-shift' && <Droplets size={15} className="text-indigo-400" />}
                  </div>
                  <div className="change-text">
                    <span className="change-title">{change.title}</span>
                    <span className="change-msg">{change.message}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="steady-msg">
              Stable atmospheric conditions expected across the next 12 hours with no extreme swings.
            </p>
          )}
        </div>

        {/* Rain Window / Precipitation Timeline */}
        <div className="intel-box rain-window-box">
          <div className="box-header">
            <CloudRain size={16} className="text-sky-400" />
            <h3 className="box-title">Precipitation Window (Next 12 Hours)</h3>
          </div>

          <div className="rain-window-status">
            {hasRain ? (
              <span className="rain-peak-alert">
                Highest probability around {formatHourTime(maxRainHour.time, timezoneOffsetSeconds)} ({maxRainHour.pop}%)
              </span>
            ) : (
              <span className="rain-clear-status">
                No precipitation anticipated in the upcoming 12 hours
              </span>
            )}
          </div>

          {/* Hourly bar chart */}
          <div className="rain-bars-track">
            {next12Hours.map((h, i) => {
              const timeLabel = i === 0 ? 'Now' : formatHourTime(h.time, timezoneOffsetSeconds);
              const heightPercent = Math.max(8, h.pop || 0);
              const isPeak = maxRainHour && maxRainHour.time === h.time && h.pop > 15;

              return (
                <div key={`rain-bar-${h.time}-${i}`} className="rain-bar-col">
                  <div className="rain-bar-container">
                    <div
                      className={`rain-bar-fill ${isPeak ? 'peak' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="bar-pop-text">{h.pop || 0}%</span>
                  <span className="bar-time-text">{timeLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
