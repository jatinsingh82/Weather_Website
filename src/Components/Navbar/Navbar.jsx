import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Sun,
  Moon,
  X,
  History,
  Clock,
  SlidersHorizontal,
  BookmarkCheck,
  Camera,
  Share2
} from 'lucide-react';
import { searchLocations } from '../../services/weatherService';
import './Navbar.css';

export default function Navbar({
  currentCity,
  unit,
  onUnitToggle,
  theme,
  onThemeToggle,
  onSelectLocation,
  onGetCurrentLocation,
  isGeoLoading,
  savedLocations,
  onOpenSavedModal,
  onOpenCompareModal,
  onOpenSnapshotModal,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchContainerRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('weathernow_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch (e) {
      console.warn('Could not read recent searches:', e);
    }
  }, []);

  const saveRecentSearch = (item) => {
    try {
      const updated = [item, ...recentSearches.filter((r) => r.displayName !== item.displayName)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('weathernow_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save recent search:', e);
    }
  };

  const removeRecentSearch = (e, index) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((_, i) => i !== index);
      setRecentSearches(updated);
      localStorage.setItem('weathernow_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not remove recent search:', err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(trimmed);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.warn('Search error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelectLocation(item);
    saveRecentSearch(item);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const totalItems = suggestions.length > 0 ? suggestions.length : recentSearches.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } else if (recentSearches.length > 0 && selectedIndex >= 0 && recentSearches[selectedIndex]) {
        handleSelect(recentSearches[selectedIndex]);
      } else if (query.trim().length > 0) {
        // Fallback search directly by query string
        onSelectLocation({ name: query.trim(), displayName: query.trim() });
        setQuery('');
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        {/* Brand identity */}
        <div className="navbar-brand-section">
          <div className="navbar-brand">
            <div className="brand-logo-icon">
              <Compass className="brand-compass" size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-title">WeatherNow</span>
              <span className="brand-badge">PRO</span>
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="navbar-search-wrapper" ref={searchContainerRef}>
          <div className="search-input-box">
            <Search className="search-icon-svg" size={18} />
            <input
              type="text"
              className="search-input-field cityInput"
              placeholder="Search city, region, or worldwide..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              aria-label="Search city"
              aria-expanded={isOpen}
              autoComplete="off"
            />

            {isLoading && <div className="search-spinner" />}

            {query && !isLoading && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

            <button
              type="button"
              className={`search-gps-btn ${isGeoLoading ? 'loading' : ''}`}
              onClick={onGetCurrentLocation}
              title="Detect my current location"
              aria-label="Use current location"
            >
              <MapPin size={17} />
            </button>
          </div>

          {/* Autocomplete / Recent Searches Dropdown */}
          {isOpen && (
            <div className="search-dropdown-menu">
              {suggestions.length > 0 ? (
                <div className="dropdown-section">
                  <div className="dropdown-section-title">Matching Locations</div>
                  <ul className="dropdown-list" role="listbox">
                    {suggestions.map((item, index) => (
                      <li
                        key={`${item.lat}-${item.lon}-${index}`}
                        className={`dropdown-item ${selectedIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSelect(item)}
                        role="option"
                        aria-selected={selectedIndex === index}
                      >
                        <MapPin size={16} className="item-pin-icon" />
                        <div className="item-text">
                          <span className="item-name">{item.name}</span>
                          <span className="item-details">
                            {[item.state, item.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : query.trim().length >= 2 && !isLoading ? (
                <div className="dropdown-empty">
                  <span>No matching locations found for "{query}".</span>
                </div>
              ) : recentSearches.length > 0 ? (
                <div className="dropdown-section">
                  <div className="dropdown-section-title">
                    <History size={13} style={{ marginRight: '6px' }} />
                    Recent Searches
                  </div>
                  <ul className="dropdown-list">
                    {recentSearches.map((item, index) => (
                      <li
                        key={`recent-${index}`}
                        className={`dropdown-item ${selectedIndex === index ? 'selected' : ''}`}
                        onClick={() => handleSelect(item)}
                      >
                        <Clock size={15} className="item-pin-icon text-muted" />
                        <div className="item-text">
                          <span className="item-name">{item.displayName || item.name}</span>
                        </div>
                        <button
                          type="button"
                          className="item-remove-btn"
                          onClick={(e) => removeRecentSearch(e, index)}
                          title="Remove recent search"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Actions & Utilities */}
        <div className="navbar-actions">
          {/* Quick saved locations modal launcher */}
          <button
            type="button"
            className="action-btn saved-btn"
            onClick={onOpenSavedModal}
            title="Saved Locations"
            aria-label="View saved locations"
          >
            <BookmarkCheck size={18} />
            <span className="btn-label-desktop">Saved</span>
            {savedLocations && savedLocations.length > 0 && (
              <span className="badge-count">{savedLocations.length}</span>
            )}
          </button>

          {/* Compare locations launcher */}
          <button
            type="button"
            className="action-btn compare-btn"
            onClick={onOpenCompareModal}
            title="Compare 2-3 Locations"
            aria-label="Compare locations"
          >
            <SlidersHorizontal size={18} />
            <span className="btn-label-desktop">Compare</span>
          </button>

          {/* Weather Snapshot trigger */}
          <button
            type="button"
            className="action-btn snapshot-btn"
            onClick={onOpenSnapshotModal}
            title="Weather Snapshot Card"
            aria-label="Generate weather snapshot"
          >
            <Camera size={18} />
            <span className="btn-label-desktop">Snapshot</span>
          </button>

          {/* Unit Switcher (°C / °F) */}
          <button
            type="button"
            className="action-btn unit-btn"
            onClick={onUnitToggle}
            title={`Switch to ${unit === 'metric' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
            aria-label="Toggle temperature unit"
          >
            <span className={unit === 'metric' ? 'unit-active' : 'unit-inactive'}>°C</span>
            <span className="unit-divider">/</span>
            <span className={unit === 'imperial' ? 'unit-active' : 'unit-inactive'}>°F</span>
          </button>

          {/* Theme Switcher (Dark / Light) */}
          <button
            type="button"
            className="action-btn theme-btn"
            onClick={onThemeToggle}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Quick Location Chips Bar (if user has saved locations) */}
      {savedLocations && savedLocations.length > 0 && (
        <div className="quick-chips-bar">
          <div className="quick-chips-container">
            <span className="chips-label">My Places:</span>
            <div className="chips-scroll">
              {savedLocations.map((loc) => {
                const isCurrent = currentCity && currentCity.toLowerCase() === loc.name.toLowerCase();
                return (
                  <button
                    key={`chip-${loc.name}-${loc.lat || 0}`}
                    type="button"
                    className={`quick-chip ${isCurrent ? 'active' : ''}`}
                    onClick={() => onSelectLocation(loc)}
                  >
                    <span className="chip-name">{loc.name}</span>
                    {loc.temp != null && <span className="chip-temp">{loc.temp}°</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
