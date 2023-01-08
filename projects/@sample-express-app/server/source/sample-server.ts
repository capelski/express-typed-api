import { publishApi } from '@express-typed-api/server';
import { WeatherApi, WeatherApiWithPrefix } from '@sample-express-app/common';
import express from 'express';
import { weatherByQueryString, weatherByJsonBody, weatherByUrlParam } from './sample-endpoints';

const app = express();

/* 1. Endpoints' full path example */

const weatherApi: WeatherApi = {
  '/api/weather': {
    get: weatherByQueryString,
    post: weatherByJsonBody,
  },
  '/api/weather/:cityName': {
    get: weatherByUrlParam,
  },
};

publishApi(app, weatherApi);

/* 2. Endpoints' partial path example, using a server prefix */

const weatherApiWithPrefix: WeatherApiWithPrefix = {
  '/weather': {
    get: weatherByQueryString,
    post: weatherByJsonBody,
  },
  '/weather/:cityName': {
    get: weatherByUrlParam,
  },
};

publishApi(app, weatherApiWithPrefix, { prefix: '/v1' });

/* 3. Endpoints' partial path example, using an express router */

const router = express.Router();

publishApi(router, weatherApiWithPrefix);

app.use('/v2', router);

/* Server launch */

app.listen(process.env.PORT || 3000, () => {
  console.log('Server up and running!');
});
