import { publishApi } from '@express-typed-api/server';
import { WeatherApi_FullPaths, WeatherApi_PartialPaths } from '@sample-express-app/common';
import express from 'express';
import { weatherByQueryString, weatherByJsonBody, weatherByUrlParam } from './sample-endpoints';

const app = express();

const weatherApi_fullPaths: WeatherApi_FullPaths = {
  '/full-path/weather': {
    get: weatherByQueryString,
    post: weatherByJsonBody,
  },
  '/full-path/weather/:cityName': {
    get: weatherByUrlParam,
  },
};

const weatherApi_partialPaths: WeatherApi_PartialPaths = {
  '/weather': {
    get: weatherByQueryString,
    post: weatherByJsonBody,
  },
  '/weather/:cityName': {
    get: weatherByUrlParam,
  },
};

/* 1. Endpoints' full paths example */

publishApi(app, weatherApi_fullPaths);

/* 2. Endpoints' partial paths example, using a server prefix */

publishApi(app, weatherApi_partialPaths, { pathsPrefix: '/prefix' });

/* 3. Endpoints' partial paths example, using an express router */

const router = express.Router();
publishApi(router, weatherApi_partialPaths);
app.use('/express-router', router);

/* Server launch */

app.listen(process.env.PORT || 3000, () => {
  console.log('Server up and running!');
});
