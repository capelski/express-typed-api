import { TypedResponse } from '@express-typed-api/client';
import { validateCityName, WeatherEndpointResponse } from '@sample-express-app/common';
import {
  cityNameInput,
  errorMessage,
  icon,
  temperature,
  minTemperature,
  maxTemperature,
  windSpeed,
  getWeatherButton,
  requestUrl,
  requestBody,
} from './sample-elements';
import { fullPathHandlers } from './sample-typed-fetch';
import { prefixedPathHandlers } from './sample-typed-fetch-with-prefix';

let latestRequest: {
  url: string;
  body?: string;
};

const windowFetch = window.fetch;
window.fetch = function (...args: Parameters<typeof fetch>) {
  latestRequest = {
    url: <string>args[0],
    body: <string>args[1]?.body,
  };
  return windowFetch(...args);
};

const fetchHandlers: {
  [key: string]: {
    [key: string]: (cityName: string) => Promise<TypedResponse<WeatherEndpointResponse>>;
  };
} = {
  fullPath: fullPathHandlers(),
  '/api/v1': prefixedPathHandlers('/api/v1'),
  '/api/v2': prefixedPathHandlers('/api/v2'),
};

getWeatherButton.addEventListener('click', async () => {
  const cityName = cityNameInput.value;
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    errorMessage.innerText = cityNameValidation.message;
    return;
  }
  errorMessage.innerText = '';

  const requestPayload = document.querySelector<HTMLInputElement>(
    'input[name=request-payload]:checked'
  )!;
  const targetEndpoint = document.querySelector<HTMLInputElement>(
    'input[name=target-endpoint]:checked'
  )!;

  const response = await fetchHandlers[targetEndpoint.value][requestPayload.value](cityName);

  try {
    const payload = await response.json();
    if ('icon' in payload) {
      requestUrl.innerHTML = latestRequest.url;
      requestBody.innerHTML = latestRequest.body || '-';

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
});
