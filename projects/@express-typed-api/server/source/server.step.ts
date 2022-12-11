import {
  ApiEndpoints,
  ComposedEndpointHandler,
  EndpointHandler,
  EndpointMethod,
  EndpointResponse,
} from '@express-typed-api/common';
import { After, Before, Given, Then, When } from '@cucumber/cucumber';
import express from 'express';
import sinon, { SinonSpy } from 'sinon';
import { publishApiCore, PublishedEndpoint, wrapHandler } from './server';
import { expect } from 'chai';
import { ICucumberDataTable } from './cucumber-data-table';

let app: express.Express;
let appSpies: {
  [key: string]: {
    callIndex: number;
    spy: SinonSpy;
  };
};
let apiDefinition: ApiEndpoints;
let endpoints: {
  [key: string]: {
    [key: string]: {
      name: string;
      endpoint: EndpointHandler<any> | ComposedEndpointHandler<any>;
    };
  };
};
let publishedEndpoints: PublishedEndpoint[];
let wrapHandlerSpy: {
  callIndex: number;
  spy: SinonSpy;
};

Before(() => {
  app = undefined!;
  appSpies = undefined!;
  apiDefinition = undefined!;
  endpoints = {};
  publishedEndpoints = undefined!;
  wrapHandlerSpy = {
    callIndex: 0,
    spy: sinon.spy(wrapHandler),
  };
});

Given('an express app and an API definition', () => {
  app = express();
  apiDefinition = {};
  appSpies = {
    get: { callIndex: 0, spy: sinon.spy(app, 'get') },
    post: { callIndex: 0, spy: sinon.spy(app, 'post') },
    put: { callIndex: 0, spy: sinon.spy(app, 'put') },
    delete: { callIndex: 0, spy: sinon.spy(app, 'delete') },
    patch: { callIndex: 0, spy: sinon.spy(app, 'patch') },
  };
});

Given(
  /having an endpoint "(.*)" with path "(.*)" and method "(.*)"/,
  (name: string, path: string, method: EndpointMethod) => {
    endpoints[path] = endpoints[path] || {};
    endpoints[path][method] = {
      name,
      endpoint: (_req, _res, _next) => new EndpointResponse('any'),
    };

    apiDefinition[path] = apiDefinition[path] || {};
    apiDefinition[path][method] = endpoints[path][method].endpoint;
  }
);

When('calling publishApi with the express app and the API definition', () => {
  publishedEndpoints = publishApiCore(wrapHandlerSpy.spy)(app, apiDefinition);
});

Then(
  /the express app "(.*)" method is called with "(.*)" and endpoint "(.*)"/,
  (method: EndpointMethod, path: string, name: string) => {
    const methodSpy = appSpies[method];
    expect(methodSpy).to.not.equal(undefined, `Invalid method "${method}"`);
    const methodCall = methodSpy.spy.getCall(methodSpy.callIndex);
    methodSpy.callIndex++;
    expect(methodCall).to.not.equal(
      null,
      `Method "${method}" was not called ${methodSpy.callIndex} time(s)`
    );
    expect(methodCall.args[0]).to.equal(path);

    const wrapHandlerCall = wrapHandlerSpy.spy.getCall(wrapHandlerSpy.callIndex);
    wrapHandlerSpy.callIndex++;
    expect(wrapHandlerCall).to.not.equal(null);
    const actualEndpoint = endpoints[path][method];
    expect(wrapHandlerCall.args[0]).to.equal(
      actualEndpoint.endpoint,
      `Expected endpoint ${name} but got ${actualEndpoint.name} instead`
    );
  }
);

Then('no method is called on the express app', function () {
  expect(appSpies.get.spy.getCalls()).to.have.length(0);
  expect(appSpies.post.spy.getCalls()).to.have.length(0);
  expect(appSpies.put.spy.getCalls()).to.have.length(0);
  expect(appSpies.delete.spy.getCalls()).to.have.length(0);
  expect(appSpies.patch.spy.getCalls()).to.have.length(0);
});

Then('the following published endpoints list is returned', (dataTable: ICucumberDataTable) => {
  const expectedPublishedEndpoints = dataTable.rawTable.map((row) => {
    return {
      method: row[1],
      path: row[0],
    };
  });

  const actualEndpoints = publishedEndpoints.map((endpoint) => {
    return {
      method: endpoint.method,
      path: endpoint.path,
    };
  });

  expect(actualEndpoints).to.deep.equal(expectedPublishedEndpoints);
});

Then('no published endpoints are returned', () => {
  expect(publishedEndpoints).to.have.length(0);
});

After(() => {
  sinon.restore();
});
