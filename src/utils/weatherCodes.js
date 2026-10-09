import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Snowflake
} from 'lucide-react';

/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
export const WMO_CODES = {
  0: {
    label: 'Clear Sky',
    description: 'Completely clear skies with exceptional visibility',
    iconDay: Sun,
    iconNight: Moon,
    theme: 'clear',
    gradientDay: 'from-amber-500/20 via-sky-500/20 to-blue-900/40',
    gradientNight: 'from-indigo-950 via-slate-900 to-black',
    accent: 'text-amber-400'
  },
  1: {
    label: 'Mainly Clear',
    description: 'Scattered passing clouds with bright intervals',
    iconDay: CloudSun,
    iconNight: CloudMoon,
    theme: 'clear',
    gradientDay: 'from-amber-500/15 via-sky-600/20 to-blue-900/40',
    gradientNight: 'from-indigo-950/90 via-slate-900 to-black',
    accent: 'text-amber-300'
  },
  2: {
    label: 'Partly Cloudy',
    description: 'Mix of sun and cloud formations',
    iconDay: CloudSun,
    iconNight: CloudMoon,
    theme: 'clouds',
    gradientDay: 'from-sky-500/20 via-slate-600/20 to-slate-900/50',
    gradientNight: 'from-slate-900 via-slate-950 to-black',
    accent: 'text-sky-300'
  },
  3: {
    label: 'Overcast',
    description: 'Continuous cloud cover obscuring direct sunlight',
    iconDay: Cloud,
    iconNight: Cloud,
    theme: 'clouds',
    gradientDay: 'from-slate-600/25 via-slate-700/25 to-slate-950',
    gradientNight: 'from-slate-900 via-slate-950 to-black',
    accent: 'text-slate-300'
  },
  45: {
    label: 'Foggy',
    description: 'Ground-level cloud with significantly reduced visibility',
    iconDay: CloudFog,
    iconNight: CloudFog,
    theme: 'fog',
    gradientDay: 'from-zinc-500/20 via-slate-600/20 to-slate-950',
    gradientNight: 'from-zinc-900 via-slate-950 to-black',
    accent: 'text-zinc-300'
  },
  48: {
    label: 'Depositing Rime Fog',
    description: 'Freezing fog depositing delicate ice crystals',
    iconDay: CloudFog,
    iconNight: CloudFog,
    theme: 'fog',
    gradientDay: 'from-cyan-900/20 via-slate-700/20 to-slate-950',
    gradientNight: 'from-cyan-950 via-slate-950 to-black',
    accent: 'text-cyan-300'
  },
  51: {
    label: 'Light Drizzle',
    description: 'Fine mist-like rainfall',
    iconDay: CloudDrizzle,
    iconNight: CloudDrizzle,
    theme: 'rain',
    gradientDay: 'from-teal-600/20 via-blue-800/20 to-slate-950',
    gradientNight: 'from-teal-950 via-slate-900 to-black',
    accent: 'text-teal-300'
  },
  53: {
    label: 'Moderate Drizzle',
    description: 'Steady light drizzle droplets',
    iconDay: CloudDrizzle,
    iconNight: CloudDrizzle,
    theme: 'rain',
    gradientDay: 'from-cyan-600/20 via-blue-800/25 to-slate-950',
    gradientNight: 'from-cyan-950 via-slate-900 to-black',
    accent: 'text-cyan-300'
  },
  55: {
    label: 'Dense Drizzle',
    description: 'Thick continuous drizzle',
    iconDay: CloudDrizzle,
    iconNight: CloudDrizzle,
    theme: 'rain',
    gradientDay: 'from-blue-600/25 via-slate-800/30 to-slate-950',
    gradientNight: 'from-blue-950 via-slate-900 to-black',
    accent: 'text-blue-300'
  },
  61: {
    label: 'Slight Rain',
    description: 'Gentle rainfall across the area',
    iconDay: CloudRain,
    iconNight: CloudRain,
    theme: 'rain',
    gradientDay: 'from-blue-500/25 via-indigo-900/30 to-slate-950',
    gradientNight: 'from-blue-950 via-slate-900 to-black',
    accent: 'text-blue-400'
  },
  63: {
    label: 'Moderate Rain',
    description: 'Steady precipitation with accumulating moisture',
    iconDay: CloudRain,
    iconNight: CloudRain,
    theme: 'rain',
    gradientDay: 'from-blue-600/30 via-indigo-900/35 to-slate-950',
    gradientNight: 'from-blue-950 via-slate-950 to-black',
    accent: 'text-blue-400'
  },
  65: {
    label: 'Heavy Rain',
    description: 'Intense rain showers with high volume precipitation',
    iconDay: CloudRain,
    iconNight: CloudRain,
    theme: 'rain',
    gradientDay: 'from-indigo-600/35 via-blue-900/40 to-slate-950',
    gradientNight: 'from-indigo-950 via-slate-950 to-black',
    accent: 'text-indigo-400'
  },
  71: {
    label: 'Slight Snow Fall',
    description: 'Light fluttering snowflakes',
    iconDay: Snowflake,
    iconNight: Snowflake,
    theme: 'snow',
    gradientDay: 'from-sky-300/25 via-indigo-900/25 to-slate-950',
    gradientNight: 'from-sky-950 via-slate-900 to-black',
    accent: 'text-sky-200'
  },
  73: {
    label: 'Moderate Snow Fall',
    description: 'Steady snow accumulations with reduced visibility',
    iconDay: CloudSnow,
    iconNight: CloudSnow,
    theme: 'snow',
    gradientDay: 'from-cyan-300/30 via-slate-800/30 to-slate-950',
    gradientNight: 'from-cyan-950 via-slate-900 to-black',
    accent: 'text-cyan-200'
  },
  75: {
    label: 'Heavy Snow Fall',
    description: 'Heavy snowfall with blowing drifts',
    iconDay: CloudSnow,
    iconNight: CloudSnow,
    theme: 'snow',
    gradientDay: 'from-white/20 via-sky-900/30 to-slate-950',
    gradientNight: 'from-sky-950 via-slate-950 to-black',
    accent: 'text-white'
  },
  77: {
    label: 'Snow Grains',
    description: 'Small opaque grains of ice',
    iconDay: Snowflake,
    iconNight: Snowflake,
    theme: 'snow',
    gradientDay: 'from-sky-300/20 via-slate-800/30 to-slate-950',
    gradientNight: 'from-sky-950 via-slate-900 to-black',
    accent: 'text-sky-200'
  },
  80: {
    label: 'Slight Rain Showers',
    description: 'Brief intermittent rain showers',
    iconDay: CloudRain,
    iconNight: CloudRain,
    theme: 'rain',
    gradientDay: 'from-blue-500/25 via-indigo-900/25 to-slate-950',
    gradientNight: 'from-blue-950 via-slate-900 to-black',
    accent: 'text-blue-300'
  },
  81: {
    label: 'Moderate Rain Showers',
    description: 'Frequent rain showers passing through',
    iconDay: CloudRain,
    iconNight: CloudRain,
    theme: 'rain',
    gradientDay: 'from-blue-600/30 via-indigo-900/30 to-slate-950',
    gradientNight: 'from-blue-950 via-slate-900 to-black',
    accent: 'text-blue-400'
  },
  82: {
    label: 'Violent Rain Showers',
    description: 'Torrential downpours with rapid runoff',
    iconDay: CloudRain,
    iconNight: CloudRain,
    theme: 'rain',
    gradientDay: 'from-indigo-700/35 via-blue-950/50 to-slate-950',
    gradientNight: 'from-indigo-950 via-slate-950 to-black',
    accent: 'text-indigo-300'
  },
  85: {
    label: 'Slight Snow Showers',
    description: 'Passing flurry of snow showers',
    iconDay: CloudSnow,
    iconNight: CloudSnow,
    theme: 'snow',
    gradientDay: 'from-sky-300/25 via-slate-900/30 to-slate-950',
    gradientNight: 'from-sky-950 via-slate-950 to-black',
    accent: 'text-sky-200'
  },
  86: {
    label: 'Heavy Snow Showers',
    description: 'Intense blizzard-like snow bursts',
    iconDay: CloudSnow,
    iconNight: CloudSnow,
    theme: 'snow',
    gradientDay: 'from-white/20 via-sky-900/40 to-slate-950',
    gradientNight: 'from-sky-950 via-slate-950 to-black',
    accent: 'text-white'
  },
  95: {
    label: 'Thunderstorm',
    description: 'Convective storm with lightning and heavy rain',
    iconDay: CloudLightning,
    iconNight: CloudLightning,
    theme: 'thunderstorm',
    gradientDay: 'from-purple-600/30 via-indigo-900/40 to-slate-950',
    gradientNight: 'from-purple-950 via-slate-950 to-black',
    accent: 'text-purple-400'
  },
  96: {
    label: 'Thunderstorm with Slight Hail',
    description: 'Electrified storm with scattered small hail pellets',
    iconDay: CloudLightning,
    iconNight: CloudLightning,
    theme: 'thunderstorm',
    gradientDay: 'from-fuchsia-600/30 via-indigo-900/40 to-slate-950',
    gradientNight: 'from-fuchsia-950 via-slate-950 to-black',
    accent: 'text-fuchsia-400'
  },
  99: {
    label: 'Thunderstorm with Heavy Hail',
    description: 'Severe thunderstorm accompanied by damaging hail',
    iconDay: CloudLightning,
    iconNight: CloudLightning,
    theme: 'thunderstorm',
    gradientDay: 'from-rose-600/35 via-purple-900/45 to-slate-950',
    gradientNight: 'from-rose-950 via-slate-950 to-black',
    accent: 'text-rose-400'
  }
};

export function getWeatherInfo(code, isDay = 1) {
  const info = WMO_CODES[code] || {
    label: 'Partly Cloudy',
    description: 'Variable cloudiness and atmospheric conditions',
    iconDay: CloudSun,
    iconNight: CloudMoon,
    theme: 'clouds',
    gradientDay: 'from-sky-500/20 via-slate-600/20 to-slate-900/50',
    gradientNight: 'from-slate-900 via-slate-950 to-black',
    accent: 'text-sky-300'
  };

  const Icon = isDay ? info.iconDay : info.iconNight;
  const gradient = isDay ? info.gradientDay : info.gradientNight;

  return {
    ...info,
    Icon,
    gradient
  };
}
