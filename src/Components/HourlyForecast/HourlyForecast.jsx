import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, CloudRain, Wind } from 'lucide-react';
import {
  formatTemp,
  formatTempUnit,
  formatWindSpeed,
  formatWindUnit,
  formatHourTime,
  getWeatherAssetIcon
} from '../../utils/weatherUtils';
import './HourlyForecast.css';

export default function HourlyForecast({ hourly, unit, timezoneOffsetSeconds }) {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="hourly-forecast-card" aria-label="Hourly Forecast">
      <div className="hourly-header">
        <div className="hourly-title-row">
          <div className="hourly-icon-wrap">
            <Clock size={18} className="hourly-clock-icon" />
          </div>
          <div>
            <h2 className="hourly-heading">Hourly Forecast</h2>
            <p className="hourly-subtitle">Next 24-hour meteorological projection</p>
          </div>
        </div>

        {/* Scroll controls */}
        <div className="hourly-scroll-btns">
          <button
            type="button"
            className="scroll-arrow-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="scroll-arrow-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="hourly-scroll-track" ref={scrollRef}>
        {hourly.map((hour, index) => {
          const isFirst = index === 0;
          const timeLabel = isFirst ? 'Now' : formatHourTime(hour.time, timezoneOffsetSeconds);
          const assetIcon = getWeatherAssetIcon(hour.iconCode);

          return (
            <div
              key={`hour-${hour.time}-${index}`}
              className={`hour-card ${isFirst ? 'current-hour' : ''}`}
            >
              <span className="hour-time-label">{timeLabel}</span>

              <div className="hour-icon-box">
                <img
                  src={assetIcon}
                  alt={hour.condition}
                  className="hour-weather-icon"
                />
              </div>

              <div className="hour-temp-value">
                {formatTemp(hour.temp, unit)}{formatTempUnit(unit)}
              </div>

              {/* Rain Probability */}
              <div className="hour-rain-pill" title="Precipitation chance">
                <CloudRain size={12} className={hour.pop > 30 ? 'text-rain-high' : 'text-rain-muted'} />
                <span className={hour.pop > 30 ? 'rain-high' : ''}>{hour.pop}%</span>
              </div>

              {/* Wind metric */}
              <div className="hour-wind-pill" title="Wind speed">
                <Wind size={11} />
                <span>{formatWindSpeed(hour.windSpeed, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
