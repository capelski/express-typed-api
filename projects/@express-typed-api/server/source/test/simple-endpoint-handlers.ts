import { EndpointHandler, EndpointResponse } from '@express-typed-api/common';

const A: EndpointHandler<string> = (_req, _res, _next) => new EndpointResponse('A');

const B: EndpointHandler<string> = (_req, _res, _next) => new EndpointResponse('B');

const C: EndpointHandler<string> = (_req, _res, _next) => new EndpointResponse('C');

const D: EndpointHandler<string> = (_req, _res, _next) => new EndpointResponse('D');

const E: EndpointHandler<string> = (_req, _res, _next) => new EndpointResponse('E');

export const apiDefinition = {
  '/api/sample': {
    get: A,
    post: B,
    put: C,
    delete: D,
    patch: E,
  },
};
