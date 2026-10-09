import React from 'react';
import { Bookmark, X, MapPin, Trash2, ArrowRight, Plus } from 'lucide-react';
import { DEFAULT_LOCATIONS } from '../services/weatherService';

export default function SavedLocationsModal({
  savedLocations = [],
  onSelectLocation,
  onRemoveLocation,
  onAddLocation,
  onClose
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bookmark size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Saved Locations ({savedLocations.length})
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Quick-access meteorological bookmarks
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {savedLocations.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm text-slate-400 font-sans">
                You haven't bookmarked any locations yet.
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Click the bookmark icon on any city header to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedLocations.map((loc) => (
                <div
                  key={`${loc.name}-${loc.latitude}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <button
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                        {loc.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {loc.country || 'Region'} · {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Load weather"
                    >
                      <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={() => onRemoveLocation(loc)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Add Major Hubs */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Suggested Global Hubs
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_LOCATIONS.map((def) => {
                const isAlreadySaved = savedLocations.some(
                  (s) => s.name.toLowerCase() === def.name.toLowerCase()
                );
                return (
                  <button
                    key={def.name}
                    onClick={() => {
                      if (!isAlreadySaved) onAddLocation(def);
                      onSelectLocation(def);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left text-xs transition-colors group"
                  >
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                      {def.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{def.country}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
