import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  CloudRain,
  SlidersHorizontal,
  Bookmark,
  RefreshCw,
  SunMedium,
  Check,
  X
} from 'lucide-react';
import { searchLocations } from '../services/weatherService';

export default function Navbar({
  currentLocation,
  onSelectLocation,
  onUseCurrentLocation,
  unit,
  onToggleUnit,
  onOpenRadar,
  onOpenCompare,
  onOpenSaved,
  savedLocations = [],
  onRefresh,
  isLoading
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelectLocation(item);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Active City */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <SunMedium size={20} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  WEATHER<span className="text-cyan-400">NOW</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 truncate max-w-[210px] sm:max-w-xs">
                <MapPin size={11} className="text-cyan-400 shrink-0" />
                <span>{currentLocation?.name || 'Searching...'}</span>
                {currentLocation?.country && (
                  <span className="text-slate-500">· {currentLocation.country}</span>
                )}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onToggleUnit}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200"
            >
              °{unit}
            </button>
            <button
              onClick={onUseCurrentLocation}
              aria-label="Use GPS location"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
            >
              <Navigation size={14} />
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full md:max-w-md lg:max-w-lg">
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search global city, region, or coordinates..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown Suggestions */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
              {suggestions.map((loc, idx) => (
                <button
                  key={`${loc.name}-${loc.latitude}-${idx}`}
                  onClick={() => handleSelect(loc)}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-cyan-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white font-sans">
                      {loc.name}
                      {loc.admin1 && <span className="text-slate-400">, {loc.admin1}</span>}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300">
                    {loc.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Modules */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
          </button>

          {/* GPS Location */}
          <button
            onClick={onUseCurrentLocation}
            title="Locate via GPS"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Navigation size={13} className="text-cyan-400" />
            <span>GPS</span>
          </button>

          {/* Saved Cities */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <Bookmark size={13} className="text-amber-400" />
            <span>Saved ({savedLocations.length})</span>
          </button>

          {/* Precipitation Radar */}
          <button
            onClick={onOpenRadar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <CloudRain size={13} className="text-cyan-400" />
            <span>Rain Radar</span>
          </button>

          {/* Location Compare */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <SlidersHorizontal size={13} className="text-purple-400" />
            <span>Compare</span>
          </button>

          {/* Unit Toggle */}
          <button
            onClick={onToggleUnit}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold text-slate-200 hover:text-cyan-300 transition-colors"
            title="Toggle between Celsius and Fahrenheit"
          >
            °{unit}
          </button>
        </div>
      </div>
    </header>
  );
}
