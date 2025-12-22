# Clock & Weather Widget

A modern Angular application that displays a **pixel-accurate analogue clock** with **real-time weather information**.

This project focuses on **visual accuracy**, **clean Angular architecture**, and **robust UI behavior** (smooth animations, precise alignment, and error handling).

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

## ✨ Features

### Analogue Clock

- Accurate analogue clock face matching the provided design
- Smooth, continuous movement
- Precisely aligned hands using **grid-based rotation layers**
- Real-time synchronization with system clock

### Weather Integration

- Fetches live weather data using **OpenWeather API (free tier)**
- Displays:
  - Current temperature (°C)
  - Weather condition icon
- Uses OpenWeather official icon set
- Clean API integration via Angular service

### Technical Highlights

- Built with **Angular 21 (standalone architecture)**
- No SSR (browser-only for deterministic real-time UI)
- Functional HTTP interceptor (`HttpInterceptorFn`)
- SCSS with design tokens and reusable patterns
- Clean separation of concerns:
  - UI → Component
  - Data → Service
  - Cross-cutting concerns → Interceptor

## 🛠️ Tech Stack

- **Framework:** Angular 21
- **Language:** TypeScript
- **Styling:** SCSS
- **API:** OpenWeather Current Weather API

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18
- **Angular CLI** ≥ 17

Check versions:

```bash
node -v
ng version
```

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/harshit-chouhan-04/clock-and-weather-widget.git
cd clock-and-weather-widget
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure OpenWeather API Key

- Sign up at: [https://openweathermap.org/api](https://openweathermap.org/api)
- Obtain a Current Weather Data API key
- Update the environment file:

```
export const environment = {
  production: false,
  openWeather: {
    apiKey: 'YOUR_API_KEY_HERE',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  },
  encryptionKey: 'YOUR_ENCRYPTION_KEY_HERE',
  enableEncryption: true,
};
```

### 5️⃣ Run the Application

```
npm run start
```

Open your browser at:

```
http://localhost:4200
```

### 🌦️ Weather Behavior

Weather is fetched once on application load

Default location is set in the component (can be replaced with browser geolocation)

No aggressive polling is used, as real-time updates are unnecessary for a clock widget
