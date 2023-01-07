import { publishApi } from '@express-typed-api/server';
import express from 'express';
import { GetWeatherEndpoint, WeatherApi } from './readme-shared';

const getWeatherEndpoint: GetWeatherEndpoint = (req) => {
  if (req.params.cityName.length < 3) {
    return {
      payload: { errorMessage: 'City name must have at least 3 characters' },
      status: 400,
    };
  }

  return {
    payload: {
      /** ... */
    },
  };
};

const weatherApi: WeatherApi = {
  '/api/weather/:cityName': {
    get: getWeatherEndpoint,
  },
};

const app = express();

publishApi(app, weatherApi);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up and running!');
});
