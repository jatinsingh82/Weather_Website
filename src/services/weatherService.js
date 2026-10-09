/**
 * Weather Service — Open-Meteo API & Geocoding Integration
 * Provides forecast data, air quality, location search, and reverse geocoding with caching.
 */

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Default flagship locations
export const DEFAULT_LOCATIONS = [
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093 },
  { name: 'New Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209 }
];

/**
 * Search locations via Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
    const data = await res.json();
    return (data.results || []).map((item) => ({
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto'
    }));
  } catch (err) {
    console.error('Failed to search locations:', err);
    return [];
  }
}

/**
 * Reverse geocode latitude and longitude to get city & country name
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'WeatherNow/1.0 (weather-intelligence-platform)' } }
    );
    if (res.ok) {
      const data = await res.json();
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality ||
        data.address.county ||
        'Current Location';
      const country = data.address.country || '';
      return { name: city, country, admin1: data.address.state || '', latitude, longitude };
    }
  } catch (e) {
    // Fallback if nominatim has any network throttle
  }

  return {
    name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    country: 'GPS Location',
    latitude,
    longitude
  };
}

/**
 * Fetch Comprehensive Forecast and Air Quality for Coordinates
 */
export async function getWeatherData(latitude, longitude, locationName = '') {
  const cacheKey = `weather_${latitude.toFixed(3)}_${longitude.toFixed(3)}`;

  // Check client cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.data;
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }

  const forecastParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ].join(','),
    timezone: 'auto'
  });

  const airQualityParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone'
    ].join(','),
    timezone: 'auto'
  });

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`;
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${airQualityParams.toString()}`;

  const [forecastRes, aqiRes] = await Promise.all([
    fetch(forecastUrl),
    fetch(airQualityUrl).catch(() => null)
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Weather API Error: ${forecastRes.status}`);
  }

  const forecastData = await forecastRes.json();
  let aqiData = null;
  if (aqiRes && aqiRes.ok) {
    try {
      aqiData = await aqiRes.json();
    } catch {
      // AQI optional fallback
    }
  }

  // Structure full normalized payload
  const current = forecastData.current || {};
  const hourly = forecastData.hourly || {};
  const daily = forecastData.daily || {};
  const currentAqi = (aqiData && aqiData.current) || {};

  // Form hourly array (next 24-48 hours)
  const currentIsoHour = new Date().toISOString().slice(0, 13);
  let startIndex = (hourly.time || []).findIndex((t) => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const hourlyList = (hourly.time || []).slice(startIndex, startIndex + 24).map((time, i) => {
    const idx = startIndex + i;
    return {
      time,
      temperature: hourly.temperature_2m ? hourly.temperature_2m[idx] : null,
      apparentTemperature: hourly.apparent_temperature ? hourly.apparent_temperature[idx] : null,
      relativeHumidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[idx] : null,
      dewPoint: hourly.dew_point_2m ? hourly.dew_point_2m[idx] : null,
      precipitationProbability: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
      precipitation: hourly.precipitation ? hourly.precipitation[idx] : 0,
      weatherCode: hourly.weather_code ? hourly.weather_code[idx] : 0,
      cloudCover: hourly.cloud_cover ? hourly.cloud_cover[idx] : 0,
      visibility: hourly.visibility ? hourly.visibility[idx] : 10000,
      windSpeed: hourly.wind_speed_10m ? hourly.wind_speed_10m[idx] : 0,
      uvIndex: hourly.uv_index ? hourly.uv_index[idx] : 0
    };
  });

  // Form daily list (7 days)
  const dailyList = (daily.time || []).map((date, idx) => ({
    date,
    weatherCode: daily.weather_code ? daily.weather_code[idx] : 0,
    tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[idx] : null,
    tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[idx] : null,
    apparentMax: daily.apparent_temperature_max ? daily.apparent_temperature_max[idx] : null,
    apparentMin: daily.apparent_temperature_min ? daily.apparent_temperature_min[idx] : null,
    sunrise: daily.sunrise ? daily.sunrise[idx] : null,
    sunset: daily.sunset ? daily.sunset[idx] : null,
    daylightDuration: daily.daylight_duration ? Math.round(daily.daylight_duration[idx] / 3600) : null,
    uvIndexMax: daily.uv_index_max ? daily.uv_index_max[idx] : 0,
    precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[idx] : 0,
    precipitationProbabilityMax: daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0,
    windSpeedMax: daily.wind_speed_10m_max ? daily.wind_speed_10m_max[idx] : 0
  }));

  const payload = {
    location: {
      name: locationName || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      latitude,
      longitude,
      elevation: forecastData.elevation,
      timezone: forecastData.timezone
    },
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      relativeHumidity: current.relative_humidity_2m,
      isDay: current.is_day != null ? current.is_day : 1,
      precipitation: current.precipitation || 0,
      rain: current.rain || 0,
      snowfall: current.snowfall || 0,
      weatherCode: current.weather_code || 0,
      cloudCover: current.cloud_cover || 0,
      pressure: current.pressure_msl || current.surface_pressure || 1013,
      windSpeed: current.wind_speed_10m || 0,
      windDirection: current.wind_direction_10m || 0,
      windGusts: current.wind_gusts_10m || 0,
      uvIndex: hourlyList.length > 0 && hourlyList[0].uvIndex != null ? hourlyList[0].uvIndex : 3,
      dewPoint: hourlyList.length > 0 && hourlyList[0].dewPoint != null ? hourlyList[0].dewPoint : 12,
      visibility: hourlyList.length > 0 && hourlyList[0].visibility != null ? hourlyList[0].visibility : 10000
    },
    hourly: hourlyList,
    daily: dailyList,
    airQuality: {
      usAqi: currentAqi.us_aqi != null ? currentAqi.us_aqi : 42,
      europeanAqi: currentAqi.european_aqi != null ? currentAqi.european_aqi : 35,
      pm25: currentAqi.pm2_5 != null ? currentAqi.pm2_5 : 10.5,
      pm10: currentAqi.pm10 != null ? currentAqi.pm10 : 18.2,
      carbonMonoxide: currentAqi.carbon_monoxide != null ? currentAqi.carbon_monoxide : 280,
      nitrogenDioxide: currentAqi.nitrogen_dioxide != null ? currentAqi.nitrogen_dioxide : 14.1,
      sulphurDioxide: currentAqi.sulphur_dioxide != null ? currentAqi.sulphur_dioxide : 4.5,
      ozone: currentAqi.ozone != null ? currentAqi.ozone : 54.0
    },
    lastUpdated: new Date().toISOString()
  };

  // Cache response
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: payload
      })
    );
  } catch (e) {
    // Ignore quota errors
  }

  return payload;
}
