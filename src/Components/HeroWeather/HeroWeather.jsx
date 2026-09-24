import React from 'react';
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  ArrowUpRight,
  SunMedium
} from 'lucide-react';
import {
  formatTemp,
  formatTempUnit,
  formatWindSpeed,
  formatWindUnit,
  formatPressure,
  formatVisibility,
  formatCityLocalTime,
  getWeatherAssetIcon
} from '../../utils/weatherUtils';
import humidityOriginalIcon from '../Assets/humidity.png';
import windOriginalIcon from '../Assets/wind.png';
import './HeroWeather.css';

export default function HeroWeather({
  weather,
  unit,
  onRefresh,
  isRefreshing,
  isSaved,
  onToggleSave,
}) {
  if (!weather || !weather.current) return null;

  const {
    city,
    country,
    displayName,
    timezoneOffsetSeconds,
    lastUpdated,
    current,
    daily
  } = weather;

  const {
    temp,
    feelsLike,
    high,
    low,
    condition,
    description,
    iconCode,
    humidity,
    windSpeed,
    windDirectionCompass,
    pressure,
    visibility,
    uvIndex,
    sunrise,
    sunset,
    isDay
  } = current;

  // Local city time
  const localTime = formatCityLocalTime(timezoneOffsetSeconds || 0);

  // Asset image from the project's original assets
  const assetImage = getWeatherAssetIcon(iconCode);

  // Format sunrise / sunset
  const formatTimeStr = (isoStr) => {
    if (!isoStr) return '--:--';
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const minutesAgo = Math.max(0, Math.floor((Date.now() - (lastUpdated || Date.now())) / 60000));
  const updateLabel = minutesAgo === 0 ? 'Just now' : `${minutesAgo}m ago`;

  return (
    <section className="hero-weather-card" aria-label="Current Weather">
      {/* Header: Location & Status Actions */}
      <div className="hero-top-row">
        <div className="hero-location-block">
          <div className="location-name-row">
            <h1 className="location-city-title weather-location">{displayName || city}</h1>
            <button
              type="button"
              className={`save-location-btn ${isSaved ? 'saved' : ''}`}
              onClick={onToggleSave}
              title={isSaved ? 'Remove from saved places' : 'Save location to favorites'}
              aria-label="Save location"
            >
              {isSaved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
            </button>
          </div>

          <div className="location-meta-row">
            <span className="meta-item">
              <Calendar size={13} />
              {localTime.dateString}
            </span>
            <span className="meta-dot">·</span>
            <span className="meta-item">
              <Clock size={13} />
              Local: {localTime.timeString}
            </span>
            <span className="meta-dot">·</span>
            <span className="meta-day-night">
              {isDay ? '☀️ Daytime' : '🌙 Night'}
            </span>
          </div>
        </div>

        <div className="hero-top-controls">
          <div className="update-badge" title="Data freshness">
            <span className="live-pulse-dot" />
            <span>Updated {updateLabel}</span>
          </div>
          <button
            type="button"
            className={`refresh-action-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={onRefresh}
            title="Refresh current weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Main Temp & Visual Section */}
      <div className="hero-main-content">
        <div className="temp-visual-group">
          <div className="weather-image-wrapper weather-image">
            <img
              src={assetImage}
              alt={condition || 'Weather condition'}
              className="hero-weather-icon-img"
            />
          </div>

          <div className="temp-text-block">
            <div className="temperature-value weather-temp">
              {formatTemp(temp, unit)}
              <span className="temp-symbol">{formatTempUnit(unit)}</span>
            </div>

            <div className="condition-label-row">
              <span className="condition-primary">{condition}</span>
              <span className="condition-desc">{description}</span>
            </div>

            <div className="temp-range-row">
              <span className="temp-pill">
                Feels like <strong>{formatTemp(feelsLike, unit)}{formatTempUnit(unit)}</strong>
              </span>
              <span className="temp-pill high-low">
                <span>H: {formatTemp(high, unit)}°</span>
                <span>L: {formatTemp(low, unit)}°</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Meteorological Metrics */}
      <div className="hero-metrics-grid data-container">
        {/* Humidity with original humidity icon preserved */}
        <div className="metric-box element">
          <div className="metric-header">
            <img src={humidityOriginalIcon} alt="" className="metric-orig-icon icon" />
            <span className="metric-label text">Humidity</span>
          </div>
          <div className="metric-value-block data">
            <span className="metric-val-large humidity-percent">{humidity}%</span>
            <span className="metric-sub">
              {humidity > 70 ? 'High moisture' : humidity < 35 ? 'Dry air' : 'Comfortable'}
            </span>
          </div>
        </div>

        {/* Wind with original wind icon preserved */}
        <div className="metric-box element">
          <div className="metric-header">
            <img src={windOriginalIcon} alt="" className="metric-orig-icon icon" />
            <span className="metric-label text">Wind Speed</span>
          </div>
          <div className="metric-value-block data">
            <span className="metric-val-large">
              {formatWindSpeed(windSpeed, unit)} <small>{formatWindUnit(unit)}</small>
            </span>
            <span className="metric-sub">
              Direction: {windDirectionCompass || 'N/A'}
            </span>
          </div>
        </div>

        {/* Visibility */}
        <div className="metric-box">
          <div className="metric-header">
            <Eye size={19} className="metric-svg-icon" />
            <span className="metric-label">Visibility</span>
          </div>
          <div className="metric-value-block">
            <span className="metric-val-large">{formatVisibility(visibility, unit)}</span>
            <span className="metric-sub">
              {visibility >= 10 ? 'Clear view' : visibility <= 4 ? 'Reduced' : 'Moderate'}
            </span>
          </div>
        </div>

        {/* Pressure */}
        <div className="metric-box">
          <div className="metric-header">
            <Gauge size={19} className="metric-svg-icon" />
            <span className="metric-label">Pressure</span>
          </div>
          <div className="metric-value-block">
            <span className="metric-val-large">{formatPressure(pressure, unit)}</span>
            <span className="metric-sub">
              {pressure > 1018 ? 'High (Stable)' : pressure < 1008 ? 'Low (Unsettled)' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Sunrise */}
        <div className="metric-box">
          <div className="metric-header">
            <Sunrise size={19} className="metric-svg-icon text-amber" />
            <span className="metric-label">Sunrise</span>
          </div>
          <div className="metric-value-block">
            <span className="metric-val-large">{formatTimeStr(sunrise)}</span>
            <span className="metric-sub">Dawn twilight</span>
          </div>
        </div>

        {/* Sunset */}
        <div className="metric-box">
          <div className="metric-header">
            <Sunset size={19} className="metric-svg-icon text-rose" />
            <span className="metric-label">Sunset</span>
          </div>
          <div className="metric-value-block">
            <span className="metric-val-large">{formatTimeStr(sunset)}</span>
            <span className="metric-sub">Dusk twilight</span>
          </div>
        </div>
      </div>
    </section>
  );
}
