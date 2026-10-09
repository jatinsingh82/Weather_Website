/**
 * Weather DNA / Atmospheric Archetype Engine
 * Categorizes the macro air mass based on pressure gradient, moisture, solar power, and wind speed.
 */

export function calculateWeatherDna({
  temperature = 22,
  humidity = 55,
  pressure = 1013,
  windSpeed = 12,
  cloudCover = 30,
  uvIndex = 4
}) {
  let archetype = 'Temperate Equilibrium';
  let badge = 'Equilibrium';
  let color = 'from-cyan-500 to-blue-500';
  let description = 'Well-balanced atmospheric conditions with moderate humidity and steady barometric stability.';

  if (temperature > 28 && humidity > 65) {
    archetype = 'Humid Tropical Envelope';
    badge = 'High Moisture & Heat';
    color = 'from-emerald-500 to-teal-500';
    description = 'Dense warm air mass with high vapor pressure, promoting afternoon thermal convective buildup.';
  } else if (temperature > 28 && humidity < 35) {
    archetype = 'Arid Solar Dominance';
    badge = 'Dry & High UV';
    color = 'from-amber-500 to-orange-500';
    description = 'Intense solar radiation through dry, low-density troposphere with rapid radiative heating.';
  } else if (windSpeed > 30) {
    archetype = 'Kinetic Barometric Front';
    badge = 'High Kinetic Energy';
    color = 'from-indigo-500 to-purple-500';
    description = 'Dynamic pressure gradient driving strong advective airflow and rapid atmospheric mixing.';
  } else if (temperature < 5) {
    archetype = 'Boreal Cryospheric Calm';
    badge = 'Cold & Crisp';
    color = 'from-sky-400 to-blue-600';
    description = 'Low thermal energy air mass with compressed density and crisp, high-visibility horizons.';
  } else if (humidity > 80 && cloudCover > 70) {
    archetype = 'Maritime Marine Layer';
    badge = 'High Saturation';
    color = 'from-slate-400 to-cyan-600';
    description = 'Deep marine moisture boundary with stratiform cloud deck and diminished evaporative rate.';
  }

  // Atmospheric Dimensions normalized to 0-100
  const solarIntensity = Math.min(100, Math.round((uvIndex / 11) * 100));
  const moistureDensity = Math.min(100, Math.round(humidity));
  const kineticEnergy = Math.min(100, Math.round((windSpeed / 50) * 100));
  const barometricStability = Math.min(100, Math.max(0, Math.round(((pressure - 980) / 50) * 100)));

  return {
    archetype,
    badge,
    color,
    description,
    dimensions: [
      { name: 'Solar Energy', value: solarIntensity, icon: 'Sun', unit: '%' },
      { name: 'Moisture Density', value: moistureDensity, icon: 'Droplets', unit: '%' },
      { name: 'Kinetic Wind', value: kineticEnergy, icon: 'Wind', unit: '%' },
      { name: 'Pressure Stability', value: barometricStability, icon: 'Gauge', unit: '%' }
    ]
  };
}
