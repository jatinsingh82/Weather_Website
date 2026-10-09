import React from 'react';
import {
  Compass,
  Activity,
  Bike,
  Footprints,
  Camera,
  Sparkles,
  Coffee
} from 'lucide-react';
import { getActivityRecommendations } from '../utils/activityAdvisor';

const ICON_MAP = {
  Activity,
  Bike,
  Footprints,
  Camera,
  Sparkles,
  Coffee
};

export default function ActivityAdvisor({ current, hourly, airQuality }) {
  if (!current) return null;

  const currentHour = hourly && hourly.length > 0 ? hourly[0] : null;

  const activities = getActivityRecommendations({
    temperature: current.temperature,
    precipitationProbability: currentHour ? currentHour.precipitationProbability : 0,
    precipitation: current.precipitation,
    windSpeed: current.windSpeed,
    cloudCover: current.cloudCover,
    uvIndex: current.uvIndex,
    isDay: current.isDay,
    aqi: airQuality?.usAqi || 35
  });

  return (
    <div className="rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Compass size={18} className="text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-sans tracking-tight">
            Activity Advisor
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Telemetry-tuned suitability
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => {
          const Icon = ICON_MAP[act.icon] || Activity;

          return (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 font-sans">
                      {act.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">
                      Score: {act.score}/100
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${act.tier.bg} ${act.tier.color}`}
                >
                  {act.tier.label}
                </span>
              </div>

              {/* Score bar */}
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ width: `${act.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {act.advice}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
