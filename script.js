function getWeather() {
    const apiKey = '1206f392eeeb9ca5f310f5e7d3f6d40f';

  
    const cityTranslations = {
        "bucuresti": "Bucharest",
        "cluj-napoca": "Cluj ",
        "Constanta": "Constanta",
        "galati": "Galati",
        
    };

    let city = document.getElementById('city').value.trim().toLowerCase();
    
  
    if (cityTranslations[city]) {
        city = cityTranslations[city];
    }

    const formattedCity = city;




    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${formattedCity}&appid=${apiKey}&units=metric`;
    function displayHourlyForecast(hourlyData) {
        const hourlyForecastDiv = document.getElementById('hourly-forecast');
        hourlyForecastDiv.innerHTML = ''; 
    
       
        const next24Hours = hourlyData.slice(0, 8); 
    
        // Parcurgem datele și le adăugăm în div-ul pentru prognoza orară
        next24Hours.forEach(item => {
            const dateTime = new Date(item.dt * 1000);
            const hour = dateTime.getHours();
            const temperature = Math.round(item.main.temp); // Temperatura
            const iconCode = item.weather[0].icon; // Codul imaginii pentru vreme
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // URL-ul imaginii
    
            // Creăm HTML-ul pentru fiecare oră
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

        // Alegem imaginea în funcție de vreme
        let localImage = "images/cersenin.png"; 
        if (weatherMain.includes("cloud")) {
            localImage = "images/cloudlyyy.png";
        } else if (weatherMain.includes("rain")) {
            localImage = "images/rain.png";
        } else if (weatherMain.includes("snow")) {
            localImage = "images/snow.png";
        } else if (weatherMain.includes("storm") || weatherMain.includes("thunder")) {
            localImage = "images/rainyyyyyyy.png";
        } else if (weatherMain.includes("sun") || weatherMain.includes("sun")) {
            localImage = "images/sunpixel.png";
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
