import React, { useState } from 'react';
import {
  Footprints,
  Flame,
  Bike,
  Wrench,
  Car,
  Camera,
  Dumbbell,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { getActivityRecommendations, calculateBestTimeToday } from '../../utils/weatherUtils';
import './ActivityAdvisor.css';

const ACTIVITIES = [
  { id: 'Walking', label: 'Walking', icon: Footprints },
  { id: 'Running', label: 'Running', icon: Flame },
  { id: 'Cycling', label: 'Cycling', icon: Bike },
  { id: 'Photography', label: 'Photo', icon: Camera },
  { id: 'Outdoor work', label: 'Work', icon: Wrench },
  { id: 'Travel', label: 'Travel', icon: Car },
  { id: 'Exercise', label: 'Workout', icon: Dumbbell },
];

export default function ActivityAdvisor({ weather }) {
  const [selectedActivity, setSelectedActivity] = useState('Walking');

  const advice = getActivityRecommendations(weather, selectedActivity);
  const bestTime = calculateBestTimeToday(weather, selectedActivity);

  return (
    <div className="activity-advisor-card">
      <div className="advisor-header">
        <div className="advisor-title-row">
          <HelpCircle size={18} className="advisor-help-icon" />
          <h3 className="advisor-title">Activity Advisor & Best Time</h3>
        </div>
        <span className="advisor-disclaimer-pill" title="Optimized forecast window">
          <Sparkles size={11} />
          <span>Intelligent Window</span>
        </span>
      </div>

      {/* Activity selector tabs */}
      <div className="activity-tabs" role="tablist">
        {ACTIVITIES.map((act) => {
          const IconComp = act.icon;
          const isActive = selectedActivity === act.id;
          return (
            <button
              key={act.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`activity-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedActivity(act.id)}
            >
              <IconComp size={15} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      {/* Best Time Today Hero Window */}
      <div className="best-time-window-box">
        <div className="best-time-top">
          <div className="best-time-badge">
            <Clock size={13} />
            <span>BEST TIME TODAY</span>
          </div>
          <span className="best-time-score">{bestTime.score}% favorable</span>
        </div>

        <div className="best-time-hours-row">
          <span className="best-time-hours">{bestTime.windowLabel}</span>
        </div>

        {/* Reasons list */}
        <div className="best-time-reasons">
          {bestTime.reasons.map((reason, idx) => (
            <div key={`reason-${idx}`} className="best-reason-item">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Interactive mini timeline showing window progression */}
        {bestTime.hourlyTimeline.length > 0 && (
          <div className="best-time-timeline-track">
            <span className="track-sub-label">Hourly Favorability Gradient:</span>
            <div className="timeline-bars-row">
              {bestTime.hourlyTimeline.map((h, i) => (
                <div
                  key={`bt-bar-${i}`}
                  className={`timeline-hour-slot ${h.isBestWindow ? 'highlight-window' : ''}`}
                  title={`${h.timeLabel}: ${h.score}% (${h.temp}°C, ${h.pop}% rain)`}
                >
                  <div className="slot-bar-fill" style={{ height: `${h.score}%` }} />
                  <span className="slot-hour-text">{i % 3 === 0 ? h.timeLabel : '·'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="best-time-disclaimer">
          <Info size={11} />
          <span>{bestTime.disclaimer}</span>
        </div>
      </div>

      {/* Current immediate recommendation ("Right now") */}
      <div className="recommendation-content">
        <div className="rec-status-line">
          <div className="rec-icon-badge">
            <CheckCircle2 size={16} className={advice.statusColor} />
          </div>
          <div>
            <span className="rec-right-now-label">Current Condition: </span>
            <span className={`rec-status-text ${advice.statusColor}`}>{advice.status}</span>
          </div>
        </div>

        <p className="rec-recommendation">{advice.recommendation}</p>
        <p className="rec-rationale">{advice.rationale}</p>
      </div>
    </div>
  );
}
