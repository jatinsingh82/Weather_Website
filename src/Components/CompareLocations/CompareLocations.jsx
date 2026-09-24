import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Plus, Droplets, Wind, CloudRain, Thermometer } from 'lucide-react';
import { getCompleteWeatherData, searchLocations } from '../../services/weatherService';
import { formatTemp, formatTempUnit, formatWindSpeed, formatWindUnit, getWeatherAssetIcon } from '../../utils/weatherUtils';
import './CompareLocations.css';

export default function CompareLocations({
  isOpen,
  onClose,
  currentWeather,
  savedLocations,
  unit,
}) {
  const [locationsData, setLocationsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with current location + up to 2 saved locations
  useEffect(() => {
    if (!isOpen || !currentWeather) return;

    const initial = [currentWeather];
    setLocationsData(initial);

    // If there are saved locations different from current, load up to 2
    if (savedLocations && savedLocations.length > 0) {
      const candidates = savedLocations
        .filter((l) => l.name.toLowerCase() !== currentWeather.city.toLowerCase())
        .slice(0, 2);

      candidates.forEach(async (cand) => {
        try {
          const w = await getCompleteWeatherData(cand.lat || 51.5, cand.lon || 0, cand);
          setLocationsData((prev) => {
            if (prev.some((p) => p.city.toLowerCase() === w.city.toLowerCase())) return prev;
            return [...prev, w].slice(0, 3);
          });
        } catch (e) {
          console.warn('Compare fetch error:', e);
        }
      });
    }
  }, [isOpen, currentWeather]);

  // Search autocomplete to add another city
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(searchQuery.trim());
        setSearchResults(results.slice(0, 4));
      } catch (e) {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addCityToCompare = async (item) => {
    if (locationsData.length >= 3) return;
    setIsLoading(true);
    setSearchQuery('');
    setSearchResults([]);
    try {
      const data = await getCompleteWeatherData(item.lat, item.lon, item);
      setLocationsData((prev) => {
        if (prev.some((p) => p.city.toLowerCase() === data.city.toLowerCase())) return prev;
        return [...prev, data];
      });
    } catch (e) {
      console.warn('Failed to fetch comparison location:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCity = (cityIdx) => {
    setLocationsData((prev) => prev.filter((_, i) => i !== cityIdx));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="compare-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <SlidersHorizontal size={20} className="modal-icon text-sky-400" />
            <h2 className="modal-title">Compare Weather Across Cities</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="compare-modal-body">
          {/* Add City Bar (up to 3) */}
          {locationsData.length < 3 && (
            <div className="compare-search-box">
              <input
                type="text"
                placeholder="Search a city to add to comparison..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="compare-input"
              />
              {searchResults.length > 0 && (
                <div className="compare-search-dropdown">
                  {searchResults.map((item, idx) => (
                    <div
                      key={`comp-res-${idx}`}
                      className="compare-search-item"
                      onClick={() => addCityToCompare(item)}
                    >
                      <span className="name">{item.name}</span>
                      <span className="sub">{item.country}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comparison Cards Grid */}
          <div className="comparison-cards-grid">
            {locationsData.map((loc, idx) => {
              const { current, city, country, hourly } = loc;
              const assetIcon = getWeatherAssetIcon(current.iconCode);
              const rainPop = hourly?.[0]?.pop ?? 0;

              return (
                <div key={`comp-card-${city}-${idx}`} className="comparison-card">
                  <div className="comp-card-top">
                    <div>
                      <h3 className="comp-city-name">{city}</h3>
                      <span className="comp-country">{country}</span>
                    </div>
                    {locationsData.length > 1 && (
                      <button
                        type="button"
                        className="comp-remove-btn"
                        onClick={() => removeCity(idx)}
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="comp-visual-row">
                    <img src={assetIcon} alt={current.condition} className="comp-icon-img" />
                    <div className="comp-temp-group">
                      <span className="comp-temp">
                        {formatTemp(current.temp, unit)}{formatTempUnit(unit)}
                      </span>
                      <span className="comp-cond">{current.condition}</span>
                    </div>
                  </div>

                  <div className="comp-metrics-list">
                    <div className="comp-metric-row">
                      <Thermometer size={14} className="text-amber-400" />
                      <span className="label">Feels Like</span>
                      <span className="value">
                        {formatTemp(current.feelsLike, unit)}{formatTempUnit(unit)}
                      </span>
                    </div>

                    <div className="comp-metric-row">
                      <CloudRain size={14} className="text-sky-400" />
                      <span className="label">Precipitation</span>
                      <span className="value">{rainPop}%</span>
                    </div>

                    <div className="comp-metric-row">
                      <Droplets size={14} className="text-sky-400" />
                      <span className="label">Humidity</span>
                      <span className="value">{current.humidity}%</span>
                    </div>

                    <div className="comp-metric-row">
                      <Wind size={14} className="text-muted" />
                      <span className="label">Wind</span>
                      <span className="value">
                        {formatWindSpeed(current.windSpeed, unit)} {formatWindUnit(unit)}
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
