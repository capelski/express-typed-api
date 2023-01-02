# Express typed api

Simple client/server libraries to assist with creating a type declaration for an [express](https://expressjs.com/) API and using that type to automatically infer the return type of client `fetch` requests.

## Usage

### 1. API's type declaration

You will need to declare a type for your API in a folder/project accessible to both client and server sides. Here is what the type declaration would look like for the following sample express app:

```typescript
import express from 'express';

const app = express();

app.get('/api/weather/:cityName', (req) => {
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
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up and running!');
});
```

```bash
npm install --save @express-typed-api/common
```

```typescript
/* readme-shared.ts */

import { EndpointHandler } from '@express-typed-api/common';

export type GetWeatherEndpoint = EndpointHandler<
  | {
      errorMessage: string;
    }
  | {
      /** ... */
    },
  { params: { cityName: string } }
>;

export type WeatherApiEndpoints = {
  '/api/weather/:cityName': {
    get: GetWeatherEndpoint;
  };
};
```

### 2. Server side

Having installed the server library on your express server, you will need to replace imperative `app.<http_method>` calls with the `publishApi` method. This is how to use `publishApi` for the previous sample express app:

```bash
npm install --save @express-typed-api/server
```

```typescript
import { publishApi } from '@express-typed-api/server';
import express from 'express';
import { GetWeatherEndpoint, WeatherApiEndpoints } from './readme-shared';

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

const weatherApi: WeatherApiEndpoints = {
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
```

### 3. Client

```bash
npm install --save @express-typed-api/client
```

Having installed the client library on your UI web app, you will need to import the API's type declaration, pass it as type parameter to the `getTypedFetch` method and use the returned function to replace all the `fetch` calls. Given the following sample `fetch` request:

```typescript
export const fetchWeather = async (cityName: string) => {
  const response = await fetch(`/api/weather/${cityName}`, { method: 'get' });
  const payload = await response.json();
  if ('errorMessage' in payload) {
    console.error(payload);
    // Deal with validation errors
  } else {
    console.log(payload);
    // Deal with weather data
  }
};
```

![](/readme/fetch-any-return-type.png)

This is how to pass the API's type declaration to `getTypedFetch` and use the returned function to perform the fetch request with automatic type inferring:

```typescript
import { getTypedFetch } from '@express-typed-api/client';
import { WeatherApiEndpoints } from './readme-shared';

const typedFetch = getTypedFetch<WeatherApiEndpoints>();

export const fetchWeather = async (cityName: string) => {
  const response = await typedFetch({
    path: '/api/weather/:cityName',
    init: { method: 'get' },
    params: { cityName },
  });
  const payload = await response.json();
  if ('errorMessage' in payload) {
    console.error(payload);
    // Deal with validation errors
  } else {
    console.log(payload);
    // Deal with weather data
  }
};
```

![](/readme/fetch-inferred-return-type.png)
