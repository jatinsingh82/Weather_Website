// Weather utility functions: units, comfort score, activity recommendations,
// Weather DNA, change detector, story generator, and asset icon mapping.

import clearIcon from '../Components/Assets/clear.png';
import cloudIcon from '../Components/Assets/cloud.png';
import drizzleIcon from '../Components/Assets/drizzle.png';
import rainIcon from '../Components/Assets/rain.png';
import snowIcon from '../Components/Assets/snow.png';

// Map icon code (OpenWeather standard 01d, 02d, etc.) to the project's original asset images
export function getWeatherAssetIcon(iconCode) {
  if (!iconCode) return cloudIcon;
  const code = iconCode.toLowerCase();
  if (code.startsWith('01')) return clearIcon;
  if (code.startsWith('02') || code.startsWith('03') || code.startsWith('04')) return cloudIcon;
  if (code.startsWith('09')) return drizzleIcon;
  if (code.startsWith('10') || code.startsWith('11')) return rainIcon;
  if (code.startsWith('13')) return snowIcon;
  if (code.startsWith('50')) return cloudIcon;
  return cloudIcon;
}

// Unit conversion helpers
export function formatTemp(celsius, unit = 'metric') {
  if (celsius === undefined || celsius === null) return '--';
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTempUnit(unit = 'metric') {
  return unit === 'imperial' ? '°F' : '°C';
}

export function formatWindSpeed(kmh, unit = 'metric') {
  if (kmh === undefined || kmh === null) return '--';
  if (unit === 'imperial') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

export function formatWindUnit(unit = 'metric') {
  return unit === 'imperial' ? 'mph' : 'km/h';
}

export function formatPressure(hPa, unit = 'metric') {
  if (hPa === undefined || hPa === null) return '--';
  if (unit === 'imperial') {
    return (hPa * 0.02953).toFixed(2) + ' inHg';
  }
  return `${Math.round(hPa)} hPa`;
}

export function formatVisibility(km, unit = 'metric') {
  if (km === undefined || km === null) return '--';
  if (unit === 'imperial') {
    return (km * 0.621371).toFixed(1) + ' mi';
  }
  return `${km} km`;
}

// Format local time of a city given its UTC offset in seconds
export function formatCityLocalTime(offsetSeconds) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + offsetSeconds * 1000);
  return {
    timeString: cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    dateString: cityTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
    hour: cityTime.getHours(),
  };
}

