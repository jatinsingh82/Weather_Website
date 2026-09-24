import React, { useState, useEffect, useCallback } from 'react';
import { getCompleteWeatherData, getCoordinatesForCity } from '../../services/weatherService';
import WeatherBackground from '../WeatherBackground/WeatherBackground';
import Navbar from '../Navbar/Navbar';
import WeatherAlerts from '../WeatherAlerts/WeatherAlerts';
import HeroWeather from '../HeroWeather/HeroWeather';
import ComfortScore from '../ComfortScore/ComfortScore';
import ActivityAdvisor from '../ActivityAdvisor/ActivityAdvisor';
import WeatherDNA from '../WeatherDNA/WeatherDNA';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import WeatherIntelligence from '../WeatherIntelligence/WeatherIntelligence';
import DailyForecast from '../DailyForecast/DailyForecast';
import SunAndAir from '../SunAndAir/SunAndAir';
import RainRadar from '../RainRadar/RainRadar';
import SavedLocationsModal from '../SavedLocationsModal/SavedLocationsModal';
import CompareLocations from '../CompareLocations/CompareLocations';
import SnapshotModal from '../SnapshotModal/SnapshotModal';
import { AlertCircle, RefreshCw, Sparkles, MapPin } from 'lucide-react';
import './WeatherApp.css';

const DEFAULT_SAVED_LOCATIONS = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
];

