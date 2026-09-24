import React, { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, CloudRain, Sunrise, Sunset, Wind, Sun } from 'lucide-react';
import {
  formatTemp,
  formatTempUnit,
  formatWindSpeed,
  formatWindUnit,
  formatDayDate,
  getWeatherAssetIcon
} from '../../utils/weatherUtils';
import './DailyForecast.css';

export default function DailyForecast({ daily, unit }) {
  const [expandedIndex, setExpandedIndex] = useState(0); // Today expanded by default

  if (!daily || daily.length === 0) return null;

  // Find min and max across all 7 days for temperature bar scale
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const overallMin = Math.min(...allMins);
  const overallMax = Math.max(...allMaxs);
  const overallRange = Math.max(1, overallMax - overallMin);

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const formatTimeStr = (isoStr) => {
    if (!isoStr) return '--:--';
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <section className="daily-forecast-card" aria-label="7-Day Forecast">
      <div className="daily-header">
        <div className="daily-title-row">
          <div className="daily-icon-wrap">
            <CalendarDays size={18} className="daily-cal-icon" />
          </div>
          <div>
            <h2 className="daily-heading">7-Day Weather Outlook</h2>
            <p className="daily-subtitle">Extended precision forecast & temperature trends</p>
          </div>
        </div>
      </div>

      <div className="daily-list-container">
        {daily.map((day, index) => {
          const { dayName, dateFormatted } = formatDayDate(day.date);
          const isExpanded = expandedIndex === index;
          const assetIcon = getWeatherAssetIcon(day.iconCode);

          // Range bar position calculation
          const leftPercent = Math.max(0, Math.min(100, ((day.minTemp - overallMin) / overallRange) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((day.maxTemp - day.minTemp) / overallRange) * 100));

          return (
            <div
              key={`day-${day.date}-${index}`}
              className={`daily-row-item ${isExpanded ? 'expanded' : ''}`}
            >
              {/* Clickable Day Summary Row */}
              <div
                className="daily-row-summary"
                onClick={() => toggleExpand(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(index);
                  }
                }}
                aria-expanded={isExpanded}
              >
                {/* Day and date */}
                <div className="day-name-col">
                  <span className={`day-name ${index === 0 ? 'today' : ''}`}>{dayName}</span>
                  <span className="day-date">{dateFormatted}</span>
                </div>

                {/* Condition visual */}
                <div className="day-condition-col">
                  <img src={assetIcon} alt={day.condition} className="day-weather-icon" />
                  <span className="day-cond-text">{day.condition}</span>
                </div>

                {/* Rain chance */}
                <div className="day-rain-col">
                  {day.pop > 0 ? (
                    <span className="day-rain-tag">
                      <CloudRain size={12} /> {day.pop}%
                    </span>
                  ) : (
                    <span className="day-rain-dry">Dry</span>
                  )}
                </div>

                {/* Temperature Range Bar */}
                <div className="day-temp-bar-col">
                  <span className="temp-num min">{formatTemp(day.minTemp, unit)}°</span>
                  <div className="temp-range-track">
                    <div
                      className="temp-range-fill"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="temp-num max">{formatTemp(day.maxTemp, unit)}°</span>
                </div>

                {/* Expand chevron */}
                <div className="day-expand-col">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Smooth Expanded Detail View */}
              {isExpanded && (
                <div className="daily-expanded-panel">
                  <div className="expanded-grid">
                    <div className="expanded-item">
                      <Sunrise size={14} className="text-amber-400" />
                      <span className="exp-label">Sunrise:</span>
                      <span className="exp-val">{formatTimeStr(day.sunrise)}</span>
                    </div>

                    <div className="expanded-item">
                      <Sunset size={14} className="text-rose-400" />
                      <span className="exp-label">Sunset:</span>
                      <span className="exp-val">{formatTimeStr(day.sunset)}</span>
                    </div>

                    <div className="expanded-item">
                      <Wind size={14} className="text-sky-400" />
                      <span className="exp-label">Peak Wind:</span>
                      <span className="exp-val">
                        {formatWindSpeed(day.windMax, unit)} {formatWindUnit(unit)}
                      </span>
                    </div>

                    <div className="expanded-item">
                      <Sun size={14} className="text-amber-300" />
                      <span className="exp-label">Max UV Index:</span>
                      <span className="exp-val">{day.uvMax || 'Mod'}</span>
                    </div>

                    {day.rainSum > 0 && (
                      <div className="expanded-item">
                        <CloudRain size={14} className="text-sky-400" />
                        <span className="exp-label">Rain Volume:</span>
                        <span className="exp-val">{day.rainSum} mm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