// Format an ISO timestamp or date into short time (e.g. "2 PM")
export function formatHourTime(timeStr, timezoneOffsetSeconds = 0) {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

// Format weekday and date
export function formatDayDate(dateStr) {
  if (!dateStr) return { dayName: '', dateFormatted: '' };
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  let dayName = d.toLocaleDateString([], { weekday: 'short' });
  if (isToday) dayName = 'Today';
  else if (isTomorrow) dayName = 'Tomorrow';

  const dateFormatted = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return { dayName, dateFormatted };
}

// Weather Comfort Score (0-100)
// Computed from real temperature, humidity, wind, and rain
export function calculateComfortScore(weather) {
  if (!weather || !weather.current) {
    return { score: 75, label: 'Moderate', description: 'Conditions are typical for this season.' };
  }

  const { temp, humidity, windSpeed } = weather.current;
  const rainPop = weather.hourly?.[0]?.pop ?? 0;

  let score = 100;

  // Temperature penalty (ideal range: 19°C - 24°C)
  if (temp < 19) {
    const diff = 19 - temp;
    score -= Math.min(35, diff * 2.2);
  } else if (temp > 24) {
    const diff = temp - 24;
    score -= Math.min(35, diff * 2.5);
  }

  // Humidity penalty (ideal range: 35% - 60%)
  if (humidity > 60) {
    score -= Math.min(25, (humidity - 60) * 0.7);
  } else if (humidity < 30) {
    score -= Math.min(15, (30 - humidity) * 0.5);
  }

  // Wind penalty (ideal: < 18 km/h)
  if (windSpeed > 18) {
    score -= Math.min(20, (windSpeed - 18) * 0.8);
  }

  // Precipitation penalty
  if (rainPop > 10) {
    score -= Math.min(25, (rainPop / 100) * 25);
  }

  const finalScore = Math.max(10, Math.min(100, Math.round(score)));

  let label = 'Comfortable';
  let description = 'Optimal outdoor conditions with pleasant temperature and fresh air.';

  if (finalScore >= 85) {
    label = 'Optimal Comfort';
    description = 'Gentle breeze, balanced humidity, and ideal ambient temperature.';
  } else if (finalScore >= 70) {
    label = 'Pleasant & Mild';
    description = 'Very pleasant for most activities with minor weather factors.';
  } else if (finalScore >= 55) {
    if (humidity > 70 && temp > 25) {
      label = 'Warm & Humid';
      description = 'Higher moisture levels may make it feel stickier than actual temperature.';
    } else if (temp < 12) {
      label = 'Cool & Crisp';
      description = 'Cooler temperatures; a light layer or jacket is recommended.';
    } else {
      label = 'Moderate';
      description = 'Standard seasonal conditions with some noticeable breeze or humidity.';
    }
  } else if (finalScore >= 40) {
    if (rainPop > 40) {
      label = 'Damp & Unsettled';
      description = 'Precipitation expected. Wet surfaces and humid air.';
    } else if (windSpeed > 30) {
      label = 'Breezy & Gusty';
      description = 'Brisk winds noticeable outdoors; secure loose items.';
    } else {
      label = 'Less Comfortable';
      description = 'Temperatures or humidity outside the optimal comfort envelope.';
    }
  } else {
    label = 'Harsh Conditions';
    description = 'Extreme temperatures, strong winds, or heavy precipitation active.';
  }

  return { score: finalScore, label, description };
}

// Activity Recommendation Engine ("Should I go out?")
export function getActivityRecommendations(weather, selectedActivity = 'Walking') {
  if (!weather || !weather.current) {
    return {
      status: 'Moderate',
      statusColor: 'text-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      recommendation: 'Check local weather conditions before heading out.',
      rationale: 'Loading forecast parameters.',
    };
  }

  const { temp, humidity, windSpeed, visibility } = weather.current;
  const next4Hours = (weather.hourly || []).slice(0, 4);
  const maxRainNext4 = next4Hours.length > 0 ? Math.max(...next4Hours.map((h) => h.pop || 0)) : 0;
  const avgWindNext4 = next4Hours.length > 0 ? Math.round(next4Hours.reduce((a, b) => a + (b.windSpeed || 0), 0) / next4Hours.length) : windSpeed;

  switch (selectedActivity) {
    case 'Walking': {
      if (maxRainNext4 > 60) {
        return {
          status: 'Carry an umbrella',
          statusColor: 'text-amber-400',
          recommendation: 'Rain probability peaks at ' + maxRainNext4 + '% in the coming hours.',
          rationale: `Current temp is ${temp}°C with noticeable rain expected. A rain jacket or umbrella is strongly advised.`,
        };
      }
      if (temp > 33) {
        return {
          status: 'Very hot — go later',
          statusColor: 'text-rose-400',
          recommendation: 'High heat index currently. Consider walking in the evening.',
          rationale: `Temperature is ${temp}°C with ${humidity}% humidity. Seek shade and carry water if walking now.`,
        };
      }
      if (temp < 3) {
        return {
          status: 'Cold — bundle up',
          statusColor: 'text-sky-400',
          recommendation: 'Chilly conditions outside. Wear warm insulated layers.',
          rationale: `Temperature is ${temp}°C with wind of ${windSpeed} km/h creating a cool wind chill.`,
        };
      }
      return {
        status: 'Great time for a walk',
        statusColor: 'text-emerald-400',
        recommendation: 'Pleasant ambient conditions with low rain chance.',
        rationale: `Comfortable ${temp}°C, gentle breeze at ${windSpeed} km/h, and only ${maxRainNext4}% rain probability.`,
      };
    }

    case 'Running': {
      if (temp > 28 || (temp > 25 && humidity > 75)) {
        return {
          status: 'High thermal stress',
          statusColor: 'text-rose-400',
          recommendation: 'Run during early morning or sunset when temperatures drop.',
          rationale: `High temperature (${temp}°C) and moisture (${humidity}%) will hinder sweat evaporation.`,
        };
      }
      if (maxRainNext4 > 50) {
        return {
          status: 'Wet surfaces likely',
          statusColor: 'text-amber-400',
          recommendation: 'Watch for slippery pavements and decreasing visibility.',
          rationale: `Rain probability is ${maxRainNext4}%. Choose trail or footwear with good wet traction.`,
        };
      }
      if (temp >= 10 && temp <= 22 && windSpeed < 25) {
        return {
          status: 'Ideal running weather',
          statusColor: 'text-emerald-400',
          recommendation: 'Prime conditions for endurance and distance pacing.',
          rationale: `Crisp ${temp}°C temperature and modest ${windSpeed} km/h wind provide optimal cooling.`,
        };
      }
      return {
        status: 'Good for a run',
        statusColor: 'text-sky-400',
        recommendation: 'Suitable conditions; adjust your gear to current temperature.',
        rationale: `Current temp is ${temp}°C with ${windSpeed} km/h wind.`,
      };
    }

    case 'Cycling': {
      if (avgWindNext4 > 32) {
        return {
          status: 'Windy conditions — caution',
          statusColor: 'text-rose-400',
          recommendation: 'High crosswinds expected; expect resistance and buffeting.',
          rationale: `Sustained winds of ${avgWindNext4} km/h. Plan routes sheltered from open wind corridors.`,
        };
      }
      if (maxRainNext4 > 45) {
        return {
          status: 'Slick roads anticipated',
          statusColor: 'text-amber-400',
          recommendation: 'Reduce cornering speed and verify brake response in the wet.',
          rationale: `${maxRainNext4}% chance of rain in the forecast window with wet tarmac.`,
        };
      }
      return {
        status: 'Excellent for cycling',
        statusColor: 'text-emerald-400',
        recommendation: 'Clear riding conditions with manageable wind resistance.',
        rationale: `Wind is ${windSpeed} km/h and road visibility is clear at ${visibility} km.`,
      };
    }

    case 'Outdoor work': {
      if (maxRainNext4 > 55) {
        return {
          status: 'Rain interrupts expected',
          statusColor: 'text-amber-400',
          recommendation: 'Plan indoor backup tasks or protect equipment from rain.',
          rationale: `Precipitation probability reaches ${maxRainNext4}%. Keep moisture-sensitive tools covered.`,
        };
      }
      if (temp > 32) {
        return {
          status: 'Heat precautions needed',
          statusColor: 'text-rose-400',
          recommendation: 'Schedule frequent hydration breaks in shade.',
          rationale: `High temperatures of ${temp}°C require heat-stress prevention.`,
        };
      }
      return {
        status: 'Suitable for outdoor work',
        statusColor: 'text-emerald-400',
        recommendation: 'Stable atmospheric conditions for maintenance and projects.',
        rationale: `Calm conditions: ${temp}°C, ${humidity}% humidity, wind at ${windSpeed} km/h.`,
      };
    }

    case 'Travel': {
      if (visibility < 4) {
        return {
          status: 'Low visibility alert',
          statusColor: 'text-amber-400',
          recommendation: 'Drive with caution and use low-beam headlights.',
          rationale: `Atmospheric visibility reduced to ${visibility} km due to fog or precipitation.`,
        };
      }
      if (avgWindNext4 > 35 || maxRainNext4 > 70) {
        return {
          status: 'Inclement travel conditions',
          statusColor: 'text-amber-400',
          recommendation: 'Allow extra transit time for traffic and spray.',
          rationale: `Active weather system with ${avgWindNext4} km/h winds and rain probability at ${maxRainNext4}%.`,
        };
      }
      return {
        status: 'Clear travel conditions',
        statusColor: 'text-emerald-400',
        recommendation: 'Smooth journey expected with unobstructed visibility.',
        rationale: `Visibility is good at ${visibility} km with dry roads and low wind.`,
      };
    }

    case 'Photography': {
      if (maxRainNext4 > 60) {
        return {
          status: 'Moody & dramatic skies',
          statusColor: 'text-sky-400',
          recommendation: 'Great for atmospheric reflections; protect camera equipment.',
          rationale: `Rain chance ${maxRainNext4}% with dynamic cloud contrast. Weather-sealing required.`,
        };
      }
      if (weather.current.condition === 'Clear') {
        return {
          status: 'Harsh midday contrast',
          statusColor: 'text-amber-400',
          recommendation: 'Best to shoot during golden hour around sunrise or sunset.',
          rationale: 'Direct unobstructed sunlight produces strong shadows; use polarizing filters.',
        };
      }
      return {
        status: 'Soft diffused natural light',
        statusColor: 'text-emerald-400',
        recommendation: 'Excellent lighting for portraits, street, and architecture.',
        rationale: `Overcast/partly cloudy conditions create natural diffusion with ${visibility} km visibility.`,
      };
    }

    default:
      return {
        status: 'Favorable conditions',
        statusColor: 'text-emerald-400',
        recommendation: 'Weather is suitable for general outdoor plans.',
        rationale: `Temperature is ${temp}°C with ${humidity}% humidity.`,
      };
  }
}

// Weather DNA — Compact visual summary of the day's weather personality
export function generateWeatherDNA(hourlyList, currentTemp) {
  if (!hourlyList || hourlyList.length === 0) {
    return [
      { phase: 'Morning', personality: 'Pleasant', temp: currentTemp, icon: cloudIcon },
      { phase: 'Afternoon', personality: 'Moderate', temp: currentTemp + 2, icon: clearIcon },
      { phase: 'Evening', personality: 'Cooling', temp: currentTemp - 1, icon: cloudIcon },
      { phase: 'Night', personality: 'Quiet & Calm', temp: currentTemp - 3, icon: clearIcon },
    ];
  }

  // Bucket hourly data into 4 daily segments
  // Morning: 06:00 - 11:59
  // Afternoon: 12:00 - 16:59
  // Evening: 17:00 - 20:59
  // Night: 21:00 - 05:59
  const buckets = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Night: [],
  };

  hourlyList.forEach((h) => {
    const hour = new Date(h.time).getHours();
    if (hour >= 6 && hour < 12) buckets.Morning.push(h);
    else if (hour >= 12 && hour < 17) buckets.Afternoon.push(h);
    else if (hour >= 17 && hour < 21) buckets.Evening.push(h);
    else buckets.Night.push(h);
  });

  const getPhasePersonality = (phaseName, items) => {
    if (!items || items.length === 0) {
      return {
        phase: phaseName,
        personality: 'Consistent',
        temp: currentTemp,
        icon: cloudIcon,
        pop: 0,
      };
    }

    const avgTemp = Math.round(items.reduce((acc, curr) => acc + curr.temp, 0) / items.length);
    const maxPop = Math.max(...items.map((i) => i.pop || 0));
    const avgWind = Math.round(items.reduce((acc, curr) => acc + (curr.windSpeed || 0), 0) / items.length);
    const repIconCode = items[Math.floor(items.length / 2)]?.iconCode || '01d';

    let personality = 'Pleasant';
    if (maxPop > 60) {
      personality = 'Rainy & Damp';
    } else if (maxPop > 30) {
      personality = 'Passing Showers';
    } else if (avgWind > 28) {
      personality = 'Breezy & Gusty';
    } else if (avgTemp > 30) {
      personality = 'Hot & Sunny';
    } else if (avgTemp > 24) {
      personality = 'Warm & Bright';
    } else if (avgTemp < 8) {
      personality = 'Chilly & Brisk';
    } else if (avgTemp < 15) {
      personality = 'Crisp & Fresh';
    } else {
      personality = phaseName === 'Evening' ? 'Cooling Down' : 'Comfortable & Calm';
    }

    return {
      phase: phaseName,
      personality,
      temp: avgTemp,
      icon: getWeatherAssetIcon(repIconCode),
      pop: maxPop,
      wind: avgWind,
    };
  };

  return [
    getPhasePersonality('Morning', buckets.Morning),
    getPhasePersonality('Afternoon', buckets.Afternoon),
    getPhasePersonality('Evening', buckets.Evening),
    getPhasePersonality('Night', buckets.Night),
  ];
}

