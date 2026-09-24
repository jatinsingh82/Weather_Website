// Weather Service providing real meteorological data
// Supports OpenWeatherMap API with automatic Open-Meteo fallback for 100% real-time global accuracy

const OPENWEATHER_API_KEY = process.env.REACT_APP_API_KEY || '';

// In-memory cache to prevent duplicate requests (TTL: 5 minutes)
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Convert Open-Meteo WMO weather code to standard condition object
export function getWMOWeatherDetails(code, isDay = 1) {
  const day = Boolean(isDay);
  switch (code) {
    case 0:
      return { condition: 'Clear', description: day ? 'Sunny / Clear sky' : 'Clear night sky', iconCode: day ? '01d' : '01n' };
    case 1:
      return { condition: 'Mainly Clear', description: day ? 'Mainly sunny' : 'Mainly clear', iconCode: day ? '02d' : '02n' };
    case 2:
      return { condition: 'Partly Cloudy', description: 'Partly cloudy', iconCode: day ? '02d' : '02n' };
    case 3:
      return { condition: 'Overcast', description: 'Overcast skies', iconCode: day ? '04d' : '04n' };
    case 45:
    case 48:
      return { condition: 'Fog', description: 'Foggy / Rime fog', iconCode: '50d' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Drizzle', description: 'Light to dense drizzle', iconCode: '09d' };
    case 56:
    case 57:
      return { condition: 'Freezing Drizzle', description: 'Freezing drizzle', iconCode: '09d' };
    case 61:
      return { condition: 'Light Rain', description: 'Slight rain showers', iconCode: '10d' };
    case 63:
      return { condition: 'Moderate Rain', description: 'Moderate rain', iconCode: '10d' };
    case 65:
      return { condition: 'Heavy Rain', description: 'Heavy continuous rain', iconCode: '10d' };
    case 66:
    case 67:
      return { condition: 'Freezing Rain', description: 'Freezing rain', iconCode: '13d' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snow', description: 'Snowfall', iconCode: '13d' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain Showers', description: 'Violent rain showers', iconCode: '09d' };
    case 85:
    case 86:
      return { condition: 'Snow Showers', description: 'Snow showers', iconCode: '13d' };
    case 95:
      return { condition: 'Thunderstorm', description: 'Thunderstorm', iconCode: '11d' };
    case 96:
    case 99:
      return { condition: 'Thunderstorm with Hail', description: 'Severe thunderstorm with hail', iconCode: '11d' };
    default:
      return { condition: 'Partly Cloudy', description: 'Partly cloudy', iconCode: day ? '02d' : '02n' };
  }
}

// Convert wind degrees to compass direction
export function getWindDirection(degrees) {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

// Search locations worldwide with autocomplete
export async function searchLocations(query) {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = `geo:${trimmed.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Try OpenWeather Geocoding if key is present
  if (OPENWEATHER_API_KEY) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=6&appid=${OPENWEATHER_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const results = data.map((item) => ({
            name: item.name,
            state: item.state || '',
            country: item.country,
            lat: item.lat,
            lon: item.lon,
            displayName: [item.name, item.state, item.country].filter(Boolean).join(', '),
          }));
          setCached(cacheKey, results);
          return results;
        }
      }
    } catch (e) {
      console.warn('OpenWeather Geocoding fallback to Open-Meteo:', e.message);
    }
  }

  // Open-Meteo Free Global Geocoding
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`
    );
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();
    const results = (data.results || []).map((item) => ({
      name: item.name,
      state: item.admin1 || '',
      country: item.country_code || item.country || '',
      countryName: item.country || '',
      lat: item.latitude,
      lon: item.longitude,
      timezone: item.timezone,
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
    }));
    setCached(cacheKey, results);
    return results;
  } catch (err) {
    console.error('Geocoding error:', err);
    return [];
  }
}

// Lookup coordinates for a city query
export async function getCoordinatesForCity(cityName) {
  const results = await searchLocations(cityName);
  if (results && results.length > 0) {
    return results[0];
  }
  throw new Error(`Location not found: "${cityName}"`);
}

