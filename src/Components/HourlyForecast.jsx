import React, { useState } from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';
import { convertTemp, convertSpeed, formatHour } from '../utils/formatters';

export default function HourlyForecast({ hourly = [], unit = 'C' }) {
  const [selectedHour, setSelectedHour] = useState(null);

  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Clock size={18} className="text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            Hourly Forecast (24 Hours)
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Scroll horizontally for timeline →
        </span>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="flex items-center gap-3 min-w-max">
          {hourly.map((item, idx) => {
            const isNow = idx === 0;
            const hourInfo = getWeatherInfo(item.weatherCode, 1);
            const Icon = hourInfo.Icon;
            const isSelected = selectedHour?.time === item.time;

            return (
              <button
                key={item.time}
                onClick={() => setSelectedHour(isSelected ? null : item)}
                className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all text-center min-w-[84px] h-[178px] ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                    : isNow
                    ? 'bg-slate-950/80 border-cyan-500/30 text-white'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
                }`}
              >
                {/* Hour */}
                <span className="text-xs font-mono font-semibold">
                  {isNow ? (
                    <span className="text-cyan-400 font-bold">Now</span>
                  ) : (
                    formatHour(item.time)
                  )}
                </span>

                {/* Weather Icon */}
                <div className="my-1.5 p-2 rounded-xl bg-slate-900/70 border border-white/5">
                  <Icon size={20} className={hourInfo.accent} />
                </div>

                {/* Temperature */}
                <span className="text-base font-extrabold text-white font-mono">
                  {convertTemp(item.temperature, unit)}°
                </span>

                {/* Rain Probability */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-blue-400 mt-1">
                  <Droplets size={11} />
                  <span>{item.precipitationProbability}%</span>
                </div>

                {/* Wind */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 mt-1">
                  <Wind size={10} />
                  <span>{convertSpeed(item.windSpeed, unit === 'C' ? 'metric' : 'imperial')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Detail Tray */}
      {selectedHour && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 text-xs font-mono animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">
              {formatHour(selectedHour.time)} Details:
            </span>
            <span className="text-slate-300">
              Condition: {getWeatherInfo(selectedHour.weatherCode).label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Feels like: {convertTemp(selectedHour.apparentTemperature, unit)}°</span>
            <span>Humidity: {selectedHour.relativeHumidity}%</span>
            <span>Cloud Cover: {selectedHour.cloudCover}%</span>
            <span>UV: {selectedHour.uvIndex}</span>
          </div>
        </div>
      )}
    </div>
  );
}
