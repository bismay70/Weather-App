const apiKey = "adb12e4b79200cb95b6f85c3a75eb890";
let searchHistory = JSON.parse(localStorage.getItem('weatherAppHistory')) || [];

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const weatherDisplay = document.getElementById("weatherDisplay");
const historySection = document.getElementById('historySection');

// --- Main App Logic ---

async function fetchWeather(cityQuery = null) {
  const city = cityQuery || cityInput.value;
  if (!city) {
    alert("Please enter a valid city name");
    return;
  }

  // UI State: Loading
  loading.style.display = "block";
  weatherDisplay.style.opacity = "0.5";

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();

    if (forecastData.cod !== "200") throw new Error(forecastData.message);

    // Success: Update UI
    updateCurrentWeather(data);
    updateForecast(forecastData);
    updateBackground(data.weather[0].main, data.dt, data.timezone);
    
    saveHistory(data.name);
    localStorage.setItem('lastCity', data.name);

    weatherDisplay.style.opacity = "1";
    weatherDisplay.style.display = "flex";
  } catch (err) {
    alert("Error: " + err.message);
    resetToDefaultBackground();
  } finally {
    loading.style.display = "none";
  }
}

function updateCurrentWeather(data) {
  // Flag & Name
  const flagUrl = `https://flagsapi.com/${data.sys.country}/flat/32.png`;
  document.getElementById("locationName").innerHTML = `<img src="${flagUrl}" class="flag" style="width:24px; vertical-align:middle; margin-right:8px;"/> ${data.name}`;

  // Time & Date (shifted by timezone)
  updateClock(data.timezone);
  
  // Main Temperature Area
  document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°`;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("condition").textContent = data.weather[0].description;
  
  // Details
  document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°`;
  document.getElementById("maxTemp").textContent = `${Math.round(data.main.temp_max)}°`;
  document.getElementById("minTemp").textContent = `${Math.round(data.main.temp_min)}°`;
  
  // Grid Stats
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
  document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
  document.getElementById("visibility").textContent = `${(data.visibility / 1000).toFixed(1)} km`;
}

function updateForecast(forecastData) {
  const forecastGrid = document.getElementById("forecastGrid");
  forecastGrid.innerHTML = "";

  // Filter for one reading per day (noonish)
  const dailyData = {};
  forecastData.list.forEach(reading => {
      const date = new Date(reading.dt * 1000).toLocaleDateString();
      // Try to get 12:00 PM reading, or default to the first one available for that day
      if (!dailyData[date] || reading.dt_txt.includes("12:00:00")) {
          dailyData[date] = reading;
      }
  });

  const days = Object.values(dailyData).slice(0, 5); // 5 Days

  days.forEach(day => {
    const dateObj = new Date(day.dt * 1000);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const iconCode = day.weather[0].icon;
    const temp = Math.round(day.main.temp);
    const rain = day.pop ? Math.round(day.pop * 100) : 0;

    const el = document.createElement('div');
    el.className = 'forecast-item';
    el.innerHTML = `
      <span class="f-day">${dayName}</span>
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" class="f-icon"/>
      <span class="f-temp">${temp}°</span>
      <span class="f-rain">💧 ${rain}%</span>
    `;
    forecastGrid.appendChild(el);
  });
}

// Background Manager
function updateBackground(condition, dt, timezone) {
  const localTime = new Date((dt + timezone) * 1000).getUTCHours(); 
  const isNight = localTime < 6 || localTime >= 18;
  
  let bgSuffix = "sunny";
  const condLower = condition.toLowerCase();
  
  if (condLower.includes("cloud")) bgSuffix = "cloudy";
  else if (condLower.includes("rain") || condLower.includes("drizzle")) bgSuffix = "rainy";
  else if (condLower.includes("snow")) bgSuffix = "winter";
  else if (condLower.includes("thunder")) bgSuffix = "rainy"; // Fallback for thunder
  
  // Map to existing files: Mcloudy.jpg, Ncloudy.jpg, etc.
  const prefix = isNight ? "N" : "M";
  const fileName = `${prefix}${bgSuffix}.jpg`;
  
  // Use overlay div
  const overlay = document.querySelector('.background-overlay');
  overlay.style.backgroundImage = `url('images/${fileName}')`;
}

function resetToDefaultBackground() {
    const overlay = document.querySelector('.background-overlay');
    overlay.style.backgroundImage = `none`; 
    overlay.style.backgroundColor = '#0f0f0f';
}

// Clock Logic
let clockInterval;
function updateClock(timezoneOffsetSeconds) {
    if (clockInterval) clearInterval(clockInterval);

    const update = () => {
        const now = new Date();
        // Convert local time to UTC, then add target offset
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const targetTime = new Date(utc + (timezoneOffsetSeconds * 1000));
        
        const hours = targetTime.getHours().toString().padStart(2, '0');
        const minutes = targetTime.getMinutes().toString().padStart(2, '0');
        
        // Date formatting
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const dateStr = targetTime.toLocaleDateString('en-US', options);

        document.getElementById("currentClock").textContent = `${hours}:${minutes}`;
        document.getElementById("currentDate").textContent = dateStr;
    };
    
    update();
    clockInterval = setInterval(update, 1000);
}

// History Logic
function saveHistory(city) {
  // Normalize casing for uniqueness check
  const lowerCity = city.toLowerCase();
  searchHistory = searchHistory.filter(item => item.toLowerCase() !== lowerCity);
  
  searchHistory.unshift(city);
  if (searchHistory.length > 8) searchHistory.pop(); // Max 8 pills
  
  localStorage.setItem('weatherAppHistory', JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  historySection.innerHTML = "";
  if (searchHistory.length === 0) {
      historySection.style.display = 'none';
      return;
  }
  historySection.style.display = 'flex';

  searchHistory.forEach(city => {
      const pill = document.createElement('div');
      pill.className = 'history-pill';
      pill.textContent = city;
      pill.onclick = () => {
          cityInput.value = city;
          fetchWeather(city);
      };
      historySection.appendChild(pill);
  });
}

// Init
window.onload = () => {
  resetToDefaultBackground();
  renderHistory();
  
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    cityInput.value = lastCity;
    fetchWeather(lastCity);
  } else {
    // Default if nothing loaded
    document.getElementById("locationName").innerHTML = "Welcome";
    document.getElementById("currentClock").innerHTML = "--:--";
  }
  
  // Enter key support
  cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchWeather();
    }
  });
};