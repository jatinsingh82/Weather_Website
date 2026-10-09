import React from 'react';
import { Dna, Sun, Droplets, Wind, Gauge } from 'lucide-react';
import { calculateWeatherDna } from '../utils/weatherDna';

const DIM_ICONS = {
  Sun,
  Droplets,
  Wind,
  Gauge
};

export default function WeatherDNA({ current }) {
  if (!current) return null;

  const dna = calculateWeatherDna({
    temperature: current.temperature,
    humidity: current.relativeHumidity,
    pressure: current.pressure,
    windSpeed: current.windSpeed,
    cloudCover: current.cloudCover,
    uvIndex: current.uvIndex
  });

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Dna size={18} className="text-purple-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            Weather DNA & Atmospheric Archetype
          </h2>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          Air Mass Profile
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-white font-sans">
            {dna.archetype}
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gradient-to-r ${dna.color} text-white shadow-sm`}
          >
            {dna.badge}
          </span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {dna.description}
        </p>
      </div>

      {/* 4 Dimension metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dna.dimensions.map((dim) => {
          const Icon = DIM_ICONS[dim.icon] || Sun;
          return (
            <div
              key={dim.name}
              className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono">{dim.name}</span>
                <Icon size={14} className="text-cyan-400" />
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono">
                {dim.value}%
              </div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
                  style={{ width: `${dim.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
