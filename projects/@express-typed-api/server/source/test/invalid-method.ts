import { EndpointResponse } from '@express-typed-api/common';

export const apiDefinition = {
  '/api/sample': {
    invalid: () => new EndpointResponse('A'),
  },
};
