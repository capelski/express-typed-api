import { EndpointHandler, publishApi } from '@express-typed-api/server';
import {
  GetWeatherEndpoint,
  validateCityName,
  Weather,
  WeatherApiEndpoints,
  WeatherIcons,
} from '@sample-express-app/common';
import express from 'express';

const randomFloat = (min: number, max: number, decimals = 2) => {
  const randomNumber = Math.random() * (max - min + 1) + min;
  const roundFactor = Math.pow(10, decimals);
  return Math.round(randomNumber * roundFactor) / roundFactor;
};

const randomWeatherIcon = () => {
  const icons = Object.values(WeatherIcons) as WeatherIcons[];
  return icons[Math.floor(Math.random() * icons.length)];
};

const getRandomWeather = (): Weather => ({
  icon: randomWeatherIcon(),
  maxTemperature: randomFloat(20, 40),
  minTemperature: randomFloat(0, 20),
  temperature: randomFloat(10, 30),
  windSpeed: randomFloat(0, 10),
});

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
