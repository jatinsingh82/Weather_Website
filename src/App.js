import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Components/Navbar';
import HeroWeather from './Components/HeroWeather';
import HourlyForecast from './Components/HourlyForecast';
import DailyForecast from './Components/DailyForecast';
import ComfortScore from './Components/ComfortScore';
import AirQuality from './Components/AirQuality';
import WeatherDNA from './Components/WeatherDNA';
import ActivityAdvisor from './Components/ActivityAdvisor';
import RainRadar from './Components/RainRadar';
import CompareLocations from './Components/CompareLocations';
import SavedLocationsModal from './Components/SavedLocationsModal';
import Footer from './Components/Footer';
import {
  getWeatherData,
  reverseGeocode,
  DEFAULT_LOCATIONS
} from './services/weatherService';
import { CloudRain, AlertTriangle, RefreshCw } from 'lucide-react';

const STORAGE_KEY_UNIT = 'weathernow_unit';
const STORAGE_KEY_SAVED = 'weathernow_saved_locations';

function App() {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_UNIT) || 'C';
  });
  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : [DEFAULT_LOCATIONS[0], DEFAULT_LOCATIONS[1]];
    } catch {
      return [DEFAULT_LOCATIONS[0], DEFAULT_LOCATIONS[1]];
    }
  });

  // Modal dialog states
  const [showRadar, setShowRadar] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Load weather for a location
  const loadWeather = useCallback(async (loc) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(loc.latitude, loc.longitude, loc.name);
      setWeatherData(data);
      setCurrentLocation(loc);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError('Unable to retrieve atmospheric data. Check network or try another city.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request browser geolocation
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await reverseGeocode(latitude, longitude);
          loadWeather(locDetails);
        } catch {
          loadWeather({
            name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            country: 'GPS Location',
            latitude,
            longitude
          });
        }
      },
      (geoErr) => {
        console.warn('Geolocation denied or timed out:', geoErr);
        setIsLoading(false);
        // Fallback to current or default location
        if (!weatherData) {
          loadWeather(DEFAULT_LOCATIONS[0]);
        }
      },
      { timeout: 9000, enableHighAccuracy: false }
    );
  }, [loadWeather, weatherData]);

  // Initial mount: attempt geolocation or load default location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const locDetails = await reverseGeocode(latitude, longitude);
            loadWeather(locDetails);
          } catch {
            loadWeather({
              name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
              country: 'GPS Location',
              latitude,
              longitude
            });
          }
        },
        () => {
          loadWeather(DEFAULT_LOCATIONS[0]);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      loadWeather(DEFAULT_LOCATIONS[0]);
    }
  }, [loadWeather]);

  // Toggle temperature unit (°C / °F)
  const handleToggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      localStorage.setItem(STORAGE_KEY_UNIT, next);
      return next;
    });
  };

  // Saved locations management
  const isCurrentSaved = savedLocations.some(
    (s) =>
      s.name.toLowerCase() === currentLocation?.name?.toLowerCase() ||
      (Math.abs(s.latitude - currentLocation?.latitude) < 0.05 &&
        Math.abs(s.longitude - currentLocation?.longitude) < 0.05)
  );

  const handleToggleSaveCurrent = () => {
    if (isCurrentSaved) {
      setSavedLocations((prev) => {
        const updated = prev.filter(
          (s) => s.name.toLowerCase() !== currentLocation.name.toLowerCase()
        );
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
        return updated;
      });
    } else {
      setSavedLocations((prev) => {
        const updated = [currentLocation, ...prev];
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleRemoveSaved = (locToRemove) => {
    setSavedLocations((prev) => {
      const updated = prev.filter(
        (s) => s.name.toLowerCase() !== locToRemove.name.toLowerCase()
      );
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddSaved = (locToAdd) => {
    setSavedLocations((prev) => {
      if (prev.some((s) => s.name.toLowerCase() === locToAdd.name.toLowerCase())) {
        return prev;
      }
      const updated = [locToAdd, ...prev];
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Header */}
      <Navbar
        currentLocation={currentLocation}
        onSelectLocation={loadWeather}
        onUseCurrentLocation={handleUseCurrentLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onOpenRadar={() => setShowRadar(true)}
        onOpenCompare={() => setShowCompare(true)}
        onOpenSaved={() => setShowSaved(true)}
        savedLocations={savedLocations}
        onRefresh={() => loadWeather(currentLocation)}
        isLoading={isLoading}
      />

      {/* Main Meteorological Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 text-rose-200 animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-rose-400 shrink-0" />
              <span className="text-sm font-sans">{error}</span>
            </div>
            <button
              onClick={() => loadWeather(currentLocation)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-mono font-bold text-rose-300 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
              <CloudRain size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-200 font-sans">
                Connecting to Meteorological Satellites...
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Fetching Open-Meteo atmospheric telemetry and air quality indices
              </p>
            </div>
          </div>
        )}

        {/* Live Weather Presentation */}
        {weatherData && (
          <>
            {/* Primary Hero Conditions Showcase */}
            <HeroWeather
              weatherData={weatherData}
              unit={unit}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSaveCurrent}
            />

            {/* Hourly Timeline (24 Hours) */}
            <HourlyForecast hourly={weatherData.hourly} unit={unit} />

            {/* 7-Day Extended Forecast */}
            <DailyForecast daily={weatherData.daily} unit={unit} />

            {/* Atmospheric Intelligence Triad: Comfort Score, Air Quality & Weather DNA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ComfortScore current={weatherData.current} />
              </div>
              <div className="lg:col-span-1">
                <AirQuality airQuality={weatherData.airQuality} />
              </div>
              <div className="lg:col-span-1">
                <WeatherDNA current={weatherData.current} />
              </div>
            </div>

            {/* Smart Activity Recommendations */}
            <ActivityAdvisor
              current={weatherData.current}
              hourly={weatherData.hourly}
              airQuality={weatherData.airQuality}
            />
          </>
        )}
      </main>

      {/* Doppler Radar Modal */}
      {showRadar && (
        <RainRadar
          location={currentLocation}
          onClose={() => setShowRadar(false)}
        />
      )}

      {/* Multi-Location Comparison Modal */}
      {showCompare && (
        <CompareLocations
          baseLocation={currentLocation}
          baseWeatherData={weatherData}
          unit={unit}
          onClose={() => setShowCompare(false)}
        />
      )}

      {/* Saved Cities Bookmark Manager Modal */}
      {showSaved && (
        <SavedLocationsModal
          savedLocations={savedLocations}
          onSelectLocation={loadWeather}
          onRemoveLocation={handleRemoveSaved}
          onAddLocation={handleAddSaved}
          onClose={() => setShowSaved(false)}
        />
      )}

      {/* Global Application Footer */}
      <Footer lastUpdated={weatherData?.lastUpdated} unit={unit} />
    </div>
  );
}

export default App;
