import {
  ApiEndpoints,
  ComposedEndpointHandler,
  EndpointHandler,
  EndpointMethod,
} from '@express-typed-api/common';
import express from 'express';

const jsonEndpoint = <T>(
  endpoint: EndpointHandler<T> | ComposedEndpointHandler<T>
): express.RequestHandler[] => {
  const { handler, middleware } =
    'handler' in endpoint ? endpoint : { handler: endpoint, middleware: undefined };

  const adapter: express.RequestHandler = (req, res, next) => {
    const { payload, status } = handler(req, res, next);
    if (status) {
      res.status(status);
    }
    res.json(payload);
  };

  return middleware ? middleware(adapter) : [adapter];
};

export const publishApi = <T extends ApiEndpoints>(
  app: express.Express | express.Router,
  apiEndpoints: T
) => {
  Object.keys(apiEndpoints).forEach((path) => {
    const availableMethods = apiEndpoints[path];
    Object.keys(availableMethods)
      .map((method) => method as EndpointMethod)
      .forEach((method) => {
        const endpoint = availableMethods[method]!;
        const handlers = jsonEndpoint(endpoint);
        (<express.Express>app)[method](path, ...handlers);
      });
  });
};
