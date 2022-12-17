import {
  ComposedEndpointHandler,
  EndpointHandler,
  EndpointResponse,
} from '@express-typed-api/common';
import express from 'express';

const A: EndpointHandler<any> = (_req, _res, _next) => new EndpointResponse('A');

export const apiDefinition = {
  '/api/sample': {
    post: <ComposedEndpointHandler<any>>{
      handler: A,
      middleware: (handler) => {
        return [express.json(), handler];
      },
    },
  },
};
