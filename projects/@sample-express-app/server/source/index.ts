import { EndpointHandler, publishApi } from '@express-typed-api/server';
import {
  GetWeatherEndpoint,
  validateCityName,
  WeatherApiEndpoints,
} from '@sample-express-app/common';
import express from 'express';
import { getRandomWeather } from './logic';

const weatherEndpoint: EndpointHandler<GetWeatherEndpoint> = (req) => {
  const cityName = <string | undefined>req.query.cityName;
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    return { payload: { errorMessage: cityNameValidation.message }, status: 400 };
  }
  return { payload: getRandomWeather(), status: 200 };
};

const weatherApi: WeatherApiEndpoints = {
  '/api/weather': {
    get: weatherEndpoint,
  },
};

const app = express();

publishApi(app, weatherApi);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up and running!');
});
