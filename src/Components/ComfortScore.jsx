import React from 'react';
import { HeartPulse, CheckCircle2, Info } from 'lucide-react';
import { calculateComfortScore } from '../utils/comfortScore';

export default function ComfortScore({ current }) {
  if (!current) return null;

  const comfort = calculateComfortScore({
    temperature: current.temperature,
    humidity: current.relativeHumidity,
    windSpeed: current.windSpeed,
    dewPoint: current.dewPoint,
    uvIndex: current.uvIndex
  });

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <HeartPulse size={18} className="text-rose-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            Human Comfort Index
          </h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${comfort.badgeColor}`}
        >
          {comfort.rating}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Score Dial / Big Number */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="relative flex items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
              {comfort.score}
            </span>
            <span className="text-sm font-bold text-slate-500 font-mono ml-1">/100</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold mt-1">
            Calculated Biometeorology
          </span>
        </div>

        {/* Narrative & Advice */}
        <div className="sm:col-span-7 space-y-3">
          <p className="text-sm text-slate-200 font-sans leading-relaxed">
            {comfort.summary}
          </p>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 font-sans">
            <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>{comfort.advisory}</span>
          </div>
        </div>
      </div>

      {/* 4 Factor Bars */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Atmospheric Comfort Factors
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Thermal */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Thermal Balance</span>
              <span className="text-slate-200 font-bold">{comfort.breakdown.thermal}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${comfort.breakdown.thermal}%` }}
              />
            </div>
          </div>

          {/* Moisture */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Moisture & Dew Point</span>
              <span className="text-slate-200 font-bold">{comfort.breakdown.moisture}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${comfort.breakdown.moisture}%` }}
              />
            </div>
          </div>

          {/* Wind Dynamics */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Wind Velocity Impact</span>
              <span className="text-slate-200 font-bold">{comfort.breakdown.wind}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full"
                style={{ width: `${comfort.breakdown.wind}%` }}
              />
            </div>
          </div>

          {/* Solar Radiation */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Solar & UV Strain</span>
              <span className="text-slate-200 font-bold">{comfort.breakdown.solar}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${comfort.breakdown.solar}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