// Weather Change Detector — Compares upcoming forecast against current weather
export function detectWeatherChanges(weather) {
  if (!weather || !weather.current || !weather.hourly || weather.hourly.length < 4) {
    return [];
  }

  const changes = [];
  const current = weather.current;
  const next12Hours = weather.hourly.slice(0, 12);

  // 1. Significant temperature drop or rise
  let minNextTemp = current.temp;
  let minHour = null;
  let maxNextTemp = current.temp;
  let maxHour = null;

  next12Hours.forEach((h) => {
    if (h.temp < minNextTemp) {
      minNextTemp = h.temp;
      minHour = h;
    }
    if (h.temp > maxNextTemp) {
      maxNextTemp = h.temp;
      maxHour = h;
    }
  });

  const drop = current.temp - minNextTemp;
  const rise = maxNextTemp - current.temp;

  if (drop >= 5 && minHour) {
    const timeLabel = formatHourTime(minHour.time);
    changes.push({
      type: 'temp-drop',
      title: 'Cooler Ahead',
      message: `Temperature drops ${drop}°C to ${minHour.temp}°C by ${timeLabel}.`,
      severity: 'info',
    });
  } else if (rise >= 5 && maxHour) {
    const timeLabel = formatHourTime(maxHour.time);
    changes.push({
      type: 'temp-rise',
      title: 'Warming Up',
      message: `Temperature increases ${rise}°C reaching ${maxHour.temp}°C around ${timeLabel}.`,
      severity: 'info',
    });
  }

  // 2. Rain incoming
  const firstSignificantRain = next12Hours.find((h) => (h.pop || 0) >= 40);
  if (firstSignificantRain) {
    const timeLabel = formatHourTime(firstSignificantRain.time);
    changes.push({
      type: 'rain-arrival',
      title: 'Rain Expected',
      message: `Precipitation probability reaches ${firstSignificantRain.pop}% around ${timeLabel}.`,
      severity: 'warning',
    });
  }

  // 3. Wind pickup
  const highWindHour = next12Hours.find((h) => (h.windSpeed || 0) >= current.windSpeed + 12 && (h.windSpeed || 0) >= 25);
  if (highWindHour) {
    const timeLabel = formatHourTime(highWindHour.time);
    changes.push({
      type: 'wind-increase',
      title: 'Wind Picking Up',
      message: `Wind expected to strengthen to ${highWindHour.windSpeed} km/h by ${timeLabel}.`,
      severity: 'warning',
    });
  }

  // 4. Humidity shift
  const humidShift = next12Hours.find((h) => Math.abs((h.humidity || 50) - current.humidity) >= 25);
  if (humidShift) {
    const direction = humidShift.humidity > current.humidity ? 'rising' : 'dropping';
    const timeLabel = formatHourTime(humidShift.time);
    changes.push({
      type: 'humidity-shift',
      title: 'Humidity Shift',
      message: `Humidity ${direction} significantly to ${humidShift.humidity}% near ${timeLabel}.`,
      severity: 'info',
    });
  }

  return changes;
}

