import { getTypedFetch, TypedResponse } from '@express-typed-api/client';
import { validateCityName, WeatherApi, WeatherEndpointResponse } from '@sample-express-app/common';

const typedFetch = getTypedFetch<WeatherApi>();

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
  (handler: (cityName: string) => Promise<TypedResponse<WeatherEndpointResponse>>) => async () => {
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
    } catch (error) {
      console.error(error);
      errorMessage.innerText = 'Network error';
    }
  };

const bodyWeatherFetch = weatherFetchFactory((cityName) =>
  typedFetch({
    path: '/api/weather',
    init: {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    },
    jsonBody: { cityName },
  })
);

getWeatherByBodyButton.addEventListener('click', bodyWeatherFetch);

const queryStringWeatherFetch = weatherFetchFactory((cityName) =>
  typedFetch({
    path: '/api/weather',
    init: { method: 'get' },
    query: {
      cityName,
    },
  })
);

getWeatherByQSButton.addEventListener('click', queryStringWeatherFetch);

const urlParamWeatherFetch = weatherFetchFactory((cityName) =>
  typedFetch({
    path: '/api/weather/:cityName',
    init: { method: 'get' },
    params: {
      cityName,
    },
  })
);

getWeatherByURLParamButton.addEventListener('click', urlParamWeatherFetch);
