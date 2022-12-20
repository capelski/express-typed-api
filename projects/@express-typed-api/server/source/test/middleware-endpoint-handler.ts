import { EndpointHandlerWithMiddleware, EndpointResponse } from '@express-typed-api/common';
import express from 'express';

export const apiDefinition = {
  '/api/sample': {
    post: <EndpointHandlerWithMiddleware<string>>{
      handler: function A(_req, _res, _next) {
        return new EndpointResponse('A');
      },
      middleware: (handler) => {
        return [express.json(), handler];
      },
    },
  },
};
