import { EndpointHandler } from '@express-typed-api/common';

export type GetWeatherEndpoint = EndpointHandler<
  | {
      errorMessage: string;
    }
  | {
      /** ... */
    }
>;

export type WeatherApiEndpoints = {
  '/api/weather/:cityName': {
    get: GetWeatherEndpoint;
  };
};
