import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApi_FullPaths, WeatherApi_PartialPaths } from '@sample-express-app/common';

export const getFullPathsFetchers = () => {
  const typedFetch = getTypedFetch<WeatherApi_FullPaths>();

  return {
    jsonBody: (cityName: string) =>
      typedFetch(
        '/full-path/weather',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
        },
        { jsonBody: { cityName } }
      ),
    params: (cityName: string) =>
      typedFetch(
        '/full-path/weather/:cityName',
        { method: 'get' },
        {
          params: {
            cityName,
          },
        }
      ),
    query: (cityName: string) =>
      typedFetch(
        '/full-path/weather',
        { method: 'get' },
        {
          query: {
            cityName,
          },
        }
      ),
  };
};

export const getPartialPathsFetchers = (baseUrl: string) => {
  const typedFetch = getTypedFetch<WeatherApi_PartialPaths>({ baseUrl });

  return {
    jsonBody: (cityName: string) =>
      typedFetch(
        '/weather',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
        },
        { jsonBody: { cityName } }
      ),
    params: (cityName: string) =>
      typedFetch(
        '/weather/:cityName',
        { method: 'get' },
        {
          params: {
            cityName,
          },
        }
      ),
    query: (cityName: string) =>
      typedFetch(
        '/weather',
        { method: 'get' },
        {
          query: {
            cityName,
          },
        }
      ),
  };
};