// "Today's Weather Story" — Deterministic human-readable narrative
export function generateWeatherStory(weather) {
  if (!weather || !weather.current) {
    return 'Expect typical seasonal weather today with mild temperatures and gentle breezes.';
  }

  const { temp, condition, high, low, windSpeed } = weather.current;
  const hourly = weather.hourly || [];
  const maxRain = hourly.length > 0 ? Math.max(...hourly.map((h) => h.pop || 0)) : 0;

  const condLower = (condition || '').toLowerCase();
  let part1 = '';
  if (condLower.includes('clear') || condLower.includes('sun')) {
    part1 = `Clear, bright skies prevail with an afternoon high reaching ${high}°C.`;
  } else if (condLower.includes('cloud')) {
    part1 = `Filtered sunshine through patchy cloud cover with steady temperatures hovering around ${temp}°C.`;
  } else if (condLower.includes('rain') || condLower.includes('drizzle')) {
    part1 = `Active precipitation across the region with overcast skies keeping temperatures near ${temp}°C.`;
  } else if (condLower.includes('snow')) {
    part1 = `Winter conditions with freezing air and snowfall, holding daytime temperatures around ${temp}°C.`;
  } else {
    part1 = `${condition} conditions continue today, moving between ${low}°C overnight and ${high}°C during the afternoon peak.`;
  }

  let part2 = '';
  if (maxRain > 50) {
    part2 = ` Keep an umbrella on hand as rain chances rise to ${maxRain}% through the day.`;
  } else if (windSpeed > 25) {
    part2 = ` Brisk winds at ${windSpeed} km/h will make ambient air feel noticeably cooler in open areas.`;
  } else {
    part2 = ` Winds remain modest at ${windSpeed} km/h with settled conditions extending into tonight.`;
  }

  return `${part1}${part2}`;
}

