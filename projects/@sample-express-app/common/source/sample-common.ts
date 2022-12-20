import { EndpointHandler, EndpointHandlerWithMiddleware } from '@express-typed-api/common';

export type Validation =
  | {
      valid: true;
    }
  | {
      valid: false;
      message: string;
    };

export type Weather = {
  icon: WeatherIcons;
  minTemperature: number;
  maxTemperature: number;
  temperature: number;
  windSpeed: number;
};

export type WeatherEndpointInput = { cityName: string };

export type WeatherEndpointResponse =
  | {
      errorMessage: string;
    }
  | Weather;

export enum WeatherIcons {
  clearSky = '01d',
  fewClouds = '02d',
  scatteredClouds = '03d',
  brokenClouds = '04d',
  showerRain = '09d',
  rain = '10d',
  thunderstorm = '11d',
  snow = '13d',
  mist = '50d',
}

export type GetWeatherByJsonBody = EndpointHandlerWithMiddleware<
  WeatherEndpointResponse,
  { body: WeatherEndpointInput }
>;

export type GetWeatherByQueryString = EndpointHandler<
  WeatherEndpointResponse,
  { query: WeatherEndpointInput }
>;

export type GetWeatherByURLParam = EndpointHandler<
  WeatherEndpointResponse,
  { params: WeatherEndpointInput }
>;

export type WeatherApiEndpoints = {
  '/api/weather': {
    get: GetWeatherByQueryString;
    post: GetWeatherByJsonBody;
  };
  '/api/weather/:cityName': {
    get: GetWeatherByURLParam;
  };
};

const minimumCharacters = 3;

export const validateCityName = (cityName: string | undefined): Validation => {
  return !cityName
    ? { valid: false, message: 'Missing city name' }
    : cityName.length < minimumCharacters
    ? { valid: false, message: `City name must have at least ${minimumCharacters} characters` }
    : { valid: true };
};
