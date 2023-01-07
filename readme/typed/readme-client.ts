import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApi } from './readme-shared';

const typedFetch = getTypedFetch<WeatherApi>();

export const fetchWeather = async (cityName: string) => {
  const response = await typedFetch({
    path: '/api/weather/:cityName',
    init: { method: 'get' },
    params: { cityName },
  });
  const payload = await response.json();
  if ('errorMessage' in payload) {
    console.error(payload);
    // Deal with validation errors
  } else {
    console.log(payload);
    // Deal with weather data
  }
};
