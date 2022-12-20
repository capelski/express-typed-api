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

export type GetWeatherEndpoint =
  | {
      errorMessage: string;
    }
  | Weather;

export type WeatherApiEndpoints = {
  '/api/weather': {
    get: EndpointHandler<GetWeatherEndpoint>;
    post: EndpointHandlerWithMiddleware<GetWeatherEndpoint>;
  };
  '/api/weather/:cityName': {
    get: EndpointHandler<GetWeatherEndpoint>;
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
