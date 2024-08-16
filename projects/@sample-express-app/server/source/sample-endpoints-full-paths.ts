import { WeatherApi_FullPaths } from '@sample-express-app/common';
import express from 'express';
import { weatherLogic } from './sample-domain-logic';

export const weatherApi_fullPaths: WeatherApi_FullPaths = {
  '/full-path/weather': {
    get: (req) => {
      const cityName = <string | undefined>req.query.cityName;
      return weatherLogic(cityName);
    },
    post: {
      handler: (req) => {
        return weatherLogic(req.body?.cityName);
      },
      middleware: (h) => [express.json(), h],
    },
  },
  '/full-path/weather/:cityName': {
    get: (req) => {
      return weatherLogic(req.params.cityName);
    },
  },
};
