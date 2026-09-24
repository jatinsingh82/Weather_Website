import React, { useState } from 'react';
import {
  Footprints,
  Flame,
  Bike,
  Wrench,
  Car,
  Camera,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { getActivityRecommendations } from '../../utils/weatherUtils';
import './ActivityAdvisor.css';

const ACTIVITIES = [
  { id: 'Walking', label: 'Walking', icon: Footprints },
  { id: 'Running', label: 'Running', icon: Flame },
  { id: 'Cycling', label: 'Cycling', icon: Bike },
  { id: 'Outdoor work', label: 'Work', icon: Wrench },
  { id: 'Travel', label: 'Travel', icon: Car },
  { id: 'Photography', label: 'Photo', icon: Camera },
];

export default function ActivityAdvisor({ weather }) {
  const [selectedActivity, setSelectedActivity] = useState('Walking');

  const advice = getActivityRecommendations(weather, selectedActivity);

  return (
    <div className="activity-advisor-card">
      <div className="advisor-header">
        <div className="advisor-title-row">
          <HelpCircle size={18} className="advisor-help-icon" />
          <h3 className="advisor-title">Should I go out?</h3>
        </div>
        <span className="advisor-disclaimer">Informational suggestion</span>
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

      {/* Recommendation box */}
      <div className="recommendation-content">
        <div className="rec-status-line">
          <div className="rec-icon-badge">
            <CheckCircle2 size={16} className={advice.statusColor} />
          </div>
          <span className={`rec-status-text ${advice.statusColor}`}>{advice.status}</span>
        </div>

        <p className="rec-recommendation">{advice.recommendation}</p>
        <p className="rec-rationale">{advice.rationale}</p>
      </div>
    </div>
  );
}
