import React from 'react';
import { Wind, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getAqiCategory } from '../utils/formatters';

export default function AirQuality({ airQuality }) {
  if (!airQuality) return null;

  const usCat = getAqiCategory(airQuality.usAqi);
  const euCat = getAqiCategory(airQuality.europeanAqi);

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Wind size={18} className="text-emerald-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            Air Quality & Atmospheric Chemistry
          </h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${usCat.bg} ${usCat.color}`}
        >
          {usCat.label}
        </span>
      </div>

      {/* Main AQI Indexes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* US AQI */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>US AQI Standard</span>
            <span className="text-[10px] uppercase">EPA Scale</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">
              {airQuality.usAqi}
            </span>
            <span className={`text-xs font-mono font-bold ${usCat.color}`}>
              {usCat.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {airQuality.usAqi <= 50
              ? 'Air quality is satisfactory and poses little or no risk.'
              : airQuality.usAqi <= 100
              ? 'Air quality is acceptable; very sensitive individuals may experience minor symptoms.'
              : 'Sensitive groups should reduce prolonged outdoor exertion.'}
          </p>
        </div>

        {/* European AQI */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>European AQI Standard</span>
            <span className="text-[10px] uppercase">EEA Scale</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">
              {airQuality.europeanAqi}
            </span>
            <span className={`text-xs font-mono font-bold ${euCat.color}`}>
              {euCat.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Continuous real-time multi-pollutant index evaluating PM2.5, PM10, NO2, and Ozone concentrations.
          </p>
        </div>
      </div>

      {/* Specific Chemical Pollutants */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
          Pollutant Concentrations (μg/m³)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">PM2.5</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-1">
              {airQuality.pm25} <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">PM10</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-1">
              {airQuality.pm10} <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Ozone (O₃)</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-1">
              {airQuality.ozone} <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">NO₂</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-1">
              {airQuality.nitrogenDioxide} <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">SO₂</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-1">
              {airQuality.sulphurDioxide} <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 uppercase">CO</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-1">
              {airQuality.carbonMonoxide} <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
