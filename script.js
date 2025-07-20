function getWeather() {
    const apiKey = '1206f392eeeb9ca5f310f5e7d3f6d40f';

    // Traducerea orașelor
    const cityTranslations = {
        "bucuresti": "Bucharest",
        "cluj-napoca": "Cluj"
    };

    let city = document.getElementById('city').value.trim().toLowerCase();

    // Verificăm dacă orașul introdus are o traducere
    if (cityTranslations[city]) {
        city = cityTranslations[city];
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Afișăm prognoza pe oră
    function displayHourlyForecast(hourlyData) {
        const hourlyForecastDiv = document.getElementById('hourly-forecast');
        hourlyForecastDiv.innerHTML = '';

        const next24Hours = hourlyData.slice(0, 8); // 8 intervale de 3 ore = 24h

        next24Hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temp = Math.round(item.main.temp);
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const hourlyItemHtml = `
                <div class="hourly-item">
                    <span>${hour}:00</span>
                    <img src="${iconUrl}" alt="Hourly weather icon">
                    <span>${temp}°C</span>
                </div>
            `;
            hourlyForecastDiv.innerHTML += hourlyItemHtml;
        });
    }

    // Obținem vremea curentă
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Obținem prognoza
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayWeather(data) {
    console.log("Starting displayWeather with data:", data);
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const rainEffect = document.getElementById('rain');
    const starsEffect = document.getElementById('stars');
    console.log("rainEffect:", rainEffect, "starsEffect:", starsEffect);

    // Resetează conținutul
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Resetează efectele
    if (rainEffect) rainEffect.classList.remove('active');
    if (starsEffect) starsEffect.classList.remove('active');

    const currentTime = new Date().getTime() / 1000;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const isDayTime = currentTime >= sunrise && currentTime < sunset;

    const body = document.body;
    body.classList.remove('day', 'night', 'day-background', 'night-background');
    body.classList.add(isDayTime ? 'day' : 'night');
    body.classList.add(isDayTime ? 'day-background' : 'night-background');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const weatherMain = data.weather[0].main.toLowerCase();
        const windSpeed = data.wind.speed;
        const windDirection = data.wind.deg;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const dewPoint = data.main.temp_min;

        let localImage = "images/cersenin.png"; // Default cer senin

        // Logică unificată pentru imagini
        if (weatherMain.includes("rain")) {
            localImage = "images/rain.png";
        } else if (weatherMain.includes("thunderstorm") || weatherMain.includes("storm")) {
            localImage = "images/rainyyyyyyy.png";
        } else if (weatherMain.includes("snow")) {
            localImage = "images/snow.png";
        } else if (weatherMain.includes("drizzle")) {
            localImage = "images/rain.png"; 
        } else if (weatherMain.includes("cloud")) {
            localImage = isDayTime ? "images/clouddd.png" : "images/cloudlyyy.png";
        } else if (weatherMain.includes("clear")) {
            localImage = isDayTime ? "images/sunpixel.png" : "images/night.png";
        } else if (weatherMain.includes("overcast") || weatherMain.includes("broken")) {
            localImage = "images/cloudlyyy.png";
        } else if (weatherMain.includes("scattered")) {
            localImage = "images/clouddd.png";
        }

        console.log("Weather main:", weatherMain, "Image set to:", localImage);

        // Activează efectele
        if (rainEffect && (weatherMain.includes("rain") || weatherMain.includes("thunderstorm") || weatherMain.includes("drizzle"))) {
            console.log("Activating rain effect for:", weatherMain);
            rainEffect.classList.add('active');
        } else if (starsEffect && !isDayTime && !weatherMain.includes("rain") && !weatherMain.includes("thunderstorm") && !weatherMain.includes("drizzle")) {
            console.log("Activating stars effect");
            starsEffect.classList.add('active');
        }

        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        weatherIcon.src = localImage;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block';

        const additionalInfo = `
            <p>Viteza vântului: ${windSpeed} m/s (${getWindDirection(windDirection)})</p>
            <p>Presiune atmosferică: ${pressure} hPa</p>
            <p>Umiditate: ${humidity}%</p>
            <p>Punct de rouă: ${dewPoint}°C</p>
        `;
        weatherInfoDiv.innerHTML += additionalInfo;
    }
}

// Funcție pentru direcția vântului
function getWindDirection(degree) {
    if (degree >= 0 && degree < 45) return "N (Nord)";
    if (degree >= 45 && degree < 90) return "NE (Nord-Est)";
    if (degree >= 90 && degree < 135) return "E (Est)";
    if (degree >= 135 && degree < 180) return "SE (Sud-Est)";
    if (degree >= 180 && degree < 225) return "S (Sud)";
    if (degree >= 225 && degree < 270) return "SV (Sud-Vest)";
    if (degree >= 270 && degree < 315) return "V (Vest)";
    return "NV (Nord-Vest)";
}

// Event listener pentru Enter
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('city').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    });
});
