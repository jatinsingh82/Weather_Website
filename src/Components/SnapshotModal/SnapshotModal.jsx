import React, { useRef, useState } from 'react';
import { X, Camera, Copy, Check, Download, Share2 } from 'lucide-react';
import { formatTemp, formatTempUnit, getWeatherAssetIcon } from '../../utils/weatherUtils';
import './SnapshotModal.css';

export default function SnapshotModal({ isOpen, onClose, weather, unit }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen || !weather || !weather.current) return null;

  const { city, country, displayName, current } = weather;
  const assetIcon = getWeatherAssetIcon(current.iconCode);
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleCopyText = () => {
    const text = `🌤️ Weather in ${displayName || city}: ${formatTemp(current.temp, unit)}${formatTempUnit(unit)}, ${current.condition}. High: ${formatTemp(current.high, unit)}°, Low: ${formatTemp(current.low, unit)}°. Humidity: ${current.humidity}%, Wind: ${current.windSpeed} km/h. via WeatherNow Pro.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSnapshot = () => {
    // Generate an HTML5 Canvas rendering of the card for direct PNG export
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 360);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 600, 360, 24);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brand logo
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('WeatherNow PRO', 40, 48);

    // City & Country
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(displayName || city, 40, 95);

    // Date
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(dateStr, 40, 125);

    // Temp
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(`${formatTemp(current.temp, unit)}${formatTempUnit(unit)}`, 40, 220);

    // Condition
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(current.condition, 40, 260);

    // Stats bar
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(
      `High: ${formatTemp(current.high, unit)}°   Low: ${formatTemp(current.low, unit)}°   Humidity: ${current.humidity}%   Wind: ${current.windSpeed} km/h`,
      40,
      310
    );

    // Draw asset image onto canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = assetIcon;
    img.onload = () => {
      ctx.drawImage(img, 410, 80, 140, 140);
      const link = document.createElement('a');
      link.download = `weather-${city.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    // If image fails or finishes fast, trigger anyway
    setTimeout(() => {
      if (!linkTriggered) {
        const link = document.createElement('a');
        link.download = `weather-${city.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }, 400);
    let linkTriggered = false;
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="snapshot-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Camera size={20} className="modal-icon text-sky-400" />
            <h2 className="modal-title">Weather Snapshot</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="snapshot-body">
          {/* Visual card to snapshot */}
          <div className="snapshot-card-preview" ref={cardRef}>
            <div className="card-brand-tag">WeatherNow PRO</div>
            <div className="card-top-info">
              <h3 className="card-city-name">{displayName || city}</h3>
              <span className="card-date-label">{dateStr}</span>
            </div>

            <div className="card-main-temp">
              <span className="card-temp-digits">
                {formatTemp(current.temp, unit)}
                <small>{formatTempUnit(unit)}</small>
              </span>
              <img src={assetIcon} alt={current.condition} className="card-weather-icon-img" />
            </div>

            <div className="card-condition-line">
              <span className="card-condition-name">{current.condition}</span>
              <span className="card-feels">
                Feels like {formatTemp(current.feelsLike, unit)}{formatTempUnit(unit)}
              </span>
            </div>

            <div className="card-stats-strip">
              <span>H: {formatTemp(current.high, unit)}°</span>
              <span>·</span>
              <span>L: {formatTemp(current.low, unit)}°</span>
              <span>·</span>
              <span>💧 {current.humidity}%</span>
              <span>·</span>
              <span>💨 {current.windSpeed} km/h</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="snapshot-actions-row">
            <button
              type="button"
              className="snapshot-btn primary"
              onClick={handleDownloadSnapshot}
            >
              <Download size={16} />
              <span>Download PNG Image</span>
            </button>

            <button
              type="button"
              className="snapshot-btn secondary"
              onClick={handleCopyText}
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'Copied Weather Summary!' : 'Copy Weather Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