// Reverse geocode lat/lon to location details
export async function reverseGeocode(lat, lon) {
  const cacheKey = `rev:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (OPENWEATHER_API_KEY) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          const result = {
            name: item.name,
            state: item.state || '',
            country: item.country,
            displayName: [item.name, item.country].filter(Boolean).join(', '),
          };
          setCached(cacheKey, result);
          return result;
        }
      }
    } catch (e) {
      // Continue to Open-Meteo / BigDataCloud fallback
    }
  }

  // Fallback reverse geocode via free BigDataCloud client API
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryCode || data.countryName || '';
      const result = {
        name: city,
        state: data.principalSubdivision || '',
        country,
        displayName: [city, country].filter(Boolean).join(', '),
      };
      setCached(cacheKey, result);
      return result;
    }
  } catch (e) {
    console.warn('Reverse geocode error:', e);
  }

  return { name: 'Current Location', state: '', country: '', displayName: 'Current Location' };
}

// Fetch complete real meteorological data for coordinates
export async function getCompleteWeatherData(lat, lon, locationInfo = {}) {
  const cacheKey = `weather:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // 1. If OpenWeather API key is configured, attempt OpenWeather endpoints
  if (OPENWEATHER_API_KEY) {
    try {
      const [currentRes, forecastRes, airRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`).catch(() => null),
      ]);

      if (currentRes.ok && forecastRes.ok) {
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();
        let airData = null;
        if (airRes && airRes.ok) {
          airData = await airRes.json();
        }

        const formatted = formatOpenWeatherData(currentData, forecastData, airData, locationInfo);
        setCached(cacheKey, formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('OpenWeather fetch failed, falling back to Open-Meteo:', err.message);
    }
  }

  // 2. Open-Meteo Free Meteorological API (Complete, high-precision, no key needed)
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`;

  const [weatherRes, airRes] = await Promise.all([
    fetch(openMeteoUrl),
    fetch(airQualityUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather service error: ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  let airData = null;
  if (airRes && airRes.ok) {
    try {
      airData = await airRes.json();
    } catch (e) {
      // air quality is optional
    }
  }

  const formatted = formatOpenMeteoData(weatherData, airData, locationInfo, lat, lon);
  setCached(cacheKey, formatted);
  return formatted;
}

// Formatter for Open-Meteo payload
function formatOpenMeteoData(data, airData, locationInfo, lat, lon) {
  const current = data.current || {};
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  const currentWeatherCode = current.weather_code ?? 0;
  const isDay = current.is_day ?? 1;
  const details = getWMOWeatherDetails(currentWeatherCode, isDay);

  const timezone = data.timezone || 'UTC';
  const timezoneOffsetSeconds = data.utc_offset_seconds || 0;

  // Build 24 hours of hourly data starting from current time
  const hourlyList = [];
  const totalHours = hourly.time ? hourly.time.length : 0;
  
  // Find index corresponding to current hour or start from 0
  let startIndex = 0;
  if (hourly.time && hourly.time.length > 0) {
    const idx = hourly.time.findIndex((t) => new Date(t).getTime() >= Date.now() - 3600000);
    if (idx !== -1) startIndex = idx;
  }

  const hoursToTake = Math.min(24, totalHours - startIndex);
  for (let i = 0; i < hoursToTake; i++) {
    const idx = startIndex + i;
    const timeStr = hourly.time[idx];
    const code = hourly.weather_code ? hourly.weather_code[idx] : 0;
    const hourIsDay = hourly.is_day ? hourly.is_day[idx] : 1;
    const hourDetails = getWMOWeatherDetails(code, hourIsDay);
    const pop = hourly.precipitation_probability ? hourly.precipitation_probability[idx] ?? 0 : 0;
    const temp = hourly.temperature_2m ? Math.round(hourly.temperature_2m[idx]) : 0;
    const feelsLike = hourly.apparent_temperature ? Math.round(hourly.apparent_temperature[idx]) : temp;
    const windSpeed = hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[idx]) : 0;
    const windDirection = hourly.wind_direction_10m ? hourly.wind_direction_10m[idx] : 0;
    const humidity = hourly.relative_humidity_2m ? Math.round(hourly.relative_humidity_2m[idx]) : 0;
    const uv = hourly.uv_index ? hourly.uv_index[idx] : 0;

    hourlyList.push({
      time: timeStr,
      timestamp: new Date(timeStr).getTime(),
      temp,
      feelsLike,
      condition: hourDetails.condition,
      description: hourDetails.description,
      iconCode: hourDetails.iconCode,
      pop,
      windSpeed,
      windDirection,
      windDirectionCompass: getWindDirection(windDirection),
      humidity,
      uv,
      isDay: Boolean(hourIsDay),
    });
  }

  // Build 7-day daily forecast
  const dailyList = [];
  const dailyCount = daily.time ? Math.min(7, daily.time.length) : 0;
  for (let i = 0; i < dailyCount; i++) {
    const dateStr = daily.time[i];
    const code = daily.weather_code ? daily.weather_code[i] : 0;
    const dayDetails = getWMOWeatherDetails(code, 1);
    const maxTemp = daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[i]) : 0;
    const minTemp = daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[i]) : 0;
    const pop = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] ?? 0 : 0;
    const rainSum = daily.precipitation_sum ? daily.precipitation_sum[i] ?? 0 : 0;
    const windMax = daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[i]) : 0;
    const sunrise = daily.sunrise ? daily.sunrise[i] : null;
    const sunset = daily.sunset ? daily.sunset[i] : null;
    const uvMax = daily.uv_index_max ? daily.uv_index_max[i] : 0;

    dailyList.push({
      date: dateStr,
      timestamp: new Date(dateStr).getTime(),
      maxTemp,
      minTemp,
      condition: dayDetails.condition,
      description: dayDetails.description,
      iconCode: dayDetails.iconCode,
      pop,
      rainSum,
      windMax,
      sunrise,
      sunset,
      uvMax,
    });
  }

  // Air quality extraction
  let airQuality = null;
  if (airData && airData.current) {
    const aqCurrent = airData.current;
    const usAqi = aqCurrent.us_aqi ?? aqCurrent.european_aqi ?? null;
    let aqiLevel = 'Good';
    let aqiIndex = 1;
    if (usAqi > 150) {
      aqiLevel = 'Unhealthy';
      aqiIndex = 4;
    } else if (usAqi > 100) {
      aqiLevel = 'Moderate to Poor';
      aqiIndex = 3;
    } else if (usAqi > 50) {
      aqiLevel = 'Moderate';
      aqiIndex = 2;
    } else {
      aqiLevel = 'Good';
      aqiIndex = 1;
    }

    airQuality = {
      aqi: usAqi,
      level: aqiLevel,
      index: aqiIndex,
      pm2_5: aqCurrent.pm2_5 != null ? Math.round(aqCurrent.pm2_5 * 10) / 10 : null,
      pm10: aqCurrent.pm10 != null ? Math.round(aqCurrent.pm10 * 10) / 10 : null,
      co: aqCurrent.carbon_monoxide != null ? Math.round(aqCurrent.carbon_monoxide * 10) / 10 : null,
      no2: aqCurrent.nitrogen_dioxide != null ? Math.round(aqCurrent.nitrogen_dioxide * 10) / 10 : null,
      o3: aqCurrent.ozone != null ? Math.round(aqCurrent.ozone * 10) / 10 : null,
    };
  }

  const todayDaily = dailyList[0] || {};
  const currentTemp = current.temperature_2m != null ? Math.round(current.temperature_2m) : 0;
  const currentFeelsLike = current.apparent_temperature != null ? Math.round(current.apparent_temperature) : currentTemp;
  const currentHumidity = current.relative_humidity_2m ?? 50;
  const currentWindSpeed = current.wind_speed_10m != null ? Math.round(current.wind_speed_10m) : 0;
  const currentWindDir = current.wind_direction_10m ?? 0;
  const currentPressure = current.surface_pressure ?? current.pressure_msl ?? 1013;
  const currentVisibility = hourly.visibility && hourly.visibility[startIndex] ? Math.round(hourly.visibility[startIndex] / 1000) : 10;
  const currentUv = hourly.uv_index && hourly.uv_index[startIndex] != null ? hourly.uv_index[startIndex] : 0;

  return {
    source: 'Open-Meteo (High Precision Meteorological Model)',
    lat,
    lon,
    city: locationInfo.name || 'Current City',
    state: locationInfo.state || '',
    country: locationInfo.country || '',
    displayName: locationInfo.displayName || locationInfo.name || 'Current Location',
    timezone,
    timezoneOffsetSeconds,
    lastUpdated: Date.now(),
    current: {
      temp: currentTemp,
      feelsLike: currentFeelsLike,
      high: todayDaily.maxTemp ?? currentTemp + 2,
      low: todayDaily.minTemp ?? currentTemp - 3,
      condition: details.condition,
      description: details.description,
      iconCode: details.iconCode,
      isDay: Boolean(isDay),
      humidity: currentHumidity,
      windSpeed: currentWindSpeed,
      windDirection: currentWindDir,
      windDirectionCompass: getWindDirection(currentWindDir),
      pressure: Math.round(currentPressure),
      visibility: currentVisibility,
      uvIndex: Math.round(currentUv),
      sunrise: todayDaily.sunrise || null,
      sunset: todayDaily.sunset || null,
    },
    hourly: hourlyList,
    daily: dailyList,
    airQuality,
  };
}

// Formatter for OpenWeatherMap 2.5 payload
function formatOpenWeatherData(current, forecast, airData, locationInfo) {
  const city = locationInfo.name || current.name || 'London';
  const country = locationInfo.country || current.sys?.country || '';
  const timezoneOffsetSeconds = current.timezone || 0;

  const currentIcon = current.weather?.[0]?.icon || '01d';
  const isDay = currentIcon.includes('d');
  const condition = current.weather?.[0]?.main || 'Clear';
  const description = current.weather?.[0]?.description || 'Clear sky';

  // Build hourly from 3-hour forecast chunks
  const hourlyList = (forecast.list || []).slice(0, 8).map((item) => {
    const iconCode = item.weather?.[0]?.icon || '01d';
    const hourIsDay = iconCode.includes('d');
    const pop = item.pop ? Math.round(item.pop * 100) : 0;
    return {
      time: item.dt_txt,
      timestamp: item.dt * 1000,
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      condition: item.weather?.[0]?.main || 'Clear',
      description: item.weather?.[0]?.description || '',
      iconCode,
      pop,
      windSpeed: Math.round(item.wind?.speed * 3.6), // convert m/s to km/h
      windDirection: item.wind?.deg || 0,
      windDirectionCompass: getWindDirection(item.wind?.deg || 0),
      humidity: item.main.humidity,
      uv: 0,
      isDay: hourIsDay,
    };
  });

  // Group 5-day forecast by date for daily outlook
  const dailyMap = new Map();
  (forecast.list || []).forEach((item) => {
    const dateKey = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: dateKey,
        timestamp: item.dt * 1000,
        temps: [],
        conditions: [],
        pops: [],
        icons: [],
        windSpeeds: [],
      });
    }
    const d = dailyMap.get(dateKey);
    d.temps.push(item.main.temp);
    d.conditions.push(item.weather?.[0]?.main || 'Clear');
    d.pops.push(item.pop ? Math.round(item.pop * 100) : 0);
    d.icons.push(item.weather?.[0]?.icon || '01d');
    d.windSpeeds.push(Math.round(item.wind?.speed * 3.6));
  });

  const dailyList = Array.from(dailyMap.values()).slice(0, 5).map((d) => {
    const maxTemp = Math.round(Math.max(...d.temps));
    const minTemp = Math.round(Math.min(...d.temps));
    const maxPop = Math.max(...d.pops, 0);
    const maxWind = Math.max(...d.windSpeeds, 0);
    // pick mid-day condition
    const midIdx = Math.floor(d.conditions.length / 2);
    return {
      date: d.date,
      timestamp: d.timestamp,
      maxTemp,
      minTemp,
      condition: d.conditions[midIdx] || 'Clear',
      description: d.conditions[midIdx] || 'Clear',
      iconCode: d.icons[midIdx] || '01d',
      pop: maxPop,
      rainSum: 0,
      windMax: maxWind,
      sunrise: current.sys?.sunrise ? new Date(current.sys.sunrise * 1000).toISOString() : null,
      sunset: current.sys?.sunset ? new Date(current.sys.sunset * 1000).toISOString() : null,
      uvMax: 0,
    };
  });

  // Air quality from OpenWeather air pollution
  let airQuality = null;
  if (airData && airData.list && airData.list[0]) {
    const item = airData.list[0];
    const aqi = item.main?.aqi ?? 1;
    const aqiLevels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    airQuality = {
      aqi: aqi * 25, // normalize to standard 100-scale
      level: aqiLevels[aqi - 1] || 'Moderate',
      index: aqi,
      pm2_5: item.components?.pm2_5 != null ? Math.round(item.components.pm2_5 * 10) / 10 : null,
      pm10: item.components?.pm10 != null ? Math.round(item.components.pm10 * 10) / 10 : null,
      co: item.components?.co != null ? Math.round(item.components.co * 10) / 10 : null,
      no2: item.components?.no2 != null ? Math.round(item.components.no2 * 10) / 10 : null,
      o3: item.components?.o3 != null ? Math.round(item.components.o3 * 10) / 10 : null,
    };
  }

  const sunriseIso = current.sys?.sunrise ? new Date(current.sys.sunrise * 1000).toISOString() : null;
  const sunsetIso = current.sys?.sunset ? new Date(current.sys.sunset * 1000).toISOString() : null;

  return {
    source: 'OpenWeatherMap API',
    lat: current.coord?.lat,
    lon: current.coord?.lon,
    city,
    state: locationInfo.state || '',
    country,
    displayName: locationInfo.displayName || `${city}, ${country}`,
    timezone: 'UTC',
    timezoneOffsetSeconds,
    lastUpdated: Date.now(),
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      high: Math.round(current.main.temp_max),
      low: Math.round(current.main.temp_min),
      condition,
      description,
      iconCode: currentIcon,
      isDay,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind?.speed * 3.6), // km/h
      windDirection: current.wind?.deg || 0,
      windDirectionCompass: getWindDirection(current.wind?.deg || 0),
      pressure: current.main.pressure,
      visibility: current.visibility ? Math.round(current.visibility / 1000) : 10,
      uvIndex: 0,
      sunrise: sunriseIso,
      sunset: sunsetIso,
    },
    hourly: hourlyList,
    daily: dailyList,
    airQuality,
  };
}
