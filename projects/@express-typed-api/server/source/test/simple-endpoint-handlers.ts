import { EndpointHandler, EndpointResponse } from '@express-typed-api/common';

const A: EndpointHandler<any> = (_req, _res, _next) => new EndpointResponse('A');

const B: EndpointHandler<any> = (_req, _res, _next) => new EndpointResponse('B');

const C: EndpointHandler<any> = (_req, _res, _next) => new EndpointResponse('C');

const D: EndpointHandler<any> = (_req, _res, _next) => new EndpointResponse('D');

const E: EndpointHandler<any> = (_req, _res, _next) => new EndpointResponse('E');

export const apiDefinition = {
  '/api/sample': {
    get: A,
    post: B,
    put: C,
    delete: D,
    patch: E,
  },
};
