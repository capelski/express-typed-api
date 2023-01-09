import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApiWithPrefix } from '@sample-express-app/common';

export const prefixedPathHandlers = (prefix: string) => {
  const typedFetch = getTypedFetch<WeatherApiWithPrefix>({ prefix });

  const getWeatherJsonBody = (cityName: string) =>
    typedFetch({
      path: '/weather',
      init: {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
      jsonBody: { cityName },
    });

  const getWeatherQuery = (cityName: string) =>
    typedFetch({
      path: '/weather',
      init: { method: 'get' },
      query: {
        cityName,
      },
    });

  const getWeatherParams = (cityName: string) =>
    typedFetch({
      path: '/weather/:cityName',
      init: { method: 'get' },
      params: {
        cityName,
      },
    });

  return {
    jsonBody: getWeatherJsonBody,
    params: getWeatherParams,
    query: getWeatherQuery,
  };
};