// Calculate sun position percentage along its daylight arc (0% at sunrise, 50% at solar noon, 100% at sunset)
export function getSunProgress(sunriseStr, sunsetStr, timezoneOffsetSeconds = 0) {
  if (!sunriseStr || !sunsetStr) {
    return { progress: 50, isDaylight: true, timeUntilSunset: '', daylightDuration: '' };
  }

  const sunrise = new Date(sunriseStr).getTime();
  const sunset = new Date(sunsetStr).getTime();
  const now = Date.now();

  const totalDaylightMs = sunset - sunrise;
  if (totalDaylightMs <= 0) {
    return { progress: 50, isDaylight: true, timeUntilSunset: '', daylightDuration: '' };
  }

  const daylightHours = Math.floor(totalDaylightMs / 3600000);
  const daylightMinutes = Math.floor((totalDaylightMs % 3600000) / 60000);
  const daylightDuration = `${daylightHours}h ${daylightMinutes}m`;

  const isDaylight = now >= sunrise && now <= sunset;
  let progress = 0;
  let timeUntilSunset = '';

  if (now < sunrise) {
    progress = 0;
    const msToRise = sunrise - now;
    const hrs = Math.floor(msToRise / 3600000);
    const mins = Math.floor((msToRise % 3600000) / 60000);
    timeUntilSunset = `Sunrise in ${hrs}h ${mins}m`;
  } else if (now > sunset) {
    progress = 100;
    timeUntilSunset = 'Sun has set';
  } else {
    progress = Math.min(100, Math.max(0, Math.round(((now - sunrise) / totalDaylightMs) * 100)));
    const msToSet = sunset - now;
    const hrs = Math.floor(msToSet / 3600000);
    const mins = Math.floor((msToSet % 3600000) / 60000);
    timeUntilSunset = `${hrs}h ${mins}m daylight remaining`;
  }

  return {
    progress,
    isDaylight,
    timeUntilSunset,
    daylightDuration,
    sunriseTime: new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    sunsetTime: new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

// -------------------------------------------------------------------------
// BEST TIME TODAY (Activity Window Optimizer)
// -------------------------------------------------------------------------
export function calculateBestTimeToday(weather, activityId = 'Walking') {
  if (!weather || !weather.hourly || weather.hourly.length === 0) {
    return {
      windowLabel: 'Midday',
      score: 75,
      reasons: ['Seasonal conditions within normal parameters.'],
      disclaimer: 'Best available window based on current forecast.',
      hourlyTimeline: [],
    };
  }

  const hours = weather.hourly.slice(0, 18);
  const act = (activityId || 'Walking').toLowerCase();

  // Activity profile targets
  const targets = {
    walking: { idealMin: 15, idealMax: 22, maxWind: 28, maxPop: 25, preferDay: true },
    running: { idealMin: 10, idealMax: 18, maxWind: 22, maxPop: 20, preferDay: false },
    cycling: { idealMin: 14, idealMax: 22, maxWind: 20, maxPop: 15, preferDay: true },
    photography: { idealMin: 12, idealMax: 25, maxWind: 24, maxPop: 20, preferDay: true, goldenFocus: true },
    'outdoor work': { idealMin: 14, idealMax: 24, maxWind: 30, maxPop: 25, preferDay: true },
    travel: { idealMin: 12, idealMax: 26, maxWind: 35, maxPop: 35, preferDay: false },
    exercise: { idealMin: 12, idealMax: 20, maxWind: 24, maxPop: 20, preferDay: false },
  };

  const profile = targets[act] || targets.walking;

  // Score each individual hour (0-100)
  const scoredHours = hours.map((h, i) => {
    let score = 100;
    const temp = h.temp ?? 20;
    const pop = h.pop ?? 0;
    const wind = h.windSpeed ?? 10;
    const uv = h.uv ?? 0;
    const isDay = h.isDay !== false;

    // Temperature score
    if (temp < profile.idealMin) {
      score -= Math.min(35, (profile.idealMin - temp) * 4);
    } else if (temp > profile.idealMax) {
      score -= Math.min(35, (temp - profile.idealMax) * 4);
    }

    // Rain penalty
    if (pop > profile.maxPop) {
      score -= Math.min(50, (pop - profile.maxPop) * 0.8 + 15);
    }

    // Wind penalty
    if (wind > profile.maxWind) {
      score -= Math.min(30, (wind - profile.maxWind) * 1.5);
    }

    // UV penalty for intense midday sun during cardio
    if (uv >= 7 && (act === 'running' || act === 'exercise')) {
      score -= 15;
    }

    // Daylight preference
    if (profile.preferDay && !isDay) {
      score -= 20;
    }

    return {
      index: i,
      time: h.time,
      timeLabel: formatHourTime(h.time),
      temp,
      pop,
      wind,
      uv,
      isDay,
      score: Math.max(10, Math.min(99, Math.round(score))),
    };
  });

  // Find optimal 2-hour window (average of pair i and i+1)
  let bestWindowIdx = 0;
  let bestWindowScore = -1;

  for (let i = 0; i < scoredHours.length - 1; i++) {
    const pairScore = (scoredHours[i].score + scoredHours[i + 1].score) / 2;
    if (pairScore > bestWindowScore) {
      bestWindowScore = pairScore;
      bestWindowIdx = i;
    }
  }

  const startHour = scoredHours[bestWindowIdx] || scoredHours[0];
  const endHour = scoredHours[Math.min(scoredHours.length - 1, bestWindowIdx + 2)] || startHour;

  const windowLabel = `${startHour.timeLabel} – ${endHour.timeLabel}`;
  const finalScore = Math.round(bestWindowScore > 0 ? bestWindowScore : startHour.score);

  // Construct reasons based on actual factors
  const reasons = [];
  if (startHour.pop <= 15) {
    reasons.push(`Dry forecast with only ${startHour.pop}% chance of rain`);
  } else {
    reasons.push(`Precipitation risk remains manageable at ${startHour.pop}%`);
  }

  if (startHour.temp >= profile.idealMin - 2 && startHour.temp <= profile.idealMax + 2) {
    reasons.push(`Comfortable ambient temperature (${startHour.temp}°C)`);
  } else {
    reasons.push(`Temperature holds near ${startHour.temp}°C`);
  }

  if (startHour.wind <= profile.maxWind) {
    reasons.push(`Light breeze around ${startHour.wind} km/h with low resistance`);
  } else {
    reasons.push(`Wind speed stabilizes near ${startHour.wind} km/h`);
  }

  if (startHour.isDay) {
    reasons.push('Full natural daylight visibility');
  }

  return {
    activity: activityId,
    windowLabel,
    score: finalScore,
    reasons,
    disclaimer: 'Best available window based on current forecast.',
    hourlyTimeline: scoredHours.map((h, i) => ({
      ...h,
      isBestWindow: i >= bestWindowIdx && i <= bestWindowIdx + 1,
    })),
  };
}

// -------------------------------------------------------------------------
// PHOTOGRAPHY & ASTRONOMY (Golden Hour, Blue Hour, Moon Phase)
// -------------------------------------------------------------------------
export function calculateAstronomy(current, timezoneOffsetSeconds = 0) {
  const sunriseIso = current?.sunrise;
  const sunsetIso = current?.sunset;

  // Moon phase calculation using synodic lunar cycle
  const now = new Date();
  const refNewMoon = new Date('2024-01-11T11:57:00Z');
  const daysSinceRef = (now.getTime() - refNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53058867;
  const phaseValue = ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth / synodicMonth;
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * phaseValue)));

  let moonPhaseName = 'New Moon';
  let moonPhaseIcon = '🌑';

  if (phaseValue < 0.03 || phaseValue >= 0.97) {
    moonPhaseName = 'New Moon';
    moonPhaseIcon = '🌑';
  } else if (phaseValue < 0.22) {
    moonPhaseName = 'Waxing Crescent';
    moonPhaseIcon = '🌒';
  } else if (phaseValue < 0.28) {
    moonPhaseName = 'First Quarter';
    moonPhaseIcon = '🌓';
  } else if (phaseValue < 0.47) {
    moonPhaseName = 'Waxing Gibbous';
    moonPhaseIcon = '🌔';
  } else if (phaseValue < 0.53) {
    moonPhaseName = 'Full Moon';
    moonPhaseIcon = '🌕';
  } else if (phaseValue < 0.72) {
    moonPhaseName = 'Waning Gibbous';
    moonPhaseIcon = '🌖';
  } else if (phaseValue < 0.78) {
    moonPhaseName = 'Last Quarter';
    moonPhaseIcon = '🌗';
  } else {
    moonPhaseName = 'Waning Crescent';
    moonPhaseIcon = '🌘';
  }

  // Golden / Blue hours formatting
  let goldenHourMorning = '--:-- – --:--';
  let goldenHourEvening = '--:-- – --:--';
  let blueHourMorning = '--:-- – --:--';
  let blueHourEvening = '--:-- – --:--';
  let bestPhotographyWindow = 'Sunset Golden Hour';
  let photoConditionsNote = 'Clear illumination with directional light';

  if (sunriseIso && sunsetIso) {
    const sr = new Date(sunriseIso).getTime();
    const ss = new Date(sunsetIso).getTime();

    const fmt = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    // Morning
    blueHourMorning = `${fmt(sr - 40 * 60000)} – ${fmt(sr - 15 * 60000)}`;
    goldenHourMorning = `${fmt(sr - 15 * 60000)} – ${fmt(sr + 60 * 60000)}`;

    // Evening
    goldenHourEvening = `${fmt(ss - 60 * 60000)} – ${fmt(ss + 15 * 60000)}`;
    blueHourEvening = `${fmt(ss + 15 * 60000)} – ${fmt(ss + 40 * 60000)}`;

    bestPhotographyWindow = `Evening Golden Hour (${goldenHourEvening})`;

    const cond = (current.condition || '').toLowerCase();
    if (cond.includes('rain') || cond.includes('overcast')) {
      photoConditionsNote = 'High cloud diffusion creates soft, flattering ambient light with minimal harsh shadows.';
      bestPhotographyWindow = 'Midday Diffusion Window (11:00 AM – 2:00 PM)';
    } else if (cond.includes('clear')) {
      photoConditionsNote = 'Crisp, high-contrast golden sunlight ideal for landscape and architectural photography.';
    } else {
      photoConditionsNote = 'Warm directional light with dynamic cloud textures in the sky.';
    }
  }

  return {
    moonPhaseName,
    moonPhaseIcon,
    illumination,
    goldenHourMorning,
    goldenHourEvening,
    blueHourMorning,
    blueHourEvening,
    bestPhotographyWindow,
    photoConditionsNote,
  };
}

