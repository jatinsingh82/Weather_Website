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
