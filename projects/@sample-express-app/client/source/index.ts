import { getTypedFetch } from '@express-typed-api/client';
import { validateCityName, WeatherApiEndpoints } from '@sample-express-app/common';

const typedFetch = getTypedFetch<WeatherApiEndpoints>(fetch);

const cityNameInput = <HTMLInputElement>document.getElementById('city-name')!;
const getWeatherButton = document.getElementById('get-weather')!;
const errorMessage = document.getElementById('error-message')!;
const cityHeader = document.getElementById('city-header')!;
const icon = <HTMLImageElement>document.getElementById('icon')!;
const temperature = document.getElementById('temperature')!;
const minTemperature = document.getElementById('min-temperature')!;
const maxTemperature = document.getElementById('max-temperature')!;
const windSpeed = document.getElementById('wind-speed')!;

getWeatherButton.addEventListener('click', async () => {
  const cityName = cityNameInput.value;
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    errorMessage.innerText = cityNameValidation.message;
    return;
  }

  errorMessage.innerText = '';
  try {
    const response = await typedFetch(
      '/api/weather',
      { method: 'get' },
      {
        cityName,
      }
    );
    const payload = await response.json();
    if ('icon' in payload) {
      cityHeader.innerText = cityName;
      icon.src = `http://openweathermap.org/img/wn/${payload.icon}@2x.png`;
      temperature.innerText = String(payload.temperature);
      minTemperature.innerText = String(payload.minTemperature);
      maxTemperature.innerText = String(payload.maxTemperature);
      windSpeed.innerText = String(payload.windSpeed);
    } else {
      errorMessage.innerText = payload.errorMessage;
    }
  } catch (_networkError) {
    errorMessage.innerText = 'Network error';
  }
});
