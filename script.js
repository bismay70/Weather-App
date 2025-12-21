 const apiKey = "adb12e4b79200cb95b6f85c3a75eb890";

    async function fetchWeather() {
      const city = document.getElementById("cityInput").value;
      if (!city) {
        return alert("Please enter a valid city name");
      }

      const loading = document.getElementById("loading");
      const weatherDisplay = document.getElementById("weatherDisplay");
      const locationInfo = document.getElementById("locationInfo");
      const iconImg = document.getElementById("weatherIcon");
      const tempText = document.getElementById("temp");
      const conditionText = document.getElementById("condition");
      const humidityText = document.getElementById("humidity");
      const windSpeedText = document.getElementById("windSpeed");
      const pressureText = document.getElementById("pressure");
      const visibilityText = document.getElementById("visibility");

      document.body.classList.add('loading-state');
      loading.style.display = "block";
      weatherDisplay.style.display = "none";

      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();

        if (data.cod !== 200) throw new Error(data.message);

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();

        if (forecastData.cod !== "200") throw new Error(forecastData.message);

        const flagUrl = `https://flagsapi.com/${data.sys.country}/flat/32.png`;
        const iconCode = data.weather[0].icon;
        const condition = data.weather[0].main.toLowerCase();
        const localTime = new Date((data.dt + data.timezone) * 1000).getUTCHours();
        const isNight = localTime < 6 || localTime >= 18;

        updateBackground(condition, isNight);

        locationInfo.innerHTML = `<img src="${flagUrl}" class="flag" /> ${data.name}, ${data.sys.country}`;
        iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        tempText.textContent = `${data.main.temp.toFixed(1)}°C`;
        conditionText.textContent = data.weather[0].description;
        humidityText.textContent = `${data.main.humidity}%`;
        windSpeedText.textContent = `${data.wind.speed} m/s`;
        pressureText.textContent = `${data.main.pressure} hPa`;
        visibilityText.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

        displayForecast(forecastData);

        document.body.classList.remove('loading-state');
        weatherDisplay.style.display = "block";
      } catch (err) {
        alert("Error: " + err.message);
        resetToDefaultBackground();
        document.body.classList.remove('loading-state');
      } finally {
        loading.style.display = "none";
      }
    }

    function updateBackground(condition, isNight) {
      let bgSuffix = "sunny";
      if (condition.includes("cloud")) bgSuffix = "cloudy";
      else if (condition.includes("rain")) bgSuffix = "rainy";
      else if (condition.includes("snow")) bgSuffix = "winter";

      const bgFileName = `${isNight ? "N" : "M"}${bgSuffix}.jpg`;
      const bgPath = `images/${bgFileName}`;
      
      document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgPath})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
    }

    function resetToDefaultBackground() {
      document.body.style.backgroundImage = "none";
      document.body.style.background = "linear-gradient(135deg, #1a0000 0%, #330000 50%, #000000 100%)";
    }

    function displayForecast(forecastData) {
      const forecastGrid = document.getElementById("forecastGrid");
      forecastGrid.innerHTML = "";

      const dailyForecasts = {};
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = item;
        }
      });

      const days = Object.values(dailyForecasts).slice(0, 5);
      
      days.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const iconCode = day.weather[0].icon;
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
          <div class="forecast-day">${dayName}</div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 10px;">${fullDate}</div>
          <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" class="forecast-icon" alt="weather icon"/>
          <div class="forecast-temp">${day.main.temp.toFixed(1)}°C</div>
          <div class="forecast-desc">${day.weather[0].description}</div>
          <div style="font-size: 0.9rem; margin-top: 8px; opacity: 0.8;">💧 ${day.main.humidity}%</div>
        `;
        forecastGrid.appendChild(card);
      });
    }

    window.onload = () => {
      resetToDefaultBackground();
    };