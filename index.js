// 🔹 API Key and Base URL
const apiKey = "d248f0383d91654dde2b92b4e4449757";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// 🔹 DOM elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const errorDiv = document.querySelector(".error");
const effectsContainer = document.getElementById("weather-effects");
const cloudContainer = document.getElementById("cloud-effects");

// 🔹 Render weather UI
function renderWeather(data) {
  const mainWeather = data.weather[0].main;

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";

  // Weather icon logic
  if (mainWeather === "Clouds") weatherIcon.src = "./images/clouds.png";
  else if (mainWeather === "Clear") weatherIcon.src = "./images/clear.png";
  else if (mainWeather === "Rain") weatherIcon.src = "./images/rain.png";
  else if (mainWeather === "Drizzle") weatherIcon.src = "./images/drizzle.png";
  else if (
    mainWeather === "Mist" ||
    mainWeather === "Fog" ||
    mainWeather === "Haze"
  )
    weatherIcon.src = "./images/mist.png";
  else if (mainWeather === "Snow") weatherIcon.src = "./images/snow.png";
  else weatherIcon.src = "./images/default.png";

  // Update background gradients
  updateBackground(mainWeather);

  // Update weather effects
  renderEffects(mainWeather);

  document.querySelector(".weather").style.display = "block";
  errorDiv.style.display = "none";
}

// 🔹 Fetch weather by city
async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
      errorDiv.innerText = "City not found. Please check spelling.";
      errorDiv.style.display = "block";
      document.querySelector(".weather").style.display = "none";
      return;
    }
    const data = await response.json();
    renderWeather(data);
  } catch (err) {
    errorDiv.innerText = "Error fetching weather. Check your connection.";
    errorDiv.style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

// 🔹 Geolocation weather fetch
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const geoUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
      try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        renderWeather(data);
      } catch (err) {
        errorDiv.innerText = "Error fetching location weather.";
        errorDiv.style.display = "block";
        document.querySelector(".weather").style.display = "none";
      }
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        errorDiv.innerText =
          "Location access denied. Please enter city manually.";
      } else {
        errorDiv.innerText = "Unable to fetch location weather.";
      }
      errorDiv.style.display = "block";
      document.querySelector(".weather").style.display = "none";
    },
  );
}

// 🔹 Event listeners for city search
searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (!city) {
    errorDiv.innerText = "City name cannot be empty.";
    errorDiv.style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    checkWeather(city);
  }
});

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = searchBox.value.trim();
    if (!city) {
      errorDiv.innerText = "City name cannot be empty.";
      errorDiv.style.display = "block";
      document.querySelector(".weather").style.display = "none";
    } else {
      checkWeather(city);
    }
  }
});

// 🔹 Update background gradient
function updateBackground(weather) {
  const card = document.querySelector(".card");
  let gradient = "";
  let bodyGradient = "";

  if (weather === "Clear") {
    gradient = "linear-gradient(135deg, #FFD700, #FFB347)";
    bodyGradient = "linear-gradient(to bottom, #FFE066, #FFB347)";
  } else if (weather === "Clouds") {
    gradient = "linear-gradient(135deg, #B0BEC5, #78909C)";
    bodyGradient = "linear-gradient(to bottom, #B0BEC5, #78909C)";
  } else if (
    weather === "Rain" ||
    weather === "Drizzle" ||
    weather === "Thunderstorm"
  ) {
    gradient = "linear-gradient(135deg, #4FC3F7, #0288D1)";
    bodyGradient = "linear-gradient(to bottom, #0288D1, #4FC3F7)";
  } else if (weather === "Mist" || weather === "Fog" || weather === "Haze") {
    gradient = "linear-gradient(135deg, #CFD8DC, #B0BEC5)";
    bodyGradient = "linear-gradient(to bottom, #B0BEC5, #CFD8DC)";
  } else if (weather === "Snow") {
    gradient = "linear-gradient(135deg, #ECEFF1, #CFD8DC)";
    bodyGradient = "linear-gradient(to bottom, #ECEFF1, #CFD8DC)";
  } else {
    gradient = "linear-gradient(135deg, #00feba, #5b548a)";
    bodyGradient = "linear-gradient(to bottom, #00feba, #5b548a)";
  }

  card.style.background = gradient;
  document.body.style.background = bodyGradient;
}

// ----------------------
// Weather Effects
// ----------------------

// Clear all effects
function clearEffects() {
  if (effectsContainer) effectsContainer.innerHTML = "";
  if (cloudContainer) cloudContainer.innerHTML = "";
}

// Create rain drops
function createRain() {
  clearEffects();
  const dropCount = 50;
  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
    drop.style.opacity = 0.5 + Math.random() * 0.5;
    effectsContainer.appendChild(drop);
  }
}

// Create snow
function createSnow() {
  clearEffects();
  const snowCount = 30;
  for (let i = 0; i < snowCount; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.animationDuration = 5 + Math.random() * 5 + "s";
    flake.style.opacity = 0.3 + Math.random() * 0.7;
    effectsContainer.appendChild(flake);
  }
}

// Create clouds
function createClouds() {
  clearEffects();
  const cloudCount = 6;
  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");
    cloud.style.top = Math.random() * 50 + "vh";
    cloud.style.animationDuration = 30 + Math.random() * 20 + "s";
    cloud.style.opacity = 0.3 + Math.random() * 0.3;
    cloudContainer.appendChild(cloud);
  }
}

// Create mist/fog
function createMist() {
  clearEffects();
  const mist = document.createElement("div");
  mist.classList.add("mist");
  mist.style.bottom = "0";
  mist.style.opacity = 0.3;
  mist.style.animationDuration = "60s";
  cloudContainer.appendChild(mist);
}

// Main effect renderer
function renderEffects(weather) {
  const w = weather.toLowerCase();
  clearEffects();

  if (w === "rain" || w === "drizzle" || w === "thunderstorm") createRain();
  else if (w === "snow") createSnow();
  else if (w === "clouds") createClouds();
  else if (w === "mist" || w === "fog" || w === "haze") createMist();
  else clearEffects();
}
