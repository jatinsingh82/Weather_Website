import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Plus,
  Search,
  MapPin,
  Trash2,
  Wind,
  Droplets,
  HeartPulse,
  Sun
} from 'lucide-react';
import { getWeatherData, searchLocations } from '../services/weatherService';
import { getWeatherInfo } from '../utils/weatherCodes';
import { calculateComfortScore } from '../utils/comfortScore';
import { convertTemp, convertSpeed } from '../utils/formatters';

export default function CompareLocations({
  baseLocation,
  baseWeatherData,
  unit = 'C',
  onClose
}) {
  const [comparedData, setComparedData] = useState([
    { location: baseLocation, data: baseWeatherData }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchLocations(searchQuery);
      setSearchResults(res);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add city to comparison
  const handleAddLocation = async (loc) => {
    if (comparedData.length >= 3) return;
    setIsLoadingCity(true);
    try {
      const data = await getWeatherData(loc.latitude, loc.longitude, loc.name);
      setComparedData((prev) => [...prev, { location: loc, data }]);
      setSearchQuery('');
      setSearchResults([]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Remove city
  const handleRemove = (index) => {
    if (comparedData.length <= 1) return;
    setComparedData((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Location Weather Comparison
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Side-by-side atmospheric matrix (up to 3 cities)
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

        {/* Search for additional city (if < 3) */}
        {comparedData.length < 3 && (
          <div className="p-4 bg-slate-950/60 border-b border-slate-800">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search city to add to comparison..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-colors"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </form>

            {/* Results dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl divide-y divide-white/5 overflow-hidden shadow-lg">
                {searchResults.slice(0, 4).map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddLocation(r)}
                    className="w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-slate-200">
                      {r.name}, {r.country}
                    </span>
                    <Plus size={14} className="text-purple-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comparison Matrix Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div
            className={`grid gap-4 ${
              comparedData.length === 1
                ? 'grid-cols-1'
                : comparedData.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {comparedData.map((item, idx) => {
              const current = item.data?.current || {};
              const air = item.data?.airQuality || {};
              const info = getWeatherInfo(current.weatherCode, current.isDay);
              const Icon = info.Icon;
              const comfort = calculateComfortScore({
                temperature: current.temperature,
                humidity: current.relativeHumidity,
                windSpeed: current.windSpeed,
                dewPoint: current.dewPoint,
                uvIndex: current.uvIndex
              });

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-sans">
                        {item.location?.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {item.location?.country || 'Region'}
                      </span>
                    </div>

                    {idx > 0 && (
                      <button
                        onClick={() => handleRemove(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="Remove city"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Temperature & Condition */}
                  <div className="flex items-center gap-4 py-2 border-y border-white/5">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <Icon size={28} className={info.accent} />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white font-mono">
                        {convertTemp(current.temperature, unit)}°{unit}
                      </div>
                      <span className="text-xs text-slate-300 font-sans">
                        {info.label}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Table */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
                      <span>Feels Like</span>
                      <span className="text-white font-bold">
                        {convertTemp(current.apparentTemperature, unit)}°{unit}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
                      <span>Humidity</span>
                      <span className="text-white font-bold">{current.relativeHumidity}%</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
                      <span>Wind</span>
                      <span className="text-white font-bold">
                        {convertSpeed(current.windSpeed, unit === 'C' ? 'metric' : 'imperial')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
                      <span>Air Quality (US AQI)</span>
                      <span className="text-cyan-300 font-bold">{air.usAqi || '--'}</span>
                    </div>

                    <div className="flex justify-between py-1 text-slate-400">
                      <span>Comfort Score</span>
                      <span className="text-emerald-400 font-bold">
                        {comfort.score}/100 ({comfort.rating})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
