/**
 * Scenario Index Registry
 */
import { RANSOMWARE_SCENARIO } from './scenarios/ransomware';
import { CLOUD_EXPOSURE_SCENARIO } from './scenarios/cloudExposure';
import { PHISHING_ATO_SCENARIO } from './scenarios/phishingAto';

export const ALL_SCENARIOS = [
  RANSOMWARE_SCENARIO,
  PHISHING_ATO_SCENARIO,
  CLOUD_EXPOSURE_SCENARIO
];

export function getScenarioById(id) {
  return ALL_SCENARIOS.find((s) => s.id === id) || RANSOMWARE_SCENARIO;
}