// -------------------------------------------------------------------------
// FORECAST CONFIDENCE INDICATOR
// -------------------------------------------------------------------------
export function calculateForecastConfidence(weather) {
  if (!weather || !weather.hourly || weather.hourly.length < 12) {
    return {
      level: 'MODERATE',
      score: 78,
      summary: 'Standard model confidence based on single-cycle meteorological run.',
      factors: ['Baseline atmospheric data available', 'Standard model alignment'],
    };
  }

  const next12 = weather.hourly.slice(0, 12);
  const pops = next12.map((h) => h.pop ?? 0);
  const winds = next12.map((h) => h.windSpeed ?? 10);

  // Measure precipitation stability (low standard deviation = higher confidence)
  const maxPop = Math.max(...pops);
  const minPop = Math.min(...pops);
  const popSpread = maxPop - minPop;

  // Measure wind gust stability
  const maxWind = Math.max(...winds);
  const minWind = Math.min(...winds);
  const windSpread = maxWind - minWind;

  let score = 92;
  const factors = [];

  if (popSpread <= 20) {
    factors.push('Precipitation probability shows strong temporal consistency (<20% variance).');
  } else {
    score -= 12;
    factors.push('Variable precipitation timeline suggests a passing convective front.');
  }

  if (windSpread <= 15) {
    factors.push('Atmospheric pressure gradient is steady with uniform wind vectors.');
  } else {
    score -= 10;
    factors.push('Wind speed fluctuations indicate localized thermal gusts.');
  }

  if (weather.source?.includes('Open-Meteo')) {
    factors.push('Multi-model high-resolution ensemble (ECMWF + GFS) harmonization.');
  }

  let level = 'HIGH';
  let summary = 'High confidence: Multiple forecast indicators show stable atmospheric agreement across the next 24 hours.';

  if (score < 75) {
    level = 'CAUTION';
    summary = 'Moderate-Low confidence: Rapidly changing boundary layer conditions; timings may shift ±1-2 hours.';
  } else if (score < 85) {
    level = 'MODERATE';
    summary = 'Moderate confidence: General atmospheric trajectory is clear with minor variability in localized precipitation timing.';
  }

  return {
    level,
    score: Math.max(60, Math.min(96, score)),
    summary,
    factors,
  };
}

