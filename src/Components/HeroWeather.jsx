import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Compass
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';
import {
  convertTemp,
  convertSpeed,
  convertPressure,
  formatTime,
  getUvCategory
} from '../utils/formatters';

export default function HeroWeather({
  weatherData,
  unit,
  isSaved,
  onToggleSave
}) {
  if (!weatherData) return null;

  const { current, daily, location } = weatherData;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
  const IconComponent = weatherInfo.Icon;

  const today = daily && daily.length > 0 ? daily[0] : null;
  const uvCategory = getUvCategory(current.uvIndex);

  // Weather Advisory Detection (e.g. gale winds, freezing, severe thunderstorm, heat)
  const alerts = [];
  if (current.weatherCode >= 95) {
    alerts.push({
      level: 'severe',
      title: 'Thunderstorm Warning',
      message: 'Active convective storm with lightning and heavy downdrafts. Seek indoor shelter.'
    });
  } else if (current.windSpeed >= 45 || current.windGusts >= 65) {
    alerts.push({
      level: 'warning',
      title: 'High Wind / Gale Advisory',
      message: `Sustained winds of ${convertSpeed(current.windSpeed, unit === 'C' ? 'metric' : 'imperial')} with dangerous gusts.`
    });
  } else if (current.temperature >= 35) {
    alerts.push({
      level: 'warning',
      title: 'Excessive Heat Advisory',
      message: 'Elevated ambient heat index. Limit strenuous outdoor exertion and stay hydrated.'
    });
  } else if (current.temperature <= 0) {
    alerts.push({
      level: 'advisory',
      title: 'Freezing Frost Advisory',
      message: 'Sub-zero temperatures detected. Watch for icy surfaces and freezing conditions.'
    });
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/70 backdrop-blur-xl">
      {/* Dynamic Condition Gradient Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${weatherInfo.gradient} opacity-40 pointer-events-none transition-all duration-700`}
      />

      <div className="relative p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Top Header: Location, Coordinates & Save Bookmark */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                {location.name}
              </h1>
              <button
                onClick={onToggleSave}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isSaved ? 'Remove from saved locations' : 'Save this location'}
              >
                {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
              <span>{location.timezone || 'Local Time'}</span>
              <span>•</span>
              <span>Lat: {location.latitude.toFixed(2)}°</span>
              <span>Lon: {location.longitude.toFixed(2)}°</span>
              {location.elevation != null && (
                <>
                  <span>•</span>
                  <span>Elev: {Math.round(location.elevation)}m</span>
                </>
              )}
            </p>
          </div>

          {/* Condition Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/70 border border-white/10 shadow-inner">
            <IconComponent size={22} className={weatherInfo.accent} />
            <span className="text-sm font-bold text-slate-100 font-sans">
              {weatherInfo.label}
            </span>
          </div>
        </div>

        {/* Alerts Banner (if present) */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200"
              >
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold font-mono uppercase tracking-wider block text-amber-300">
                    {alert.title}
                  </span>
                  <span className="font-sans opacity-90">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Temperature & Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Temperature Hero (Left) */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-baseline sm:items-center gap-6 sm:gap-8">
            <div className="flex items-start">
              <span className="text-7xl sm:text-9xl font-black text-white tracking-tighter font-sans leading-none">
                {convertTemp(current.temperature, unit)}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono ml-1 mt-2">
                °{unit}
              </span>
            </div>

            <div className="space-y-2 border-l border-white/10 pl-6">
              <div className="text-sm font-medium text-slate-300">
                Feels like{' '}
                <span className="font-bold text-white font-mono">
                  {convertTemp(current.apparentTemperature, unit)}°{unit}
                </span>
              </div>

              {today && (
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-rose-300">
                    <ArrowUp size={13} />
                    <span>{convertTemp(today.tempMax, unit)}°</span>
                  </span>
                  <span className="flex items-center gap-1 text-sky-300">
                    <ArrowDown size={13} />
                    <span>{convertTemp(today.tempMin, unit)}°</span>
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-400 font-sans max-w-xs leading-relaxed">
                {weatherInfo.description}
              </p>
            </div>
          </div>

          {/* Sun Cycle & Quick Day Horizon (Right) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sunrise size={20} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Sunrise</span>
                <span className="text-sm font-bold text-slate-100 font-mono">
                  {today?.sunrise ? formatTime(today.sunrise) : '--:--'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sunset size={20} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Sunset</span>
                <span className="text-sm font-bold text-slate-100 font-mono">
                  {today?.sunset ? formatTime(today.sunset) : '--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Atmospheric Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-4 border-t border-white/10">
          {/* Wind */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Wind</span>
              <Wind size={15} className="text-cyan-400" />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {convertSpeed(current.windSpeed, unit === 'C' ? 'metric' : 'imperial')}
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Compass size={11} className="text-slate-500" />
              <span>Dir: {current.windDirection}°</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Humidity</span>
              <Droplets size={15} className="text-blue-400" />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {current.relativeHumidity}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Dew: {convertTemp(current.dewPoint, unit)}°
            </div>
          </div>

          {/* Pressure */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Pressure</span>
              <Gauge size={15} className="text-purple-400" />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {convertPressure(current.pressure, unit === 'C' ? 'metric' : 'imperial')}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {current.pressure >= 1013 ? 'High system' : 'Low system'}
            </div>
          </div>

          {/* UV Index */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">UV Index</span>
              <Sun size={15} className="text-amber-400" />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {current.uvIndex} <span className="text-xs font-normal">/ 11</span>
            </div>
            <div className={`text-[10px] font-mono font-semibold ${uvCategory.color}`}>
              {uvCategory.label}
            </div>
          </div>

          {/* Visibility */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Visibility</span>
              <Eye size={15} className="text-emerald-400" />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {(current.visibility / 1000).toFixed(1)} km
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {current.visibility >= 10000 ? 'Clear line of sight' : 'Haze or mist'}
            </div>
          </div>

          {/* Cloud Cover */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Cloud Cover</span>
              <Cloud size={15} className="text-slate-400" />
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {current.cloudCover}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {current.cloudCover < 20 ? 'Clear' : current.cloudCover < 70 ? 'Scattered' : 'Overcast'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
