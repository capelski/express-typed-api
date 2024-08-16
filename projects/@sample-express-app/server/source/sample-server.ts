import { publishApi } from '@express-typed-api/server';
import express from 'express';
import { weatherApi_fullPaths } from './sample-endpoints-full-paths';
import { weatherApi_partialPaths } from './sample-endpoints-partial-paths';

const app = express();

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