// -------------------------------------------------------------------------
// SMART WEATHER EVENTS & TIMED ALERTS
// -------------------------------------------------------------------------
export function detectSmartWeatherEvents(weather, timezoneOffsetSeconds = 0) {
  if (!weather || !weather.current) return [];

  const { current, hourly = [] } = weather;
  const events = [];
  const next12 = hourly.slice(0, 12);

  // 1. Rain beginning soon with timing
  const isCurrentlyRaining = (current.condition || '').toLowerCase().includes('rain') || (current.condition || '').toLowerCase().includes('drizzle');

  if (!isCurrentlyRaining && next12.length > 0) {
    const rainHourIdx = next12.findIndex((h) => (h.pop ?? 0) >= 45);
    if (rainHourIdx !== -1) {
      const rainHour = next12[rainHourIdx];
      const timeStr = formatHourTime(rainHour.time, timezoneOffsetSeconds);
      const estMinutes = Math.max(15, rainHourIdx * 60);
      events.push({
        id: 'rain-start',
        type: 'rain',
        severity: 'advisory',
        title: `Rain Likely around ${timeStr}`,
        timing: rainHourIdx === 0 ? 'Within ~45 minutes' : `In ~${Math.round(estMinutes / 60)} hours`,
        description: `Precipitation probability climbs to ${rainHour.pop}% with rain showers anticipated.`,
      });
    }
  }

  // 2. Rain clearing / dry window beginning
  if (isCurrentlyRaining && next12.length > 0) {
    const clearHourIdx = next12.findIndex((h) => (h.pop ?? 0) <= 20);
    if (clearHourIdx !== -1) {
      const clearHour = next12[clearHourIdx];
      const timeStr = formatHourTime(clearHour.time, timezoneOffsetSeconds);
      events.push({
        id: 'rain-clear',
        type: 'clear',
        severity: 'opportunity',
        title: `Precipitation Clearing by ${timeStr}`,
        timing: `In ~${clearHourIdx + 1} hours`,
        description: `Rain activity subsides with dry conditions prevailing for the subsequent period.`,
      });
    }
  }

  // 3. Rapid temperature drop or rise (>= 4°C in 3 hours)
  for (let i = 0; i < Math.min(next12.length - 3, 6); i++) {
    const delta = next12[i + 3].temp - next12[i].temp;
    if (delta <= -4) {
      const t1 = formatHourTime(next12[i].time, timezoneOffsetSeconds);
      const t2 = formatHourTime(next12[i + 3].time, timezoneOffsetSeconds);
      events.push({
        id: `temp-drop-${i}`,
        type: 'temp-drop',
        severity: 'notice',
        title: `Sharp Temperature Drop (${delta}°C)`,
        timing: `Between ${t1} and ${t2}`,
        description: `A cooler air mass moves in, dropping temperatures from ${next12[i].temp}°C to ${next12[i + 3].temp}°C.`,
      });
      break;
    }
  }

  // 4. Peak UV timing
  const peakUvHour = next12.reduce((max, h) => ((h.uv ?? 0) > (max?.uv ?? 0) ? h : max), null);
  if (peakUvHour && (peakUvHour.uv ?? 0) >= 6) {
    const uvTime = formatHourTime(peakUvHour.time, timezoneOffsetSeconds);
    events.push({
      id: 'uv-peak',
      type: 'uv',
      severity: 'warning',
      title: `High UV Radiation Peak (Index ${peakUvHour.uv})`,
      timing: `Around ${uvTime}`,
      description: `Solar radiation reaches high intensity. Sunscreen and eye protection strongly recommended outdoors.`,
    });
  }

  // 5. Sustained wind spike
  const peakWindHour = next12.reduce((max, h) => ((h.windSpeed ?? 0) > (max?.windSpeed ?? 0) ? h : max), null);
  if (peakWindHour && peakWindHour.windSpeed >= 38) {
    const windTime = formatHourTime(peakWindHour.time, timezoneOffsetSeconds);
    events.push({
      id: 'wind-spike',
      type: 'wind',
      severity: 'advisory',
      title: `Brisk Wind Peak (${peakWindHour.windSpeed} km/h)`,
      timing: `Arriving around ${windTime}`,
      description: `Gusts will make ambient air feel substantially cooler and may impact outdoor activities.`,
    });
  }

  // 6. Freezing temperature advisory
  if (current.temp <= 0 || next12.some((h) => h.temp <= 0)) {
    events.push({
      id: 'freeze-alert',
      type: 'freeze',
      severity: 'warning',
      title: 'Freezing Hazard Expected',
      timing: 'Current / Overnight',
      description: `Sub-zero conditions present. Watch for black ice on roadways and protect exposed infrastructure.`,
    });
  }

  return events;
}

