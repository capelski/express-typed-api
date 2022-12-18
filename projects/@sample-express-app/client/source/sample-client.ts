import { getTypedFetch, TypedResponse } from '@express-typed-api/client';
import {
  GetWeatherEndpoint,
  validateCityName,
  WeatherApiEndpoints,
} from '@sample-express-app/common';

const typedFetch = getTypedFetch<WeatherApiEndpoints>();

const cityNameInput = <HTMLInputElement>document.getElementById('city-name')!;
const getWeatherByBodyButton = document.getElementById('get-weather-by-body')!;
const getWeatherByQSButton = document.getElementById('get-weather-by-query-string')!;
const getWeatherByURLParamButton = document.getElementById('get-weather-by-url-param')!;
const errorMessage = document.getElementById('error-message')!;
const cityHeader = document.getElementById('city-header')!;
const icon = <HTMLImageElement>document.getElementById('icon')!;
const temperature = document.getElementById('temperature')!;
const minTemperature = document.getElementById('min-temperature')!;
const maxTemperature = document.getElementById('max-temperature')!;
const windSpeed = document.getElementById('wind-speed')!;

const weatherFetchFactory =
  (handler: (cityName: string) => Promise<TypedResponse<GetWeatherEndpoint>>) => async () => {
    const cityName = cityNameInput.value;
    const cityNameValidation = validateCityName(cityName);

    if (!cityNameValidation.valid) {
      errorMessage.innerText = cityNameValidation.message;
      return;
    }

    errorMessage.innerText = '';
    try {
      const response = await handler(cityName);
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
  };

const bodyWeatherFetch = weatherFetchFactory((cityName) =>
  typedFetch('/api/weather', {
    body: JSON.stringify({ cityName }),
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
  })
);

getWeatherByBodyButton.addEventListener('click', bodyWeatherFetch);

const queryStringWeatherFetch = weatherFetchFactory((cityName) =>
  typedFetch(
    '/api/weather',
    { method: 'get' },
    {
      queryString: {
        cityName,
      },
    }
  )
);

getWeatherByQSButton.addEventListener('click', queryStringWeatherFetch);

const urlParamWeatherFetch = weatherFetchFactory((cityName) =>
  typedFetch(
    '/api/weather/:cityName',
    { method: 'get' },
    {
      urlParams: {
        cityName,
      },
    }
  )
);

getWeatherByURLParamButton.addEventListener('click', urlParamWeatherFetch);
