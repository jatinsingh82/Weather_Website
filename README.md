# Weather Intelligence Platform 🌦️

> A modern, responsive weather intelligence platform that transforms real-time weather data into useful forecasts, environmental insights, location comparisons, and actionable recommendations.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

**[🌐 Live Demo](https://weather-website-ten-phi.vercel.app/)** · **[📂 GitHub Repository](https://github.com/jatinsingh82/Weather_Website)**

---

## Overview

Weather Intelligence Platform is a React-based weather application designed to go beyond simply displaying temperature and weather conditions.

It combines current weather, forecasts, air quality, weather alerts, radar visualization, saved locations, location comparison, comfort analysis, activity recommendations, and personalized weather insights into one responsive experience.

The goal is simple:

> **Turn weather data into information people can actually use.**

Instead of only answering:

**"What's the temperature?"**

the application aims to answer:

**"What is happening, what is coming, and what should I do?"**

---

## ✨ Features

### 🌡️ Real-Time Weather

* Current temperature
* Feels-like temperature
* Weather condition
* Humidity
* Wind speed and direction
* Atmospheric pressure
* Cloud coverage
* Precipitation
* High and low temperatures
* Dynamic weather visuals

### 📍 Location Intelligence

* Location search
* Search suggestions
* Browser geolocation
* Current-location detection
* Reverse geocoding
* Saved locations
* Quick location switching

### ⏱️ Hourly Forecast

View upcoming weather conditions throughout the day, including:

* Temperature
* Feels-like temperature
* Precipitation probability
* Precipitation
* Wind
* Humidity
* Visibility
* UV index
* Weather conditions

### 📅 Daily Forecast

Multi-day weather forecasting with:

* Daily high and low temperatures
* Weather conditions
* Precipitation
* Precipitation probability
* Wind
* UV information
* Sunrise and sunset

### 🧠 Weather Intelligence

Transform raw weather data into useful contextual information through:

* Weather summaries
* Condition analysis
* Temperature trends
* Forecast insights
* Contextual recommendations

### 🏃 Activity Advisor

Weather-aware recommendations for outdoor activities.

The application evaluates available conditions to help users understand whether the weather is suitable for outdoor plans.

### 💯 Comfort Score

A dedicated score that combines multiple environmental conditions into an easier-to-understand representation of overall comfort.

### 🧬 Weather DNA

A personalized weather experience designed around weather preferences and how current conditions relate to the user's preferred environment.

### 🌬️ Sun & Air

Environmental information including:

* Sunrise
* Sunset
* Daylight
* UV index
* Air quality
* PM2.5
* PM10
* Carbon monoxide
* Nitrogen dioxide
* Ozone

### 🚨 Weather Alerts

Important weather conditions are highlighted separately so users can quickly identify potentially significant events.

### 🌧️ Rain Radar

Interactive precipitation/radar visualization for exploring weather around a selected location.

### 🌍 Compare Locations

Compare weather conditions between multiple locations.

Useful for deciding between cities, destinations, or travel locations.

### 📌 Saved Locations

Save frequently viewed locations and quickly switch between them.

Saved preferences are stored locally in the browser.

### 📸 Weather Snapshot

Create a focused snapshot of the current weather information.

### 🌓 Dark & Light Mode

Switch between dark and light themes with persistent preferences.

### 🌡️ Metric & Imperial Units

Switch between metric and imperial measurement systems.

### ⌨️ Keyboard Support

Keyboard-friendly interactions for improved navigation and usability.

### 📱 Responsive Design

Designed for:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 🏗️ Architecture

The application follows a modular React component architecture.

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      React UI       │
                         │                     │
                         │  Weather Dashboard │
                         │  Forecasts          │
                         │  Radar              │
                         │  Insights           │
                         │  Alerts             │
                         │  Comparison         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Weather Service    │
                         │                     │
                         │  API Requests       │
                         │  Geocoding          │
                         │  Data Processing    │
                         │  Caching            │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                ┌─────────────────┐   ┌─────────────────┐
                │   Open-Meteo    │   │  OpenWeather    │
                │      APIs       │   │      API        │
                └─────────────────┘   └─────────────────┘
```

---

# 🛠️ Tech Stack

### Frontend

* React 18
* JavaScript
* HTML5
* CSS3
* React Hooks

### UI

* Lucide React

### Weather & Location Data

* Open-Meteo
* Open-Meteo Geocoding
* OpenWeather API support
* Reverse geocoding services

### Testing

* Jest
* React Testing Library

### Build & Deployment

* Create React App
* React Scripts
* Bun
* npm
* Vercel
* GitHub

---

# 📂 Project Structure

```text
Weather_Website/
│
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   │
│   ├── Components/
│   │   ├── ActivityAdvisor/
│   │   ├── ComfortScore/
│   │   ├── CompareLocations/
│   │   ├── DailyForecast/
│   │   ├── HeroWeather/
│   │   ├── HourlyForecast/
│   │   ├── Navbar/
│   │   ├── RainRadar/
│   │   ├── SavedLocationsModal/
│   │   ├── SnapshotModal/
│   │   ├── SunAndAir/
│   │   ├── WeatherAlerts/
│   │   ├── WeatherApp/
│   │   ├── WeatherBackground/
│   │   ├── WeatherDNA/
│   │   └── WeatherIntelligence/
│   │
│   ├── services/
│   │   └── weatherService.js
│   │
│   ├── App.js
│   ├── App.css
│   └── index.js
│
├── .env.example
├── package.json
└── README.md
```

---

# 🔄 Weather Data

The application uses weather APIs to retrieve and process meteorological information.

The weather service supports Open-Meteo and OpenWeather-based data sources depending on the functionality and available configuration.

The application also uses caching to reduce unnecessary repeated requests.

---

# 🔐 Environment Variables

If your configuration requires an OpenWeather API key, create a `.env` file:

```env
REACT_APP_API_KEY=your_api_key_here
```

### Important

Never commit your real API key to GitHub.

For Vercel deployment, add environment variables through:

**Vercel → Project → Settings → Environment Variables**

A `.env.example` file should contain only variable names/placeholders and never real credentials.

---

# 🚀 Installation

## Clone the repository

```bash
git clone https://github.com/jatinsingh82/Weather_Website.git
```

## Enter the project

```bash
cd Weather_Website
```

## Install dependencies

Using Bun:

```bash
bun install
```

Or npm:

```bash
npm install
```

## Start development server

```bash
bun start
```

or:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

---

# 🏭 Production Build

Create a production build with:

```bash
bun run build
```

The generated production files will be placed inside:

```text
build/
```

The production build should complete successfully before deployment.

---

# ☁️ Deployment

The application can be deployed through Vercel.

Recommended flow:

```text
GitHub
   ↓
Vercel
   ↓
Install Dependencies
   ↓
Production Build
   ↓
Live Website
```

Configure any required environment variables inside the Vercel project settings.

---

# 🧪 Testing

Run the project's test suite with:

```bash
npm test
```

Testing is supported through:

* Jest
* React Testing Library

---

# 🎯 Product Philosophy

Traditional weather applications often provide large amounts of data without explaining what that data means.

This project focuses on turning weather information into useful context.

Instead of only showing:

```text
28°C
72% Humidity
15 km/h Wind
```

the application aims to help answer:

```text
How does it feel?

Is it comfortable?

Should I go outside?

What will happen next?

Is there anything important I should know?
```

The result is a weather experience focused on **understanding conditions**, not simply reading numbers.

---

# 🔮 Future Improvements

Potential future improvements include:

* Historical weather trends
* Advanced weather-map layers
* Forecast confidence visualization
* More detailed weather timelines
* Enhanced personalization
* Offline/PWA improvements
* Weather notifications
* Advanced data visualization

---

# 📸 Screenshots

Screenshots can be added here to showcase the application.

Recommended sections:

### Dashboard

Main weather overview and current conditions.

### Forecast

Hourly and daily forecasting experience.

### Weather Intelligence

Insights, recommendations, and environmental information.

### Radar

Interactive weather/rain radar.

### Mobile

Responsive mobile experience.

---

# 👨‍💻 Author

**Jatin Singh**

Computer Science Engineering Graduate
MBA (IT) — Business Analytics

---

## ⭐ Support

If you find this project interesting, consider giving the repository a star on GitHub.

[⭐ Star the repository](https://github.com/jatinsingh82/Weather_Website)
