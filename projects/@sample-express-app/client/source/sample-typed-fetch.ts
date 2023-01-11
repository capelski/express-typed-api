import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApi } from '@sample-express-app/common';

export const fullPathHandlers = () => {
  const typedFetch = getTypedFetch<WeatherApi>();

  const getWeatherJsonBody = (cityName: string) =>
    typedFetch(
      '/api/weather',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
      { jsonBody: { cityName } }
    );

  const getWeatherQuery = (cityName: string) =>
    typedFetch(
      '/api/weather',
      { method: 'get' },
      {
        query: {
          cityName,
        },
      }
    );

  const getWeatherParams = (cityName: string) =>
    typedFetch(
      '/api/weather/:cityName',
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
