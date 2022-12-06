import { EndpointHandler } from '@express-typed-api/common';

export type GetWeatherEndpoint =
  | {
      errorMessage: string;
    }
  | {
      /** ... */
    };

export type WeatherApiEndpoints = {
  '/api/weather/:cityName': {
    get: EndpointHandler<GetWeatherEndpoint>;
  };
};