// -------------------------------------------------------------------------
// PERSONAL WEATHER DNA COMPATIBILITY
// -------------------------------------------------------------------------
export function calculatePersonalCompatibility(weather, profile) {
  if (!weather || !weather.current) {
    return {
      score: 80,
      matchGrade: 'Good Match',
      rationale: 'Favorable baseline weather.',
      breakdown: [
        'Baseline comfortable atmospheric pressure and conditions',
        'Temperature aligned with typical comfort standards',
        'Gentle wind flow within pleasant activity envelope'
      ]
    };
  }

  const { temp, windSpeed, humidity } = weather.current;
  const hourly = weather.hourly || [];
  const maxRain = hourly.length > 0 ? Math.max(...hourly.slice(0, 12).map((h) => h.pop || 0)) : 0;

  const minIdeal = profile?.idealMin ?? 18;
  const maxIdeal = profile?.idealMax ?? 24;
  const rainTolerance = profile?.rainTolerance ?? 'low'; // 'zero', 'low', 'high'
  const windTolerance = profile?.windTolerance ?? 'moderate'; // 'calm', 'moderate', 'high'

  let score = 100;
  const breakdown = [];

  // 1. Temperature score (40 pts)
  if (temp >= minIdeal && temp <= maxIdeal) {
    breakdown.push(`Temperature (${temp}°C) is directly in your ideal ${minIdeal}–${maxIdeal}°C zone (+40 pts)`);
  } else {
    const diff = temp < minIdeal ? minIdeal - temp : temp - maxIdeal;
    const penalty = Math.min(30, diff * 4);
    score -= penalty;
    breakdown.push(`Temperature (${temp}°C) deviates from your ideal ${minIdeal}–${maxIdeal}°C range (-${Math.round(penalty)} pts)`);
  }

  // 2. Rain score (30 pts)
  if (maxRain <= 10) {
    breakdown.push(`Dry skies (${maxRain}% rain risk) suit your activity plans (+30 pts)`);
  } else if (rainTolerance === 'zero' && maxRain > 20) {
    score -= 28;
    breakdown.push(`Rain probability (${maxRain}%) exceeds your zero-rain preference (-28 pts)`);
  } else if (rainTolerance === 'low' && maxRain > 40) {
    score -= 20;
    breakdown.push(`Rain probability (${maxRain}%) is higher than preferred (-20 pts)`);
  } else {
    score -= 8;
    breakdown.push(`Moderate precipitation probability (${maxRain}%) within tolerance (-8 pts)`);
  }

  // 3. Wind score (20 pts)
  if (windTolerance === 'calm' && windSpeed > 18) {
    score -= 15;
    breakdown.push(`Wind speed (${windSpeed} km/h) is brisker than your calm preference (-15 pts)`);
  } else if (windSpeed <= 25) {
    breakdown.push(`Wind speed (${windSpeed} km/h) is comfortably gentle (+20 pts)`);
  } else {
    score -= 10;
    breakdown.push(`Wind speed (${windSpeed} km/h) is moderately gusty (-10 pts)`);
  }

  // 4. Humidity balance (10 pts)
  if (humidity >= 40 && humidity <= 65) {
    breakdown.push(`Humidity (${humidity}%) is well-balanced (+10 pts)`);
  } else {
    score -= 5;
    breakdown.push(`Humidity is slightly elevated at ${humidity}% (-5 pts)`);
  }

  const finalScore = Math.max(25, Math.min(99, Math.round(score)));
  let matchGrade = 'Excellent Match';
  if (finalScore < 60) matchGrade = 'Challenging Conditions';
  else if (finalScore < 75) matchGrade = 'Fair Match';
  else if (finalScore < 88) matchGrade = 'Good Match';

  return {
    score: finalScore,
    matchGrade,
    breakdown,
  };
}
