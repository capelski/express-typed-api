import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApi_FullPaths, WeatherApi_PartialPaths } from '@sample-express-app/common';

export const getFullPathsFetchers = () => {
  const typedFetch = getTypedFetch<WeatherApi_FullPaths>();

  return {
    jsonBody: (cityName: string) =>
      typedFetch('/full-path/weather', {
        body: JSON.stringify({ cityName }), // Not required by TS
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      }),
    params: (cityName: string) =>
      typedFetch(
        '/full-path/weather/:cityName',
        { method: 'get' },
        {
          params: {
            cityName, // Not required by TS
          },
        }
      ),
    query: (cityName: string) =>
      typedFetch(
        '/full-path/weather',
        { method: 'get' },
        {
          query: {
            cityName, // Not required by TS
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
        { jsonBody: { cityName } } // Required by TS
      ),
    params: (cityName: string) =>
      typedFetch(
        '/weather/:cityName',
        { method: 'get' },
        {
          params: {
            cityName, // Required by TS
          },
        }
      ),
    query: (cityName: string) =>
      typedFetch(
        '/weather',
        { method: 'get' },
        {
          query: {
            cityName, // Required by TS
          },
        }
      ),
  };
};
