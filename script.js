function getWeather(option) {
    let apiUrl = '';
    if (option === 'search') {
        const location = document.getElementById('location').value;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=be5b5719ae2ec7e9b1bedc36450712fb`;
    } else if (option === 'location') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=be5b5719ae2ec7e9b1bedc36450712fb`;
                    fetchWeather(apiUrl);
                },
                showError
            );
        } else {
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
        }
        return; // Return to prevent fetching weather again after geolocation
    }

    fetchWeather(apiUrl);
}

function fetchWeather(apiUrl) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `
                <h2>Weather in ${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
            `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = '<p>Unable to fetch weather data. Please try again later.</p>';
        });
}

function showError(error) {
    const weatherInfo = document.getElementById('weather-info');
    switch(error.code) {
        case error.PERMISSION_DENIED:
            weatherInfo.innerHTML = '<p>User denied the request for Geolocation.</p>';
            break;
        case error.POSITION_UNAVAILABLE:
            weatherInfo.innerHTML = '<p>Location information is unavailable.</p>';
            break;
        case error.TIMEOUT:
            weatherInfo.innerHTML = '<p>The request to get user location timed out.</p>';
            break;
        case error.UNKNOWN_ERROR:
            weatherInfo.innerHTML = '<p>An unknown error occurred.</p>';
            break;
    }
}