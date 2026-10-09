/**
 * Algorithmic Atmospheric Comfort Score Model (0-100)
 * Evaluates thermal equilibrium, moisture comfort, wind impact, and solar radiation.
 */

export function calculateComfortScore({
  temperature = 22,
  humidity = 50,
  windSpeed = 10,
  dewPoint = 12,
  uvIndex = 3
}) {
  // 1. Thermal Comfort Component (Max 40 points)
  // Optimal human comfort range: 20°C - 24°C
  let thermalScore = 40;
  const tempDiff = Math.abs(temperature - 22);
  if (tempDiff <= 2) {
    thermalScore = 40;
  } else if (tempDiff <= 6) {
    thermalScore = 40 - (tempDiff - 2) * 3;
  } else if (tempDiff <= 12) {
    thermalScore = 28 - (tempDiff - 6) * 2.5;
  } else {
    thermalScore = Math.max(0, 13 - (tempDiff - 12) * 1.5);
  }

  // 2. Relative Humidity & Dew Point Component (Max 25 points)
  // Optimal humidity: 40% - 60%, optimal dew point: 8°C - 15°C
  let moistureScore = 25;
  if (humidity >= 40 && humidity <= 60 && dewPoint <= 15) {
    moistureScore = 25;
  } else if (humidity > 60) {
    const excess = humidity - 60;
    moistureScore = Math.max(5, 25 - excess * 0.45);
    if (dewPoint > 20) moistureScore -= 6; // Muggy penalty
  } else if (humidity < 40) {
    const dryDeficit = 40 - humidity;
    moistureScore = Math.max(8, 25 - dryDeficit * 0.35); // Dry air penalty
  }

  // 3. Wind Dynamic Component (Max 20 points)
  // Gentle breeze (6 - 15 km/h) is ideal; gale or dead stagnant air is less comfortable
  let windScore = 20;
  if (windSpeed >= 6 && windSpeed <= 18) {
    windScore = 20;
  } else if (windSpeed < 6) {
    windScore = 17; // slightly stagnant
  } else if (windSpeed <= 30) {
    windScore = Math.max(6, 20 - (windSpeed - 18) * 0.9);
  } else {
    windScore = Math.max(2, 9 - (windSpeed - 30) * 0.4); // Gale penalty
  }

  // 4. Solar Radiation & UV Burden (Max 15 points)
  // UV 0-3 is benign, UV 8+ adds heat exhaustion stress
  let solarScore = 15;
  if (uvIndex <= 3) {
    solarScore = 15;
  } else if (uvIndex <= 6) {
    solarScore = 12;
  } else if (uvIndex <= 8) {
    solarScore = 8;
  } else {
    solarScore = Math.max(2, 6 - (uvIndex - 8) * 1.5);
  }

  const totalScore = Math.min(100, Math.max(0, Math.round(thermalScore + moistureScore + windScore + solarScore)));

  let rating = 'Optimal';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  let summary = 'Ideal atmospheric equilibrium with gentle breezes and pleasant thermal comfort.';
  let advisory = 'Superb conditions for outdoor activities and natural ventilation.';

  if (totalScore >= 85) {
    rating = 'Ideal';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    summary = 'Atmospheric conditions are in the peak comfort sweet spot.';
    advisory = 'Perfect window for outdoor exercise, walks, and patio dining.';
  } else if (totalScore >= 70) {
    rating = 'Pleasant';
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    summary = 'Very comfortable atmosphere with minimal environmental strain.';
    advisory = 'Great outdoor weather. Light jacket or casual attire recommended depending on wind.';
  } else if (totalScore >= 55) {
    rating = 'Moderate';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    summary = 'Noticeable thermal deviation, humidity, or brisk wind currents.';
    advisory = 'Dress in breathable layers and stay hydrated during prolonged activities.';
  } else if (totalScore >= 35) {
    rating = 'Challenging';
    badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    summary = 'Significant environmental discomfort driven by temperatures or moisture extremes.';
    advisory = 'Limit intense outdoor training; seek shade or windbreak when outdoors.';
  } else {
    rating = 'Harsh';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    summary = 'Extreme atmospheric conditions creating substantial thermal stress.';
    advisory = 'Minimize prolonged outdoor exposure; prioritize climate-controlled environments.';
  }

  return {
    score: totalScore,
    rating,
    badgeColor,
    summary,
    advisory,
    breakdown: {
      thermal: Math.round((thermalScore / 40) * 100),
      moisture: Math.round((moistureScore / 25) * 100),
      wind: Math.round((windScore / 20) * 100),
      solar: Math.round((solarScore / 15) * 100)
    }
  };
}
