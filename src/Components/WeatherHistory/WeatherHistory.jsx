import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  TrendingDown,
  CloudRain,
  Wind,
  Calendar,
  Thermometer,
  Minus
} from 'lucide-react';
import {
  formatTemp,
  formatTempUnit,
  formatDayDate,
  getWeatherAssetIcon
} from '../../utils/weatherUtils';
import './WeatherHistory.css';

export default function WeatherHistory({ weather, unit }) {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain'

  if (!weather || !weather.history) return null;

  const { history, current, daily } = weather;
  const { pastDays = [], yesterday, todayVsYesterday, weeklyAvgMax, weeklyAvgMin, weeklyTotalRain } = history;

  const todayRecord = daily?.[0] || {
    maxTemp: current.high,
    minTemp: current.low,
    rainSum: 0,
    condition: current.condition,
    iconCode: current.iconCode,
    date: new Date().toISOString().split('T')[0],
  };

  // Combine past days + today for complete 8-day sequence
  const trendDays = [...pastDays, todayRecord];

  // Calculate range for temperature graph scaling
  const allMaxs = trendDays.map((d) => d.maxTemp);
  const allMins = trendDays.map((d) => d.minTemp);
  const maxTempScale = Math.max(...allMaxs, 25);
  const minTempScale = Math.min(...allMins, 0);
  const tempRange = Math.max(1, maxTempScale - minTempScale);

  // Precipitation maximum for rain bar scaling
  const maxRainDay = Math.max(...trendDays.map((d) => d.rainSum || 0), 5);

  const tempDiff = todayVsYesterday?.tempDiff ?? 0;
  const isWarmer = tempDiff > 0;
  const isColder = tempDiff < 0;

  return (
    <section className="weather-history-card" aria-label="Weather History & Trends">
      <div className="history-header">
        <div className="history-title-row">
          <div className="history-icon-wrap">
            <History size={18} className="history-icon" />
          </div>
          <div>
            <h2 className="history-heading">Weather History & 7-Day Trends</h2>
            <p className="history-subtitle">Observed past meteorological telemetry vs today</p>
          </div>
        </div>

        {/* Metric tab switcher */}
        <div className="history-metric-tabs">
          <button
            type="button"
            className={`metric-tab-btn ${activeTab === 'temp' ? 'active' : ''}`}
            onClick={() => setActiveTab('temp')}
          >
            <Thermometer size={14} />
            <span>Temperature</span>
          </button>
          <button
            type="button"
            className={`metric-tab-btn ${activeTab === 'rain' ? 'active' : ''}`}
            onClick={() => setActiveTab('rain')}
          >
            <CloudRain size={14} />
            <span>Precipitation</span>
          </button>
        </div>
      </div>

      {/* Today vs Yesterday Spotlight Comparison */}
      <div className="history-spotlight-grid">
        <div className="spotlight-card delta-card">
          <div className="spotlight-label-row">
            <Calendar size={14} className="text-sky-400" />
            <span className="spotlight-label">Today vs Yesterday</span>
          </div>

          <div className="delta-val-row">
            <div className="delta-temp-group">
              <span className="delta-number">
                {isWarmer ? `+${tempDiff}` : isColder ? `${tempDiff}` : '0'}°
              </span>
              <div className="delta-trend-badge">
                {isWarmer ? (
                  <>
                    <TrendingUp size={14} className="text-rose-400" />
                    <span className="text-rose-400">Warmer</span>
                  </>
                ) : isColder ? (
                  <>
                    <TrendingDown size={14} className="text-sky-400" />
                    <span className="text-sky-400">Cooler</span>
                  </>
                ) : (
                  <>
                    <Minus size={14} className="text-slate-400" />
                    <span>Identical</span>
                  </>
                )}
              </div>
            </div>
            <p className="delta-expl">
              Today's maximum is {formatTemp(todayRecord.maxTemp, unit)}{formatTempUnit(unit)} compared to yesterday's{' '}
              {yesterday ? `${formatTemp(yesterday.maxTemp, unit)}${formatTempUnit(unit)}` : '--'}.
            </p>
          </div>
        </div>

        <div className="spotlight-card benchmark-card">
          <div className="spotlight-label-row">
            <TrendingUp size={14} className="text-amber-400" />
            <span className="spotlight-label">Past 7-Day Baseline</span>
          </div>

          <div className="benchmark-stats">
            <div className="bench-item">
              <span className="bench-sub">Weekly Avg High</span>
              <span className="bench-num">
                {formatTemp(weeklyAvgMax, unit)}{formatTempUnit(unit)}
              </span>
            </div>
            <div className="bench-item">
              <span className="bench-sub">Weekly Avg Low</span>
              <span className="bench-num">
                {formatTemp(weeklyAvgMin, unit)}{formatTempUnit(unit)}
              </span>
            </div>
            <div className="bench-item">
              <span className="bench-sub">Total Past Rain</span>
              <span className="bench-num">{weeklyTotalRain} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 8-Day Historical Visualizer */}
      <div className="history-visual-box">
        <div className="visual-top-bar">
          <span className="visual-title">
            {activeTab === 'temp' ? '8-Day Temperature Progression (Past 7 Days + Today)' : '8-Day Precipitation History'}
          </span>
          <span className="visual-legend">
            {activeTab === 'temp' ? '● Daily High  ○ Daily Low' : '■ Rain Volume (mm)'}
          </span>
        </div>

        {activeTab === 'temp' ? (
          <div className="temp-trend-chart">
            <div className="chart-days-grid">
              {trendDays.map((day, idx) => {
                const isToday = idx === trendDays.length - 1;
                const { dayName, dateFormatted } = formatDayDate(day.date);
                const assetIcon = getWeatherAssetIcon(day.iconCode);

                // Heights for temperature range bar
                const barTop = ((maxTempScale - day.maxTemp) / tempRange) * 100;
                const barBottom = ((maxTempScale - day.minTemp) / tempRange) * 100;
                const barHeight = Math.max(12, barBottom - barTop);

                return (
                  <div key={`trend-day-${day.date}-${idx}`} className={`chart-day-col ${isToday ? 'today-col' : ''}`}>
                    {/* High Temp */}
                    <span className="trend-temp-high">{formatTemp(day.maxTemp, unit)}°</span>

                    {/* Temperature Pill Track */}
                    <div className="trend-bar-track">
                      <div
                        className="trend-bar-range"
                        style={{
                          top: `${Math.max(4, Math.min(85, barTop))}%`,
                          height: `${Math.max(10, Math.min(80, barHeight))}%`,
                        }}
                      />
                    </div>

                    {/* Low Temp */}
                    <span className="trend-temp-low">{formatTemp(day.minTemp, unit)}°</span>

                    {/* Weather Icon */}
                    <img src={assetIcon} alt={day.condition} className="trend-day-icon" />

                    {/* Day Name */}
                    <div className="trend-day-label">
                      <span className={`name ${isToday ? 'active-today' : ''}`}>{dayName}</span>
                      <span className="date">{dateFormatted}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rain-trend-chart">
            <div className="chart-days-grid">
              {trendDays.map((day, idx) => {
                const isToday = idx === trendDays.length - 1;
                const { dayName, dateFormatted } = formatDayDate(day.date);
                const rainMm = day.rainSum || 0;
                const heightPercent = Math.max(6, Math.min(100, (rainMm / maxRainDay) * 100));

                return (
                  <div key={`rain-trend-${day.date}-${idx}`} className={`chart-day-col ${isToday ? 'today-col' : ''}`}>
                    <span className="rain-volume-label">{rainMm > 0 ? `${rainMm}mm` : 'Dry'}</span>

                    <div className="rain-bar-track">
                      <div
                        className={`rain-bar-fill ${rainMm > 0 ? 'has-rain' : 'zero-rain'}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <div className="trend-day-label">
                      <span className={`name ${isToday ? 'active-today' : ''}`}>{dayName}</span>
                      <span className="date">{dateFormatted}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
