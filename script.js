function getWeather() {
    const apiKey = '1206f392eeeb9ca5f310f5e7d3f6d40f';

    const cityTranslations = {
        "bucuresti": "Bucharest",
        "cluj-napoca": "Cluj",
        "constanta": "Constanta",
        "galati": "Galati",
    };

    let city = document.getElementById('city').value.trim().toLowerCase();
    if (cityTranslations[city]) {
        city = cityTranslations[city];
    }

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Afișăm prognoza pe următoarele ore
    function displayHourlyForecast(hourlyData) {
        const hourlyForecastDiv = document.getElementById('hourly-forecast');
        hourlyForecastDiv.innerHTML = '';

        const next24Hours = hourlyData.slice(0, 8);

        next24Hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp);
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const hourlyItemHtml = `
                <div class="hourly-item">
                    <span>${hour}:00</span>
                    <img src="${iconUrl}" alt="Hourly Weather Icon">
                    <span>${temperature}°C</span>
                </div>
            `;
            hourlyForecastDiv.innerHTML += hourlyItemHtml;
        });
    }

    // Obținem datele meteo curente
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert(`Error: ${data.message}`);
                return;
            }
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
            if (data.cod !== "200") {
                alert(`Error: ${data.message}`);
                return;
            }
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    console.log("Starting displayWeather with data:", data);
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const rainEffect = document.getElementById('rain');
    console.log("rainEffect element:", rainEffect);

    // Resetează conținutul
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Resetează efectul de ploaie
    if (rainEffect) {
        rainEffect.classList.remove('active');
    } else {
        console.error("Element #rain not found in DOM");
    }

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

        console.log("Weather main:", weatherMain, "Rain data:", data.rain);

        let localImage = "images/cersenin.png";

        // Prioritizează condițiile meteo
        if (weatherMain.includes("rain")) {
            localImage = "images/rain.png";
        } else if (weatherMain.includes("storm") || weatherMain.includes("thunderstorm")) {
            localImage = "images/rainyyyyyyy.png";
        } else if (weatherMain.includes("snow")) {
            localImage = "images/snow.png";
        } else if (weatherMain.includes("cloud")) {
            localImage = isDayTime ? "images/clouddd.png" : "images/cloudlyyy.png";
        } else if (weatherMain.includes("sun") || weatherMain.includes("clear")) {
            localImage = isDayTime ? "images/sunpixel.png" : "images/night.png";
        } else if (weatherMain.includes("overcast clouds") || weatherMain.includes("broken clouds")) {
            localImage = "images/cloudlyyy.png";
        } else if (weatherMain.includes("scattered clouds")) {
            localImage = "images/clouddd.png";
        }

        console.log("Image set to:", localImage);

        // Activează efectul de ploaie
        if (rainEffect && (weatherMain.includes("rain") || weatherMain.includes("thunderstorm") || weatherMain.includes("drizzle"))) {
            console.log("Activating rain effect for:", weatherMain);
            rainEffect.classList.add('active');
        } else {
            console.log("No rain effect for:", weatherMain);
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

function getWindDirection(degree) {
    if (degree >= 0 && degree < 45) {
        return "N (Nord)";
    } else if (degree >= 45 && degree < 90) {
        return "NE (Nord-Est)";
    } else if (degree >= 90 && degree < 135) {
        return "E (Est)";
    } else if (degree >= 135 && degree < 180) {
        return "SE (Sud-Est)";
    } else if (degree >= 180 && degree < 225) {
        return "S (Sud)";
    } else if (degree >= 225 && degree < 270) {
        return "SW (Sud-Vest)";
    } else if (degree >= 270 && degree < 315) {
        return "W (Vest)";
    } else {
        return "NW (Nord-Vest)";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('city').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    });
    
});
