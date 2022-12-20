import { EndpointResponse, publishApi } from '@express-typed-api/server';
import {
  GetWeatherByJsonBody,
  GetWeatherByQueryString,
  GetWeatherByURLParam,
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

const weatherLogic = (cityName: string | undefined) => {
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    return new EndpointResponse({ errorMessage: cityNameValidation.message }, 400);
  }
  return new EndpointResponse(getRandomWeather());
};

const weatherByJsonBody: GetWeatherByJsonBody = {
  handler: (req) => {
    return weatherLogic(req.body?.cityName);
  },
  middleware: (h) => [express.json(), h],
};

const weatherByQueryString: GetWeatherByQueryString = (req) => {
  const cityName = <string | undefined>req.query.cityName;
  return weatherLogic(cityName);
};

const weatherByUrlParam: GetWeatherByURLParam = (req) => {
  return weatherLogic(req.params.cityName);
};

const weatherApi: WeatherApiEndpoints = {
  '/api/weather': {
    get: weatherByQueryString,
    post: weatherByJsonBody,
  },
  '/api/weather/:cityName': {
    get: weatherByUrlParam,
  },
};

const app = express();

publishApi(app, weatherApi);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up and running!');
});
