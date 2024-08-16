import { WeatherApi_PartialPaths } from '@sample-express-app/common';
import express from 'express';
import { weatherLogic } from './sample-domain-logic';

export const weatherApi_partialPaths: WeatherApi_PartialPaths = {
  '/weather': {
    get: (req) => {
      const { cityName } = req.query;
      return weatherLogic(cityName);
    },
    post: {
      handler: (req) => {
        return weatherLogic(req.body?.cityName);
      },
      middleware: (h) => [express.json(), h],
    },
  },
  '/weather/:cityName': {
    get: (req) => {
      return weatherLogic(req.params.cityName);
    },
  },
};
