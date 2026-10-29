const form = document.querySelector('#weather-form');
const resultEl = document.querySelector('#result');
const errorEl = document.querySelector('#error');
const submitBtn = document.querySelector('#submit-btn');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const latitude = parseFloat(document.querySelector('#latitude').value);
    const longitude = parseFloat(document.querySelector('#longtitude').value);

    // --- Валидация ---
    if (!isValidCoord(latitude, -90, 90)) {
        return showError('Latitude must be a number between -90 and 90.');
    }
    if (!isValidCoord(longitude, -180, 180)) {
        return showError('Longitude must be a number between -180 and 180.');
    }

    clearError();
    setLoading(true);
    resultEl.innerHTML = '';

    try {
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,wind_speed_10m`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server antwortet mit Status ${response.status}`);
        }

        const body = await response.json();

        if (!body.current) {
            throw new Error('Response contains no weather data.');
        }

        renderWeather(body.current, latitude, longitude);
    } catch (err) {
        showError(`Mistake: ${err.message}`);
    } finally {
        setLoading(false);
    }
});

function isValidCoord(value, min, max) {
    return Number.isFinite(value) && value >= min && value <= max;
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('loading', isLoading);
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
}

function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
}

function renderWeather(data, lat, lon) {
    resultEl.innerHTML = `
        <div class="weather">
            <p class="weather__coords">${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
            <div class="weather__row">
                <span class="weather__label"> Temperature</span>
                <span class="weather__value">${data.temperature_2m} °C</span>
            </div>
            <div class="weather__row">
                <span class="weather__label"> Wind</span>
                <span class="weather__value">${data.wind_speed_10m} km/h</span>
            </div>
        </div>
    `;
}