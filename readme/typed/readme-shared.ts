import { EndpointHandler } from '@express-typed-api/common';

export type GetWeatherEndpoint = EndpointHandler<
  | {
      errorMessage: string;
    }
  | {
      /** ... */
    },
  { params: { cityName: string } }
>;

export type WeatherApiEndpoints = {
  '/api/weather/:cityName': {
    get: GetWeatherEndpoint;
  };
};