export default function WeatherApp() {
  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('weathernow_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Unit state ('metric' | 'imperial')
  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem('weathernow_unit') || 'metric';
    } catch {
      return 'metric';
    }
  });

  // Saved locations state
  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      const stored = localStorage.getItem('weathernow_saved_locations');
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_LOCATIONS;
    } catch {
      return DEFAULT_SAVED_LOCATIONS;
    }
  });

  // Main weather state
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active coordinates
  const [coords, setCoords] = useState({
    lat: 51.5074,
    lon: -0.1278,
    name: 'London',
    country: 'United Kingdom',
  });

  // Modals state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Sync theme with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('weathernow_theme', theme);
    } catch (e) {
      console.warn('Could not persist theme:', e);
    }
  }, [theme]);

  // Persist unit preference
  const handleUnitToggle = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
    try {
      localStorage.setItem('weathernow_unit', nextUnit);
    } catch (e) {
      console.warn('Could not persist unit:', e);
    }
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch weather data for given coordinates
  const loadWeather = useCallback(async (lat, lon, metadata = {}, showRefreshSpinner = false) => {
    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getCompleteWeatherData(lat, lon, metadata);
      setWeather(data);

      // Also update saved locations with fresh temperature
      setSavedLocations((prev) =>
        prev.map((loc) => {
          if (loc.name.toLowerCase() === data.city.toLowerCase()) {
            return { ...loc, temp: data.current.temp };
          }
          return loc;
        })
      );
    } catch (err) {
      console.error('Weather load failure:', err);
      setError(err.message || 'Failed to load weather data. Please check your connection.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Attempt geolocation on first load if user allows, else load default
    if (navigator.geolocation && !localStorage.getItem('weathernow_has_geolocated')) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          localStorage.setItem('weathernow_has_geolocated', 'true');
          setCoords({ lat, lon, name: 'Local Area' });
          loadWeather(lat, lon, { name: 'My Location' });
        },
        () => {
          // If rejected or error, use default
          loadWeather(coords.lat, coords.lon, coords);
        },
        { timeout: 5000 }
      );
    } else {
      loadWeather(coords.lat, coords.lon, coords);
    }
  }, [loadWeather]);

  // Handle location selection from search or quick chips
  const handleSelectLocation = async (locationItem) => {
    if (locationItem.lat != null && locationItem.lon != null) {
      setCoords({
        lat: locationItem.lat,
        lon: locationItem.lon,
        name: locationItem.name,
        country: locationItem.country,
      });
      loadWeather(locationItem.lat, locationItem.lon, locationItem);
    } else if (locationItem.name) {
      // Lookup coordinates by name
      try {
        setLoading(true);
        const resolved = await getCoordinatesForCity(locationItem.name);
        setCoords(resolved);
        loadWeather(resolved.lat, resolved.lon, resolved);
      } catch (err) {
        setError(`Unable to locate coordinates for "${locationItem.name}".`);
        setLoading(false);
      }
    }
  };

  // Detect current GPS location on demand
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const geoMeta = { lat, lon, name: 'Current Location' };
        setCoords(geoMeta);
        loadWeather(lat, lon, geoMeta);
        setIsGeoLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsGeoLoading(false);
        alert('Could not access your location. Please check your browser location permissions.');
      },
      { timeout: 8000 }
    );
  };

  // Toggle saving current location
  const isCurrentSaved = weather && savedLocations.some(
    (loc) => loc.name.toLowerCase() === weather.city.toLowerCase()
  );

  const handleToggleSave = () => {
    if (!weather) return;
    try {
      let updated;
      if (isCurrentSaved) {
        updated = savedLocations.filter(
          (loc) => loc.name.toLowerCase() !== weather.city.toLowerCase()
        );
      } else {
        const newLoc = {
          name: weather.city,
          country: weather.country,
          lat: weather.lat,
          lon: weather.lon,
          temp: weather.current.temp,
        };
        updated = [newLoc, ...savedLocations];
      }
      setSavedLocations(updated);
      localStorage.setItem('weathernow_saved_locations', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update saved locations:', e);
    }
  };

  const handleRemoveSavedLocation = (locToRemove) => {
    try {
      const updated = savedLocations.filter(
        (loc) => loc.name.toLowerCase() !== locToRemove.name.toLowerCase()
      );
      setSavedLocations(updated);
      localStorage.setItem('weathernow_saved_locations', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not remove location:', e);
    }
  };

  // Keyboard shortcut: Press 's' to focus search, 'r' to refresh
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'r' || e.key === 'R') {
        loadWeather(coords.lat, coords.lon, coords, true);
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input-field');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [coords, loadWeather]);

  const conditionCode = weather?.current?.iconCode || '01d';
  const isDay = weather?.current?.isDay !== false;

  return (
    <div className="weather-app-container container">
      {/* Dynamic atmospheric reactive background */}
      <WeatherBackground conditionCode={conditionCode} isDay={isDay} />

      {/* Main Content Viewport */}
      <div className="app-foreground-layer">
        {/* Navigation & Search Bar */}
        <Navbar
          currentCity={weather?.city || coords.name}
          unit={unit}
          onUnitToggle={handleUnitToggle}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onSelectLocation={handleSelectLocation}
          onGetCurrentLocation={handleGetCurrentLocation}
          isGeoLoading={isGeoLoading}
          savedLocations={savedLocations}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
          onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
        />

        <main className="main-content-area">
          {/* Error Banner */}
          {error && (
            <div className="error-banner" role="alert">
              <div className="error-content">
                <AlertCircle size={20} className="error-icon" />
                <div className="error-text">
                  <strong>Network / Location Error:</strong>
                  <span>{error}</span>
                </div>
              </div>
              <button
                type="button"
                className="error-retry-btn"
                onClick={() => loadWeather(coords.lat, coords.lon, coords)}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton / State */}
          {loading && !weather && (
            <div className="weather-loading-screen">
              <div className="loading-card">
                <RefreshCw size={36} className="spinning text-sky-400" />
                <h2 className="loading-title">Syncing Real-Time Atmosphere...</h2>
                <p className="loading-sub">
                  Retrieving high-precision Doppler models and ground telemetry
                </p>
              </div>
            </div>
          )}

          {/* Render Active Weather Dashboard */}
          {weather && (
            <div className="dashboard-content-layout">
              {/* Critical Advisories Banner */}
              <WeatherAlerts weather={weather} />

              {/* Primary Hero Section */}
              <HeroWeather
                weather={weather}
                unit={unit}
                onRefresh={() => loadWeather(coords.lat, coords.lon, coords, true)}
                isRefreshing={isRefreshing}
                isSaved={isCurrentSaved}
                onToggleSave={handleToggleSave}
              />

              {/* Dual Column: Comfort Score & "Should I go out?" Advisor */}
              <div className="comfort-advisor-row">
                <ComfortScore weather={weather} />
                <ActivityAdvisor weather={weather} />
              </div>

              {/* Weather DNA — Personality summary of the day */}
              <WeatherDNA
                hourly={weather.hourly}
                currentTemp={weather.current.temp}
                unit={unit}
              />

              {/* 24-Hour Timeline */}
              <HourlyForecast
                hourly={weather.hourly}
                unit={unit}
                timezoneOffsetSeconds={weather.timezoneOffsetSeconds}
              />

              {/* Weather Intelligence & Story & Rain Window */}
              <WeatherIntelligence
                weather={weather}
                timezoneOffsetSeconds={weather.timezoneOffsetSeconds}
              />

              {/* 7-Day Interactive Forecast */}
              <DailyForecast daily={weather.daily} unit={unit} />

              {/* Sun & Daylight Arc + Air Quality */}
              <SunAndAir
                current={weather.current}
                airQuality={weather.airQuality}
                timezoneOffsetSeconds={weather.timezoneOffsetSeconds}
              />

              {/* Precipitation Radar (Doppler stream) */}
              <RainRadar
                lat={weather.lat}
                lon={weather.lon}
                city={weather.displayName || weather.city}
              />
            </div>
          )}
        </main>

        {/* Professional Footer */}
        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-left">
              <div className="footer-brand">
                <span className="footer-brand-title">WeatherNow Pro</span>
                <span className="footer-dot">·</span>
                <span className="footer-edition">Precision Meteorological Platform</span>
              </div>
              <p className="footer-copy">
                Continuous atmospheric intelligence powered by Open-Meteo & OpenWeatherMap APIs. No synthetic data.
              </p>
            </div>

            <div className="footer-right">
              <div className="footer-shortcuts">
                <span className="shortcut-badge">Press <kbd>/</kbd> to Search</span>
                <span className="shortcut-badge">Press <kbd>R</kbd> to Refresh</span>
              </div>
              <div className="footer-legal">
                <span>© {new Date().getFullYear()} WeatherNow. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <SavedLocationsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedLocations={savedLocations}
        currentCity={weather?.city || coords.name}
        onSelectLocation={handleSelectLocation}
        onRemoveLocation={handleRemoveSavedLocation}
        onAddCurrentLocation={handleToggleSave}
        isCurrentSaved={isCurrentSaved}
      />

      <CompareLocations
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        currentWeather={weather}
        savedLocations={savedLocations}
        unit={unit}
      />

      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        weather={weather}
        unit={unit}
      />
    </div>
  );
}
