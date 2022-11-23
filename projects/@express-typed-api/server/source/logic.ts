import {
  AdditionalMiddleware,
  ApiEndpoints,
  EndpointHandler,
  EndpointMethod,
} from '@express-typed-api/common';
import express from 'express';

const jsonEndpoint = <T>(
  endpointHandler: EndpointHandler<T>,
  middleware?: AdditionalMiddleware
): express.RequestHandler[] => {
  const handler: express.RequestHandler = (req, res, next) => {
    const { payload, status } = endpointHandler(req, res, next);
    if (status) {
      res.status(status);
    }
    res.json(payload);
  };
  return middleware ? middleware(handler) : [handler];
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
        const handlers = jsonEndpoint(endpoint.handler, endpoint.middleware);
        (<express.Express>app)[method](path, ...handlers);
      });
  });
};
