import {
  ApiEndpoints,
  ComposedEndpointHandler,
  EndpointHandler,
  EndpointMethod,
} from '@express-typed-api/common';
import express from 'express';

export type PublishedEndpoint = {
  method: EndpointMethod;
  handlers: express.RequestHandler[];
  path: string;
};

type WrapHandler = <T>(
  endpoint: EndpointHandler<T> | ComposedEndpointHandler<T>
) => express.RequestHandler[];

const allMethods: string[] = Object.values(EndpointMethod);

export const publishApi = <T extends ApiEndpoints>(
  app: express.Express | express.Router,
  apiEndpoints: T
) => {
  return publishApiCore(wrapHandler)(app, apiEndpoints);
};

// Internal function for testing purposes
export const publishApiCore =
  (wrapHandlerDependency: WrapHandler) =>
  <T extends ApiEndpoints>(
    app: express.Express | express.Router,
    apiEndpoints: T
  ): PublishedEndpoint[] => {
    return Object.keys(apiEndpoints).reduce<PublishedEndpoint[]>((apiReduced, path) => {
      const pathMethods = apiEndpoints[path];
      const pathEndpoints = Object.keys(pathMethods)
        .filter((method) => allMethods.includes(method))
        .map((method) => method as EndpointMethod)
        .reduce<PublishedEndpoint[]>((pathReduced, method) => {
          const handlers = wrapHandlerDependency(pathMethods[method]!);
          const publishedEndpoint: PublishedEndpoint = {
            handlers,
            method,
            path,
          };

          (<express.Express>app)[method](path, ...handlers);

          return pathReduced.concat([publishedEndpoint]);
        }, []);

      return apiReduced.concat(pathEndpoints);
    }, []);
  };

export const wrapHandler = <T>(
  endpoint: EndpointHandler<T> | ComposedEndpointHandler<T>
): express.RequestHandler[] => {
  const { handler, middleware } =
    'handler' in endpoint ? endpoint : { handler: endpoint, middleware: undefined };

  const adapter = {
    [handler.name]: <express.RequestHandler>((req, res, next) => {
      const { payload, status } = handler(req, res, next);
      if (status) {
        res.status(status);
      }
      res.json(payload);
    }),
  };

  return middleware ? middleware(adapter[handler.name]) : [adapter[handler.name]];
};
