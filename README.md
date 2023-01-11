# Express typed api

Simple client/server libraries to assist with creating a type declaration for an [express](https://expressjs.com/) API and using that type to automatically infer the return type of client `fetch` requests.

## Contents

- [Usage example](#usage-example)
- [Server API](#server-api)
- [Client API](#client)
- [Typed request payload](#typed-request-payload)

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
      temperature: Math.floor(Math.random() * 5000) / 100,
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
         temperature: Math.floor(Math.random() * 5000) / 100,
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

For more examples see the [sample repository](https://github.com/capelski/express-typed-api/tree/main/projects/%40sample-express-app).

## Server API

### publishApi(app, apiEndpoints, [options])

#### Returns

A list of the successfully published endpoints, each containing its path, method and handlers.

#### Arguments

- **app**: The `express()` or `express.Router()` instance where the api endpoints will be published at.
- **apiEndpoints**: The API representation object, having the endpoints' handler as properties and the endpoints' path and method as keys.
- **options**: Optional configuration parameters.

  | name        | type    | default     | description                                            |
  | ----------- | ------- | ----------- | ------------------------------------------------------ |
  | pathsPrefix | string? | `undefined` | A string that will be prepended to all endpoints' path |

#### Example

```javascript
const app = express();

publishApi(app, {
  '/my/path': {
    get: (req, res, next) => {
      /* ... */
    },
    post: (req, res, next) => {
      /* ... */
    },
    // ...
  },
});

app.listen(3000);
```

## Client API

### getTypedFetch\<TApi\>([options])

#### Returns

An instance of [typedFetch](#typedfetchpath-init-payload), configured for the `TApi` type.

#### Arguments

- **TApi**: Web API's type declaration, having the endpoints' handler as properties and the endpoints' path and method as keys.
- **options**: Optional configuration parameters.

  | name    | type    | default     | description                                                |
  | ------- | ------- | ----------- | ---------------------------------------------------------- |
  | baseUrl | string? | `undefined` | A string that will be prepended to all fetch requests' URL |

#### Example

```javascript
const typedFetch = getTypedFetch<MyApiType>();
```

---

### typedFetch(path, init, [payload])

#### Returns

The Promise that results from calling `fetch` with the corresponding path and init parameters.

#### Arguments

- **path**: The target API endpoint's path.
- **init**: An object containing custom settings that will be applied to the `fetch` request (i.e. `headers`). Note that the `method` property is mandatory, as it is necessary to resolve the target endpoint's return type.
- **payload**: An optional object containing data that will be sent with the `fetch` request.

  | name     | type                       | default     | description                                                                                                                                                                                                                                                                  |
  | -------- | -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | jsonBody | any?                       | `undefined` | Only available when using [typed request payload](#typed-request-payload) with `jsonBody`. Non serialized request's body that will be stringified (i.e. `JSON.stringify`) and sent to the server. Requires including the `Content-Type` header with `application/json` value |
  | params   | { [key: string]: string }? | `undefined` | Key-value dictionary that can be used to replace express URL parameters in the request's URL (see `paramsResponse` example). Mandatory when using [typed request payload](#typed-request-payload) with `query`                                                               |
  | query    | { [key: string]: string }? | `undefined` | Key-value dictionary that can be used to prepend query string parameters to the URL (see `queryResponse` example). Mandatory when using [typed request payload](#typed-request-payload) with `params`                                                                        |

#### Example

```javascript
const response = await typedFetch('/my/path', { method: 'get' });

const paramsResponse = await typedFetch(
  '/my/path/:name',
  { method: 'get' },
  { params: { name: 'Jena' } }
);
// Will generate a request URL of "/my/path/Jena"

const queryResponse = await typedFetch('/my/path', { method: 'get' }, { query: { name: 'Jena' } });
// Will generate a request URL of "/my/path?name=Jena"
```

## Typed request payload

`@express-typed-api` allows specifying the type of the requests' payload (i.e. `query`, `params` and `body`) by providing an optional second type parameter to `EndpointHandler`, containing any combination of `jsonBody`, `params` and/or `query` types.

```typescript
import { EndpointHandler } from '@express-typed-api/common';

export type GetWeatherEndpoint = EndpointHandler<
  | {
      temperature: number;
      /* other weather properties */
    }
  | {
      errorMessage: string;
    },
  {
    params: { cityName: string };
  }
>;

export type WeatherApi = {
  '/api/weather/:cityName': {
    get: GetWeatherEndpoint;
  };
};
```

The types will then be enforced on both client requests and server endpoint handlers:

- **Client**

  ![](/readme/typed-request-payload-client.png)

- **Server**

  ![](/readme/typed-request-payload-server.png)
