# Express typed api

Simple client/server libraries to assist with creating a type declaration for an [express](https://expressjs.com/) API and using that type to automatically infer the return type of client `fetch` requests.

## Usage

### 1. Server

```bash
npm install --save @express-typed-api/server
```

Having installed the server library on your express server, you need to declare a type for your API and replace imperative `app.<http_method>` calls with the `publishApi` method. Given the following sample express app:

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

This is what the API's type declaration would look like:

```typescript
/* readme-shared.ts */

import { EndpointHandler } from '@express-typed-api/common';

export type GetWeatherEndpoint =
  | {
      errorMessage: string;
    }
  | {
      /** ... */
    };

export type WeatherApiEndpoints = {
  '/api/weather/:cityName': {
    get: EndpointHandler<GetWeatherEndpoint>;
  };
};
```

_Note that the type declaration must be imported from both client and server side._

And this is how to replace the `app.<http_method>` calls with the `publishApi` method:

```typescript
import { EndpointHandler, publishApi } from '@express-typed-api/server';
import express from 'express';
import { GetWeatherEndpoint, WeatherApiEndpoints } from './readme-shared';

const weatherEndpoint: EndpointHandler<GetWeatherEndpoint> = (req) => {
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
    get: weatherEndpoint,
  },
};

const app = express();

publishApi(app, weatherApi);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server up and running!');
});
```

### 2. Client

```bash
npm install --save @express-typed-api/client
```

Having installed the client library on your UI web app, you need to import the API's type declaration, pass it as type parameter to the `getTypedFetch` method and use the returned function to replace all the `fetch` calls. Given the following sample `fetch` request:

```typescript
export const fetchWeather = async (cityName: string) => {
  const response = await fetch(`/api/weather/${cityName}`, { method: 'get' });
  const payload = await response.json();
  if ('errorMessage' in payload) {
    // Deal with validation errors
  } else {
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
  const response = await typedFetch(
    '/api/weather/:cityName',
    { method: 'get' },
    { urlParams: { cityName } }
  );
  const payload = await response.json();
  if ('errorMessage' in payload) {
    // Deal with validation errors
  } else {
    // Deal with weather data
  }
};
```

![](/readme/fetch-inferred-return-type.png)
