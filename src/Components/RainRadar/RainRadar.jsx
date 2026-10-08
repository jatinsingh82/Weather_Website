import React, { useState, useEffect } from 'react';
import {
  Radar,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Cloud,
  Thermometer,
  Wind
} from 'lucide-react';
import './RainRadar.css';

export default function RainRadar({ lat, lon, city, weather }) {
  const [radarFrames, setRadarFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar' | 'clouds' | 'temp' | 'wind'
  const [zoom, setZoom] = useState(6);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch RainViewer free API frames (no key required, 100% free & global)
  useEffect(() => {
    let isMounted = true;
    async function fetchRadarFrames() {
      setIsLoading(true);
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (res.ok && isMounted) {
          const data = await res.json();
          const pastFrames = data.radar?.past || [];
          const nowcastFrames = data.radar?.nowcast || [];
          const all = [...pastFrames, ...nowcastFrames];
          if (all.length > 0) {
            setRadarFrames(all);
            setCurrentFrameIdx(pastFrames.length > 0 ? pastFrames.length - 1 : 0);
          }
        }
      } catch (err) {
        console.warn('Could not fetch radar frames:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (isExpanded) {
      fetchRadarFrames();
    }

    return () => {
      isMounted = false;
    };
  }, [isExpanded]);

  // Radar animation loop
  useEffect(() => {
    let interval = null;
    if (isPlaying && radarFrames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % radarFrames.length);
      }, 700);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, radarFrames]);

  const activeFrame = radarFrames[currentFrameIdx];
  const frameTime = activeFrame?.time
    ? new Date(activeFrame.time * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    : 'Live';

  // Calculate Slippy Map tile X, Y for lat/lon at current zoom level
  const latRad = ((lat || 51.5) * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const tileX = Math.floor((((lon || 0) + 180) / 360) * n);
  const tileY = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);

  const baseMapUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;

  // Color scheme 2 = Universal Blue, 4 = The Weather Channel, 6 = NEXRAD Level III
  const radarTileUrl = activeFrame?.path
    ? `https://tilecache.rainviewer.com${activeFrame.path}/256/${zoom}/${tileX}/${tileY}/2/1_1.png`
    : null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.min(8, z + 1));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((z) => Math.max(4, z - 1));
  };

  return (
    <section className={`rain-radar-card ${isFullscreen ? 'radar-fullscreen' : ''}`} aria-label="Interactive Weather Map">
      <div className="radar-header" onClick={() => !isFullscreen && setIsExpanded(!isExpanded)} role="button" tabIndex={0}>
        <div className="radar-title-group">
          <div className="radar-icon-wrap">
            <Radar size={18} className="radar-spin-icon" />
          </div>
          <div>
            <h2 className="radar-heading">Advanced Atmospheric Map & Radar</h2>
            <p className="radar-subtitle">Live multi-layer Doppler reflectance & weather grid for {city}</p>
          </div>
        </div>

        <div className="radar-header-actions" onClick={(e) => e.stopPropagation()}>
          {/* Layer switcher buttons */}
          <div className="layer-switcher-pills">
            <button
              type="button"
              className={`layer-btn ${activeLayer === 'radar' ? 'active' : ''}`}
              onClick={() => setActiveLayer('radar')}
              title="Precipitation Doppler Radar"
            >
              <Radar size={13} />
              <span>Radar</span>
            </button>
            <button
              type="button"
              className={`layer-btn ${activeLayer === 'clouds' ? 'active' : ''}`}
              onClick={() => setActiveLayer('clouds')}
              title="Cloud Cover & Moisture"
            >
              <Cloud size={13} />
              <span>Clouds</span>
            </button>
            <button
              type="button"
              className={`layer-btn ${activeLayer === 'temp' ? 'active' : ''}`}
              onClick={() => setActiveLayer('temp')}
              title="Surface Temperature Contour"
            >
              <Thermometer size={13} />
              <span>Temp</span>
            </button>
            <button
              type="button"
              className={`layer-btn ${activeLayer === 'wind' ? 'active' : ''}`}
              onClick={() => setActiveLayer('wind')}
              title="Wind Field Vectors"
            >
              <Wind size={13} />
              <span>Wind</span>
            </button>
          </div>

          <button
            type="button"
            className="radar-fs-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Map'}
            aria-label="Toggle fullscreen map"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="radar-body-expanded">
          {isLoading ? (
            <div className="radar-loading">
              <RefreshCw size={24} className="spinning text-sky-400" />
              <span>Synchronizing Doppler Radar Grid ({city})...</span>
            </div>
          ) : (
            <div className="radar-viewer-wrapper">
              <div className="radar-map-display">
                {/* Base map */}
                <img
                  src={baseMapUrl}
                  alt={`Basemap of ${city}`}
                  className="basemap-layer"
                  crossOrigin="anonymous"
                />

                {/* Layer 1: Radar precipitation overlay */}
                {activeLayer === 'radar' && radarTileUrl && (
                  <img
                    src={radarTileUrl}
                    alt="Radar precipitation overlay"
                    className="radar-overlay-layer"
                    crossOrigin="anonymous"
                  />
                )}

                {/* Layer 2: Cloud Cover synthetic atmosphere overlay */}
                {activeLayer === 'clouds' && (
                  <div className="layer-overlay-clouds" />
                )}

                {/* Layer 3: Temperature thermal heatmap overlay */}
                {activeLayer === 'temp' && (
                  <div className="layer-overlay-temp" />
                )}

                {/* Layer 4: Wind streamlines overlay */}
                {activeLayer === 'wind' && (
                  <div className="layer-overlay-wind" />
                )}

                {/* Target pin in center */}
                <div className="radar-target-marker" title={`${city} (${lat?.toFixed(2)}, ${lon?.toFixed(2)})`}>
                  <div className="target-pulse" />
                  <div className="target-dot" />
                  <div className="target-info-card">
                    <span className="target-name">{city}</span>
                    {weather?.current && (
                      <span className="target-temp">
                        {weather.current.temp}°C · {weather.current.condition}
                      </span>
                    )}
                  </div>
                </div>

                {/* Map Zoom Controls on overlay */}
                <div className="map-zoom-controls">
                  <button
                    type="button"
                    className="zoom-btn"
                    onClick={handleZoomIn}
                    disabled={zoom >= 8}
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <span className="zoom-level-text">Z{zoom}</span>
                  <button
                    type="button"
                    className="zoom-btn"
                    onClick={handleZoomOut}
                    disabled={zoom <= 4}
                    aria-label="Zoom out"
                    title="Zoom out"
                  >
                    <ZoomOut size={15} />
                  </button>
                </div>

                {/* Status HUD overlay */}
                <div className="radar-hud">
                  <span className="hud-badge">
                    {activeLayer === 'radar' ? 'Doppler Reflectance' : activeLayer.toUpperCase()}
                  </span>
                  <span className="hud-timestamp">{frameTime}</span>
                </div>

                {/* Dynamic layer legend */}
                <div className="radar-legend">
                  <div className="legend-label-row">
                    <Layers size={11} />
                    <span className="legend-label">
                      {activeLayer === 'radar' && 'Precipitation Intensity (dBZ):'}
                      {activeLayer === 'clouds' && 'Cloud Opacity (%):'}
                      {activeLayer === 'temp' && 'Surface Temperature (°C):'}
                      {activeLayer === 'wind' && 'Wind Speed (km/h):'}
                    </span>
                  </div>

                  <div className={`legend-bar legend-bar-${activeLayer}`} />

                  <div className="legend-scale">
                    {activeLayer === 'radar' && (
                      <>
                        <span>Light</span>
                        <span>Moderate</span>
                        <span>Severe Hail</span>
                      </>
                    )}
                    {activeLayer === 'clouds' && (
                      <>
                        <span>0% Clear</span>
                        <span>50% Broken</span>
                        <span>100% Overcast</span>
                      </>
                    )}
                    {activeLayer === 'temp' && (
                      <>
                        <span>-5°C</span>
                        <span>15°C</span>
                        <span>35°C+</span>
                      </>
                    )}
                    {activeLayer === 'wind' && (
                      <>
                        <span>Calm</span>
                        <span>25 km/h</span>
                        <span>50+ km/h</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Playback & Timeline Controls Bar */}
              <div className="radar-controls-bar">
                <button
                  type="button"
                  className="playback-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Pause' : 'Play Loop'}</span>
                </button>

                <div className="timeline-slider-box">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(0, radarFrames.length - 1)}
                    value={currentFrameIdx}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentFrameIdx(Number(e.target.value));
                    }}
                    className="radar-range-slider"
                    aria-label="Timeline scrubber"
                  />
                </div>

                <a
                  href={`https://www.rainviewer.com/map.html?loc=${lat || 51.5},${lon || 0},${zoom}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="radar-external-link"
                  title="Open full global GIS view"
                >
                  <span>GIS Viewer</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
