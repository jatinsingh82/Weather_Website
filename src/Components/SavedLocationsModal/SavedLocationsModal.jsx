import React from 'react';
import { X, Bookmark, Trash2, MapPin, Plus, Check } from 'lucide-react';
import './SavedLocationsModal.css';

export default function SavedLocationsModal({
  isOpen,
  onClose,
  savedLocations,
  currentCity,
  onSelectLocation,
  onRemoveLocation,
  onAddCurrentLocation,
  isCurrentSaved,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Bookmark size={20} className="modal-icon text-sky-400" />
            <h2 className="modal-title">My Saved Locations</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick add current city action */}
          <div className="save-current-action-box">
            <div className="current-location-info">
              <MapPin size={16} className="text-sky-400" />
              <span>Current: <strong>{currentCity}</strong></span>
            </div>
            {isCurrentSaved ? (
              <span className="already-saved-tag">
                <Check size={14} /> Saved
              </span>
            ) : (
              <button
                type="button"
                className="add-current-btn"
                onClick={onAddCurrentLocation}
              >
                <Plus size={14} />
                <span>Save Current</span>
              </button>
            )}
          </div>

          {/* Locations list */}
          {savedLocations.length > 0 ? (
            <div className="saved-list">
              {savedLocations.map((loc, idx) => {
                const isSelected = currentCity && currentCity.toLowerCase() === loc.name.toLowerCase();
                return (
                  <div
                    key={`saved-${loc.name}-${idx}`}
                    className={`saved-item-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                  >
                    <div className="saved-item-info">
                      <div className="item-name-line">
                        <span className="saved-name">{loc.name}</span>
                        {isSelected && <span className="active-tag">Active</span>}
                      </div>
                      <span className="saved-country">
                        {[loc.state, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>

                    <div className="saved-actions" onClick={(e) => e.stopPropagation()}>
                      {loc.temp != null && (
                        <span className="saved-temp-badge">{loc.temp}°</span>
                      )}
                      <button
                        type="button"
                        className="delete-loc-btn"
                        onClick={() => onRemoveLocation(loc)}
                        title="Remove location"
                        aria-label={`Remove ${loc.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="saved-empty-state">
              <Bookmark size={32} className="text-muted" />
              <p>No saved locations yet. Bookmark cities to quickly switch between them anytime.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
