import React, { useState, useEffect, useRef } from 'react';
import {
  CloudRain,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  Layers,
  Info
} from 'lucide-react';

export default function RainRadar({ location, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [frames, setFrames] = useState([]);
  const [colorScheme, setColorScheme] = useState(2); // Universal Blue
  const [opacity, setOpacity] = useState(0.8);
  const [zoom, setZoom] = useState(6);
  const timerRef = useRef(null);

  const lat = location?.latitude || 40.71;
  const lon = location?.longitude || -74.0;

  // Fetch real RainViewer radar timestamps
  useEffect(() => {
    let isMounted = true;
    async function fetchRadarFrames() {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (res.ok) {
          const data = await res.json();
          const pastFrames = (data.radar && data.radar.past) || [];
          const nowcastFrames = (data.radar && data.radar.nowcast) || [];
          const combined = [...pastFrames, ...nowcastFrames];
          if (isMounted && combined.length > 0) {
            setFrames(combined);
            setFrameIndex(Math.max(0, pastFrames.length - 1)); // start at latest observation
          }
        }
      } catch (e) {
        // Fallback frames if network is offline
        if (isMounted) {
          const fallback = [
            { time: Date.now() / 1000 - 1800, path: '/sample/1' },
            { time: Date.now() / 1000 - 1200, path: '/sample/2' },
            { time: Date.now() / 1000 - 600, path: '/sample/3' },
            { time: Date.now() / 1000, path: '/sample/4' }
          ];
          setFrames(fallback);
        }
      }
    }

    fetchRadarFrames();
    return () => {
      isMounted = false;
    };
  }, []);

  // Frame animation loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    timerRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 750);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, frames.length]);

  const currentFrame = frames[frameIndex];
  const formattedTime = currentFrame?.time
    ? new Date(currentFrame.time * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '--:--';

  // Tile coordinates calculation for static preview
  const n = Math.pow(2, zoom);
  const xTile = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const yTile = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );

  const baseMapTileUrl = `https://tile.openstreetmap.org/${zoom}/${xTile}/${yTile}.png`;
  const radarTileUrl =
    currentFrame?.path &&
    `https://tilecache.rainviewer.com${currentFrame.path}/256/${zoom}/${xTile}/${yTile}/${colorScheme}/1_1.png`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CloudRain size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Precipitation Doppler Radar
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Centered on {location?.name || 'Current Location'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Radar Map Canvas Container */}
        <div className="relative flex-1 min-h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center select-none">
          {/* Base Map Tile Grid */}
          <div className="absolute inset-0 flex items-center justify-center opacity-70">
            <img
              src={baseMapTileUrl}
              alt="Base Map"
              className="w-full h-full object-cover filter contrast-125 brightness-90 invert hue-rotate-180"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Radar Overlay Layer */}
          {radarTileUrl && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
              style={{ opacity }}
            >
              <img
                src={radarTileUrl}
                alt="RainViewer Doppler Layer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Atmospheric Crosshair / Pin Indicator */}
          <div className="absolute flex flex-col items-center pointer-events-none z-10">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-500/40 animate-ping" />
            <span className="px-2 py-0.5 mt-1 rounded bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-cyan-300 shadow">
              {location?.name || 'Target'}
            </span>
          </div>

          {/* Timestamp Indicator */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white">
              {formattedTime}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {frameIndex < frames.length / 2 ? 'Observed' : 'Nowcast'}
            </span>
          </div>

          {/* Intensity Legend */}
          <div className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md flex items-center gap-2 text-[10px] font-mono text-slate-300">
            <span>Light</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-yellow-400 to-rose-500" />
            <span>Heavy</span>
          </div>
        </div>

        {/* Radar Controls Toolbar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
              title={isPlaying ? 'Pause' : 'Play animation'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => setFrameIndex(0)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset to beginning"
            >
              <RotateCcw size={16} />
            </button>

            {/* Frame Slider */}
            <div className="flex items-center gap-2 ml-2">
              <input
                type="range"
                min="0"
                max={Math.max(0, frames.length - 1)}
                value={frameIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setFrameIndex(Number(e.target.value));
                }}
                className="w-32 sm:w-48 accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400">
                {frameIndex + 1}/{frames.length || 1}
              </span>
            </div>
          </div>

          {/* Options: Zoom & Palette */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <button
                onClick={() => setZoom((z) => Math.max(4, z - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="w-12 text-center">Zoom {zoom}</span>
              <button
                onClick={() => setZoom((z) => Math.min(10, z + 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span>Palette:</span>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(Number(e.target.value))}
                className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
              >
                <option value={2}>Universal Blue</option>
                <option value={1}>Original</option>
                <option value={3}>TITAN</option>
                <option value={4}>The Weather Channel</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
