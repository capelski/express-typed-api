import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApiWithPrefix } from '@sample-express-app/common';

export const prefixedPathHandlers = (prefix: string) => {
  const typedFetch = getTypedFetch<WeatherApiWithPrefix>({ prefix });

  const getWeatherJsonBody = (cityName: string) =>
    typedFetch(
      '/weather',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
      { jsonBody: { cityName } }
    );

  const getWeatherQuery = (cityName: string) =>
    typedFetch(
      '/weather',
      { method: 'get' },
      {
        query: {
          cityName,
        },
      }
    );

  const getWeatherParams = (cityName: string) =>
    typedFetch(
      '/weather/:cityName',
      { method: 'get' },
      {
        params: {
          cityName,
        },
      }
    );

  return {
    jsonBody: getWeatherJsonBody,
    params: getWeatherParams,
    query: getWeatherQuery,
  };
};
