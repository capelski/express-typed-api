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

/**
 * Sample API's type declaration containing the endpoints' full path.
 * Deliberately untyped request payloads for demonstration purposes
 */
export type WeatherApi_FullPaths = {
  '/full-path/weather': {
    get: EndpointHandler<WeatherEndpointResponse>;
    post: EndpointHandlerWithMiddleware<WeatherEndpointResponse>;
  };
  '/full-path/weather/:cityName': {
    get: EndpointHandler<WeatherEndpointResponse>;
  };
};

/**
 * Sample API's type declaration containing the endpoints' partial path,
 * which will be published with a prefix
 */
export type WeatherApi_PartialPaths = {
  '/weather': {
    get: EndpointHandler<WeatherEndpointResponse, { query: WeatherEndpointInput }>;
    post: EndpointHandlerWithMiddleware<
      WeatherEndpointResponse,
      { jsonBody: WeatherEndpointInput }
    >;
  };
  '/weather/:cityName': {
    get: EndpointHandler<WeatherEndpointResponse, { params: WeatherEndpointInput }>;
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
