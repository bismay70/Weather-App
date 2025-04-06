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

  loading.style.display = "block";
  weatherDisplay.style.display = "none";

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    const flagUrl = `https://flagsapi.com/${data.sys.country}/flat/32.png`;
    const iconCode = data.weather[0].icon;
    const condition = data.weather[0].main.toLowerCase();
    const localTime = new Date((data.dt + data.timezone) * 1000).getUTCHours();
    const isNight = localTime < 6 || localTime >= 18;

   
    updateBackground(condition, isNight);

    locationInfo.innerHTML = `<img src="${flagUrl}" class="flag" /> ${data.name}, ${data.sys.country}`;
    iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    tempText.textContent = `${data.main.temp.toFixed(1)}°C`;
    conditionText.innerHTML = `☁ Condition: <span>${data.weather[0].description}</span>`;
    humidityText.innerHTML = `💧 Humidity: <span>${data.main.humidity}%</span>`;

    weatherDisplay.style.display = "block";
    document.querySelector(".weather-card").style.background = "rgba(255, 255, 255, 0.12)";
  } catch (err) {
    alert("Error: " + err.message);
    resetToDefaultBackground();
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

  document.body.style.backgroundImage = `url(${bgPath})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
}

function resetToDefaultBackground() {
  const body = document.body;
  body.style.backgroundImage = "none";
  body.style.background = "linear-gradient(to right, rgb(125, 81, 112), rgb(70, 14, 71))";
  console.log("✅ Reset to default background");
}

window.onload = () => {
  resetToDefaultBackground();
};
