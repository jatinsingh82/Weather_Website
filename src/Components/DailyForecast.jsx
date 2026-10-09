import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  Wind,
  Sun,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';
import {
  convertTemp,
  convertSpeed,
  convertPrecip,
  formatDayName,
  formatFullDate,
  formatTime
} from '../utils/formatters';

export default function DailyForecast({ daily = [], unit = 'C' }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!daily || daily.length === 0) return null;

  // Find absolute min and max temp across the whole week for scale rendering
  const allMins = daily.map((d) => d.tempMin).filter((n) => n != null);
  const allMaxs = daily.map((d) => d.tempMax).filter((n) => n != null);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <CalendarDays size={18} className="text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            7-Day Extended Outlook
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Global atmospheric forecast
        </span>
      </div>

      <div className="space-y-2.5">
        {daily.map((day, idx) => {
          const info = getWeatherInfo(day.weatherCode, 1);
          const Icon = info.Icon;
          const isExpanded = expandedIndex === idx;

          // Calculate visual temp bar width percentages
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((globalMax - day.tempMax) / tempRange) * 100)
          );

          return (
            <div
              key={day.date}
              className="rounded-2xl bg-slate-950/40 border border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-900/50 transition-colors"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <div className="text-sm font-bold text-white font-mono">
                    {formatDayName(day.date, idx)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">
                    {formatFullDate(day.date)}
                  </div>
                </div>

                {/* Condition Icon & Label */}
                <div className="flex items-center gap-2.5 w-32 sm:w-40 shrink-0">
                  <Icon size={20} className={info.accent} />
                  <span className="text-xs font-medium text-slate-300 font-sans truncate">
                    {info.label}
                  </span>
                </div>

                {/* Precipitation */}
                <div className="hidden sm:flex items-center gap-1.5 w-20 shrink-0 text-xs font-mono text-blue-400">
                  {day.precipitationProbabilityMax > 0 ? (
                    <>
                      <Droplets size={13} />
                      <span>{day.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-slate-600">0%</span>
                  )}
                </div>

                {/* Temperature Range Bar */}
                <div className="flex-1 flex items-center gap-3 max-w-xs">
                  <span className="text-xs font-bold text-slate-400 font-mono w-8 text-right">
                    {convertTemp(day.tempMin, unit)}°
                  </span>

                  {/* Gradient scale */}
                  <div className="flex-1 h-2 rounded-full bg-slate-800 relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        right: `${rightPercent}%`
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-white font-mono w-8">
                    {convertTemp(day.tempMax, unit)}°
                  </span>
                </div>

                {/* Toggle chevron */}
                <div className="text-slate-500 shrink-0">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Expanded Accordion Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-slate-900/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px] uppercase">Rain Sum</div>
                    <div className="text-slate-200 font-bold mt-0.5">
                      {convertPrecip(day.precipitationSum, unit === 'C' ? 'metric' : 'imperial')}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px] uppercase">Max Wind</div>
                    <div className="text-slate-200 font-bold mt-0.5 flex items-center gap-1">
                      <Wind size={12} className="text-cyan-400" />
                      <span>{convertSpeed(day.windSpeedMax, unit === 'C' ? 'metric' : 'imperial')}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px] uppercase">Peak UV</div>
                    <div className="text-amber-300 font-bold mt-0.5 flex items-center gap-1">
                      <Sun size={12} />
                      <span>{day.uvIndexMax}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px] uppercase">Sun Window</div>
                    <div className="text-slate-300 text-[11px] mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Sunrise size={11} className="text-amber-400" />
                        {formatTime(day.sunrise)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Sunset size={11} className="text-indigo-400" />
                        {formatTime(day.sunset)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
