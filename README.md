# Express typed api

Simple client/server libraries to assist with creating a type declaration for an [express](https://expressjs.com/) API and using that type to automatically infer the return type of client `fetch` requests.

## Usage example

Take the following sample express API and its corresponding client request:

```typescript
/* server.ts */
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
      temperature: Math.floor(Math.random(50) * 10000) / 100,
      /* other weather properties */
    },
  };
});

app.listen(process.env.PORT || 3000);
```

```typescript
/* client.ts */
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

These are the required steps to setup `@express-typed-api` and automatically infer the `payload` type:

1. **API's type declaration**. Declare a type for the API in a folder/project accessible to both client and server code, where `@express-typed-api/common` must be installed as a dependency:

   ```bash
   npm install --save @express-typed-api/common
   ```

   ```typescript
   import { EndpointHandler } from '@express-typed-api/common';

   export type GetWeatherEndpoint = EndpointHandler<
     | {
         temperature: number;
         /* other weather properties */
       }
     | {
         errorMessage: string;
       }
   >;

   export type WeatherApi = {
     '/api/weather/:cityName': {
       get: GetWeatherEndpoint;
     };
   };
   ```

2. **Server**. Install `@express-typed-api/server` on the server project/folder and import the API's type declaration from the shared project/folder. Locate all `app.<http_method>` calls and extract the handlers into named functions. Create an API representation object containing the handlers as properties, indexed by the endpoints' path and method, making sure to type it with the API's type. Replace the `app.<http_method>` calls with a single call to the `publishApi` method, passing the API representation object as the second parameter.

   ```bash
   npm install --save @express-typed-api/server
   ```

   ```typescript
   /* server.ts */
   import { publishApi } from '@express-typed-api/server';
   import express from 'express';
   import { GetWeatherEndpoint, WeatherApi } from '...'; // Import from shared project/folder

   const app = express();

   const getWeatherEndpoint: GetWeatherEndpoint = (req) => {
     if (req.params.cityName.length < 3) {
       return {
         payload: { errorMessage: 'City name must have at least 3 characters' },
         status: 400,
       };
     }

     return {
       payload: {
         temperature: Math.floor(Math.random(50) * 10000) / 100,
         /* other weather properties */
       },
     };
   };

   const weatherApi: WeatherApi = {
     '/api/weather/:cityName': {
       get: getWeatherEndpoint,
     },
   };

   publishApi(app, weatherApi);

   app.listen(process.env.PORT || 3000);
   ```

3. **Client**. Install `@express-typed-api/client` on the client project/folder and import the API's type declaration from the shared project/folder. Get the `typedFetch` function by calling `getTypedFetch` with the API's type as its type parameter. Replace all the `fetch` calls with the `typedFetch` function:

   ```bash
   npm install --save @express-typed-api/client
   ```

   ```typescript
   /* client.ts */
   import { getTypedFetch } from '@express-typed-api/client';
   import { WeatherApi } from '...'; // Import from shared project/folder

   const typedFetch = getTypedFetch<WeatherApi>();

   export const fetchWeather = async (cityName: string) => {
     const response = await typedFetch(
       '/api/weather/:cityName',
       { method: 'get' },
       {
         params: { cityName },
       }
     );
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
