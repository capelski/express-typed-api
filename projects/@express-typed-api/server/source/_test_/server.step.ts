import { After, Before, Given, Then, When } from '@cucumber/cucumber';
import { ApiEndpoints, EndpointMethod } from '@express-typed-api/common';
import { expect } from 'chai';
import express from 'express';
import sinon, { SinonSpy } from 'sinon';
import { publishApi, PublishedEndpoint } from '../server';
import { ICucumberDataTable } from './cucumber-data-table';

let app: express.Express;
let appSpies: {
  [key: string]: {
    callIndex: number;
    spy: SinonSpy;
  };
};
let apiDefinition: ApiEndpoints;
let publishedEndpoints: PublishedEndpoint[];

Before(() => {
  app = undefined!;
  appSpies = undefined!;
  apiDefinition = undefined!;
  publishedEndpoints = undefined!;
});

Given('a new express app', () => {
  app = express();
  appSpies = {
    get: { callIndex: 0, spy: sinon.spy(app, 'get') },
    post: { callIndex: 0, spy: sinon.spy(app, 'post') },
    put: { callIndex: 0, spy: sinon.spy(app, 'put') },
    delete: { callIndex: 0, spy: sinon.spy(app, 'delete') },
    patch: { callIndex: 0, spy: sinon.spy(app, 'patch') },
  };
});

Given(/the API definition in "(.*)"/, (filename: string) => {
  apiDefinition = require(`./${filename}`).apiDefinition;
});

When('calling publishApi', () => {
  publishedEndpoints = publishApi(app, apiDefinition);
});

When(/calling publishApi with "(.*)" prefix/, (prefix: string) => {
  publishedEndpoints = publishApi(app, apiDefinition, { prefix });
});

Then(
  /the express app "(.*)" method is called with "(.*)" and handlers? "(.*)"/,
  (method: EndpointMethod, path: string, handlersName: string) => {
    const methodSpy = appSpies[method];
    expect(methodSpy).not.to.equal(undefined, `Invalid method "${method}"`);
    const methodCall = methodSpy.spy.getCall(methodSpy.callIndex);
    methodSpy.callIndex++;
    expect(methodCall).not.to.equal(
      null,
      `Method "${method}" was not called ${methodSpy.callIndex} time(s)`
    );
    const [actualPath, ...handlers] = methodCall.args;
    const actualNames = handlers.map((h) => h.name).join(',');

    expect(actualPath).to.equal(path);
    expect(actualNames).to.equal(handlersName);
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
      handlers: row[2],
      path: row[0],
    };
  });

  const actualEndpoints = publishedEndpoints.map((endpoint) => {
    return {
      method: endpoint.method,
      handlers: endpoint.handlers.map((h) => h.name).join(','),
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
