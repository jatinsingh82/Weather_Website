import React from 'react';
import './WeatherBackground.css';

export default function WeatherBackground({ condition = 'Clear', isDay = true }) {
  const cond = condition.toLowerCase();

  let weatherClass = 'weather-bg-clear-day';
  if (!isDay) {
    weatherClass = 'weather-bg-night';
  } else if (cond.includes('thunder') || cond.includes('storm')) {
    weatherClass = 'weather-bg-thunder';
  } else if (cond.includes('rain') || cond.includes('drizzle')) {
    weatherClass = 'weather-bg-rain';
  } else if (cond.includes('snow')) {
    weatherClass = 'weather-bg-snow';
  } else if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog')) {
    weatherClass = 'weather-bg-cloudy';
  } else {
    weatherClass = 'weather-bg-clear-day';
  }

  return (
    <div className={`weather-background-canvas ${weatherClass}`} aria-hidden="true">
      <div className="weather-bg-overlay" />
      
      {/* Subtle atmospheric elements depending on condition */}
      {isDay && weatherClass === 'weather-bg-clear-day' && (
        <div className="sun-glow-orb" />
      )}

      {!isDay && (
        <div className="stars-cluster">
          <span className="star star-1" />
          <span className="star star-2" />
          <span className="star star-3" />
          <span className="star star-4" />
          <span className="star star-5" />
          <span className="star star-6" />
        </div>
      )}

      {weatherClass === 'weather-bg-cloudy' && (
        <div className="cloud-drifts">
          <div className="cloud-drift drift-1" />
          <div className="cloud-drift drift-2" />
        </div>
      )}

      {weatherClass === 'weather-bg-rain' && (
        <div className="rain-layer">
          <div className="raindrop drop-1" />
          <div className="raindrop drop-2" />
          <div className="raindrop drop-3" />
          <div className="raindrop drop-4" />
          <div className="raindrop drop-5" />
          <div className="raindrop drop-6" />
        </div>
      )}

      {weatherClass === 'weather-bg-snow' && (
        <div className="snow-layer">
          <div className="snowflake flake-1">❄</div>
          <div className="snowflake flake-2">❅</div>
          <div className="snowflake flake-3">❄</div>
          <div className="snowflake flake-4">❅</div>
        </div>
      )}

      {weatherClass === 'weather-bg-thunder' && (
        <div className="lightning-flash" />
      )}
    </div>
  );
}
