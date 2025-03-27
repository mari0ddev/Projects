function getWeather() {
    const apiKey = '1206f392eeeb9ca5f310f5e7d3f6d40f';

    // Traducerea orașelor
    const cityTranslations = {
        "bucuresti": "Bucharest",
        "cluj-napoca": "Cluj",
        "constanta": "Constanta",
        "galati": "Galati",
    };

    let city = document.getElementById('city').value.trim().toLowerCase();

    // Verificăm dacă orașul introdus are o traducere în obiectul cityTranslations
    if (cityTranslations[city]) {
        city = cityTranslations[city];
    }

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Funcție pentru a afișa prognoza pe oră
    function displayHourlyForecast(hourlyData) {
        const hourlyForecastDiv = document.getElementById('hourly-forecast');
        hourlyForecastDiv.innerHTML = '';

        const next24Hours = hourlyData.slice(0, 8); // Afisăm prognoza pentru următoarele 8 ore

        next24Hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp);
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            // HTML-ul pentru fiecare oră
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

    // Obținem prognoza pe termen scurt
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
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

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

        let localImage = "images/cersenin.png"; // Default: cer senin

        if (weatherMain.includes("cloud")) {
            localImage = "images/clouddd.png";
        } else if (weatherMain.includes("rain")) {
            localImage = "images/rain.png";
        } else if (weatherMain.includes("snow")) {
            localImage = "images/snow.png";
        } else if (weatherMain.includes("storm") || weatherMain.includes("thunder")) {
            localImage = "images/rainyyyyyyy.png";
        } else if (weatherMain.includes("sun")) {
            localImage = "images/sunpixel.png";
        } else if (weatherMain.includes("clear")) {
            localImage = "images/sunnyyyycloud.png";
        } else if (weatherMain.includes("overcast")) {
            localImage = "images/cloudlyyy.png";
        }
        else if (weatherMain.includes("Broken clouds")) {
            localImage = "images/cloudlyyy.png";
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

// Event listener pentru Enter
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('city').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            getWeather(); 
        }
    });
});
