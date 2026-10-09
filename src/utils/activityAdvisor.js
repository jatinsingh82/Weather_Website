/**
 * Smart Activity Advisor Engine
 * Calculates contextual outdoor suitability ratings based on live weather telemetry.
 */

export function getActivityRecommendations({
  temperature = 22,
  precipitationProbability = 0,
  precipitation = 0,
  windSpeed = 10,
  cloudCover = 20,
  uvIndex = 3,
  isDay = 1,
  aqi = 35
}) {
  const isRaining = precipitation > 0.2 || precipitationProbability > 40;

  // Running
  let runScore = 85;
  if (temperature < 5) runScore -= (5 - temperature) * 3;
  else if (temperature > 24) runScore -= (temperature - 24) * 3.5;
  if (isRaining) runScore -= 35;
  if (windSpeed > 25) runScore -= 20;
  if (aqi > 100) runScore -= 30;
  runScore = Math.max(10, Math.min(100, runScore));

  // Cycling
  let bikeScore = 90;
  if (windSpeed > 20) bikeScore -= (windSpeed - 20) * 2.5;
  if (isRaining) bikeScore -= 45;
  if (temperature < 8 || temperature > 30) bikeScore -= 25;
  bikeScore = Math.max(10, Math.min(100, bikeScore));

  // Hiking
  let hikeScore = 88;
  if (isRaining) hikeScore -= 40;
  if (temperature > 28) hikeScore -= (temperature - 28) * 3;
  if (temperature < 6) hikeScore -= 20;
  if (windSpeed > 30) hikeScore -= 25;
  hikeScore = Math.max(10, Math.min(100, hikeScore));

  // Photography
  let photoScore = 75;
  if (cloudCover >= 20 && cloudCover <= 70) photoScore += 20; // dramatic clouds
  if (isRaining) photoScore -= 25;
  if (isDay) photoScore += 10;
  photoScore = Math.max(10, Math.min(100, photoScore));

  // Stargazing (strictly night + low cloud cover)
  let starScore = 15;
  if (!isDay) {
    starScore = Math.max(10, 100 - cloudCover - (isRaining ? 50 : 0));
  } else {
    starScore = 20; // daytime placeholder
  }

  // Outdoor Dining / Patio
  let diningScore = 85;
  if (isRaining) diningScore -= 65;
  if (temperature < 17 || temperature > 29) diningScore -= Math.abs(temperature - 22) * 4;
  if (windSpeed > 20) diningScore -= 25;
  diningScore = Math.max(10, Math.min(100, diningScore));

  const getTier = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 60) return { label: 'Good', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    if (score >= 40) return { label: 'Fair', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'Poor', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  return [
    {
      id: 'running',
      title: 'Running & Jogging',
      icon: 'Activity',
      score: runScore,
      tier: getTier(runScore),
      advice:
        runScore >= 75
          ? 'Near-ideal thermal balance and low wind resistance. Prime training window.'
          : runScore >= 50
          ? 'Acceptable for a moderate run; stay aware of hydration or cool air.'
          : 'Elevated friction from precipitation, high wind, or thermal extremes.'
    },
    {
      id: 'cycling',
      title: 'Cycling & Road Biking',
      icon: 'Bike',
      score: bikeScore,
      tier: getTier(bikeScore),
      advice:
        bikeScore >= 75
          ? 'Low gusts and dry road surfaces provide optimal cornering and cadence.'
          : bikeScore >= 50
          ? 'Manageable headwinds; exercise care on damp turns.'
          : 'High crosswinds or wet pavement present safety hazards for cyclists.'
    },
    {
      id: 'hiking',
      title: 'Hiking & Trails',
      icon: 'Footprints',
      score: hikeScore,
      tier: getTier(hikeScore),
      advice:
        hikeScore >= 75
          ? 'Clear terrain stability and comfortable ambient temperatures for ascent.'
          : hikeScore >= 50
          ? 'Bring weather-resistant layers and adequate trail water.'
          : 'Muddy slick tracks, low ridge visibility, or intense precipitation.'
    },
    {
      id: 'photography',
      title: 'Outdoor Photography',
      icon: 'Camera',
      score: photoScore,
      tier: getTier(photoScore),
      advice:
        photoScore >= 75
          ? 'Dynamic cloud diffusion and soft atmospheric lighting for rich contrast.'
          : photoScore >= 50
          ? 'Flat light or harsh shadows; use polarizers or wait for golden hour.'
          : 'Low light clarity or precipitation risks to unprotected camera gear.'
    },
    {
      id: 'stargazing',
      title: 'Stargazing & Astronomy',
      icon: 'Sparkles',
      score: starScore,
      tier: getTier(starScore),
      advice:
        !isDay && starScore >= 70
          ? 'Superb celestial transparency with minimal cloud obscuration.'
          : !isDay
          ? 'Scattered cloud layers will periodically block celestial targets.'
          : 'Daylight hours. Plan for celestial viewing after twilight.'
    },
    {
      id: 'dining',
      title: 'Outdoor Dining & Patio',
      icon: 'Coffee',
      score: diningScore,
      tier: getTier(diningScore),
      advice:
        diningScore >= 75
          ? 'Balmy temperatures and calm air make open-air dining delightful.'
          : diningScore >= 50
          ? 'Covered terrace recommended in case of slight breezes or cool shifts.'
          : 'Indoor dining strongly preferred due to rain, chilly gusts, or heat.'
    }
  ];
}
