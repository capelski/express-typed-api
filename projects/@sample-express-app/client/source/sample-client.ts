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
  requestUrl,
  requestBody,
  expressRouterJsonBodyButton,
  expressRouterParamsButton,
  expressRouterQueryButton,
  fullPathJsonBodyButton,
  fullPathParamsButton,
  fullPathQueryButton,
  prefixJsonBodyButton,
  prefixParamsButton,
  prefixQueryButton,
} from './sample-elements';
import { getFullPathsFetchers, getPartialPathsFetchers } from './sample-typed-fetch';

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

const requestWeatherData = async (
  fetcher: (cityName: string) => Promise<TypedResponse<WeatherEndpointResponse>>
) => {
  const cityName = cityNameInput.value;
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    errorMessage.innerText = cityNameValidation.message;
    return;
  }
  errorMessage.innerText = '';

  const response = await fetcher(cityName);

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
};

const fullPath = getFullPathsFetchers();
const prefix = getPartialPathsFetchers('/prefix');
const expressRouter = getPartialPathsFetchers('/express-router');

fullPathJsonBodyButton.addEventListener('click', () => requestWeatherData(fullPath.jsonBody));
fullPathParamsButton.addEventListener('click', () => requestWeatherData(fullPath.params));
fullPathQueryButton.addEventListener('click', () => requestWeatherData(fullPath.query));
prefixJsonBodyButton.addEventListener('click', () => requestWeatherData(prefix.jsonBody));
prefixParamsButton.addEventListener('click', () => requestWeatherData(prefix.params));
prefixQueryButton.addEventListener('click', () => requestWeatherData(prefix.query));
expressRouterJsonBodyButton.addEventListener('click', () =>
  requestWeatherData(expressRouter.jsonBody)
);
expressRouterParamsButton.addEventListener('click', () => requestWeatherData(expressRouter.params));
expressRouterQueryButton.addEventListener('click', () => requestWeatherData(expressRouter.query));
