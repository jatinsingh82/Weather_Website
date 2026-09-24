import React, { useState, useEffect } from 'react';
import { Radar, Play, Pause, RefreshCw, Layers, ExternalLink } from 'lucide-react';
import './RainRadar.css';

export default function RainRadar({ lat, lon, city }) {
  const [radarFrames, setRadarFrames] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch RainViewer free API frames (requires NO keys, 100% free & global)
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

  // Radar playback loop
  useEffect(() => {
    let interval = null;
    if (isPlaying && radarFrames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % radarFrames.length);
      }, 750);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, radarFrames]);

  const activeFrame = radarFrames[currentFrameIdx];
  const frameTime = activeFrame?.time
    ? new Date(activeFrame.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : 'Live';

  // Calculate Slippy Map tile X, Y for lat/lon at zoom level 6
  const zoom = 6;
  const latRad = ((lat || 51.5) * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const tileX = Math.floor((((lon || 0) + 180) / 360) * n);
  const tileY = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);

  const baseMapUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
  const radarTileUrl = activeFrame?.path
    ? `https://tilecache.rainviewer.com${activeFrame.path}/256/${zoom}/${tileX}/${tileY}/2/1_1.png`
    : null;

  return (
    <section className="rain-radar-card" aria-label="Precipitation Radar">
      <div className="radar-header" onClick={() => setIsExpanded(!isExpanded)} role="button" tabIndex={0}>
        <div className="radar-title-group">
          <div className="radar-icon-wrap">
            <Radar size={18} className="radar-spin-icon" />
          </div>
          <div>
            <h2 className="radar-heading">Precipitation Radar</h2>
            <p className="radar-subtitle">Live Doppler reflectance overlay for {city}</p>
          </div>
        </div>

        <button
          type="button"
          className="radar-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Hide Radar View' : 'Open Live Radar'}
        </button>
      </div>

      {isExpanded && (
        <div className="radar-body-expanded">
          {isLoading ? (
            <div className="radar-loading">
              <RefreshCw size={20} className="spinning" />
              <span>Calibrating Doppler Radar Grid...</span>
            </div>
          ) : (
            <div className="radar-viewer-wrapper">
              <div className="radar-map-display">
                {/* Base map */}
                <img src={baseMapUrl} alt="Basemap" className="basemap-layer" crossOrigin="anonymous" />
                
                {/* Precipitation radar layer */}
                {radarTileUrl && (
                  <img
                    src={radarTileUrl}
                    alt="Radar precipitation overlay"
                    className="radar-overlay-layer"
                    crossOrigin="anonymous"
                  />
                )}

                {/* Target pin in center */}
                <div className="radar-target-marker" title={city}>
                  <div className="target-pulse" />
                  <div className="target-dot" />
                  <span className="target-label">{city}</span>
                </div>

                {/* Status HUD overlay */}
                <div className="radar-hud">
                  <span className="hud-badge">Doppler Stream</span>
                  <span className="hud-timestamp">{frameTime}</span>
                </div>

                {/* Radar color legend */}
                <div className="radar-legend">
                  <span className="legend-label">Precipitation:</span>
                  <div className="legend-bar" />
                  <div className="legend-scale">
                    <span>Light</span>
                    <span>Mod</span>
                    <span>Heavy</span>
                  </div>
                </div>
              </div>

              {/* Playback bar */}
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
                  />
                </div>

                <a
                  href={`https://www.rainviewer.com/map.html?loc=${lat},${lon},8`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="radar-external-link"
                  title="Open full interactive radar map in new tab"
                >
                  <span>Full Screen</span>
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
