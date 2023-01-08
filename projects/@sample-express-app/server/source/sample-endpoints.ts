import { EndpointResponse } from '@express-typed-api/server';
import {
  validateCityName,
  GetWeatherByJsonBody,
  GetWeatherByQueryString,
  GetWeatherByURLParam,
} from '@sample-express-app/common';
import express from 'express';
import { getRandomWeather } from './sample-domain-logic';

const weatherLogic = (cityName: string | undefined) => {
  const cityNameValidation = validateCityName(cityName);

  if (!cityNameValidation.valid) {
    return new EndpointResponse({ errorMessage: cityNameValidation.message }, 400);
  }
  return new EndpointResponse(getRandomWeather());
};

export const weatherByJsonBody: GetWeatherByJsonBody = {
  handler: (req) => {
    return weatherLogic(req.body?.cityName);
  },
  middleware: (h) => [express.json(), h],
};

export const weatherByQueryString: GetWeatherByQueryString = (req) => {
  const cityName = <string | undefined>req.query.cityName;
  return weatherLogic(cityName);
};

export const weatherByUrlParam: GetWeatherByURLParam = (req) => {
  return weatherLogic(req.params.cityName);
};
