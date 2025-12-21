# मौसम • Weather App 🔆

A simple, responsive weather web app that fetches current weather and a 5-day forecast for any city using the OpenWeatherMap API. Designed as a lightweight static project built with **HTML**, **CSS**, and **vanilla JavaScript**.

---

## 🔍 Overview

This project demonstrates a clean UI for displaying:
- Current weather (temperature, condition, humidity, wind, pressure, visibility)
- A 5-day forecast as compact cards
- Dynamic background images and a country flag for the selected city
- Basic input validation and loading/error states

> Note: The app is implemented as a static frontend and uses the browser `fetch` API to call OpenWeatherMap directly.

## 📸 Screenshots

<img src=./weather.png width="1000px"/>

---

## 💡 Tech Stack & Analysis

- **HTML5** — semantic layout and accessibility-friendly structure
- **CSS3** — responsive layout and custom visual styling
- **JavaScript (ES6)** — features implemented with modern syntax (async/await, DOM APIs)
- **OpenWeatherMap API** — provides current conditions and 5-day forecast data
- **FlagsAPI** — small utility to show country flag icons for found cities
- **Google Fonts** — typographic choices for a polished look

Why this stack?
- Small, dependency-free stack keeps the project easy to host as a static site (GitHub Pages, Netlify, Vercel).
- Using the browser `fetch` makes the app simple to read and maintain.

Suggestions for improvement:
- Move API calls to a small server or use environment variables to hide the API key (do not commit keys to public repos).
- Add unit toggle (°C / °F) and geolocation-based default city.
- Add caching (localStorage) or debounce input to optimize API usage.

---

## ✅ Features

- Search for a city and retrieve current weather
- 5-day forecast (displayed as daily cards)
- Dynamic background image that changes based on weather condition and day/night
- Loading indicator and error alerts for invalid input / API errors
- Uses flags to display country of the city

---

## 🚀 Quick Start — Clone & Run

1. Clone the repo:

```bash
git clone https://github.com/bismay70/Weather-App.git
cd "wreather app"
```

2. Open locally (any of the following):
- Open `index.html` directly in your browser (works for simple usage)
- OR start a simple local server (recommended):
  - Python 3: `python -m http.server 5500`
  - Node (serve): `npx serve .`
  - VS Code: use the **Live Server** extension and click "Go Live"

3. Visit `http://localhost:5500` (or the port your server shows) and use the search box to get weather for a city.

---

## 🔧 Setup / API Key

The app currently reads the API key from `script.js` (variable `apiKey`). To use your own key:

1. Sign up at https://openweathermap.org/ and get an API key.
2. Open `script.js` and replace the `apiKey` value with your key:

```js
const apiKey = "YOUR_API_KEY_HERE";
```

Security note: Avoid committing secret API keys to public repositories. For production, proxy the API calls through a small server or use environment variables on the host (Netlify functions, Vercel serverless functions, etc.).

---

## 📁 Project Structure

```
wreather app/
├─ index.html        # main entry
├─ style.css         # styling & responsive rules
├─ script.js         # main JS (fetch + UI update + backgrounds)
├─ images/           # background images used by the app
└─ README.md         # this file
```

---

## ⚠️ Troubleshooting

- "City not found": Check spelling or try a larger city (OpenWeatherMap response). The app alerts the user with the API message.
- CORS or network errors: If running from `file://` causes issues, use a local server as described above.
- Rate limits: OpenWeatherMap enforces rate limits on free accounts — avoid excessive rapid requests.

---

## 🙌 Contributing

Contributions are welcome! Consider:
- Adding unit toggle (Celsius/Fahrenheit)
- Using browser geolocation as a default
- Hiding the API key behind a small backend

Please open a PR and describe the change.

---

## 📝 License & Credits

- Built by Bismay Samal
- This project is provided as-is. Add an open-source license (e.g., MIT) if you want to allow reuse.

---

