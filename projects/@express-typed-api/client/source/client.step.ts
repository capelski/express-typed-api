import { After, Before, Given, Then, When } from '@cucumber/cucumber';
import { EndpointHandler, EndpointMethod } from '@express-typed-api/common';
import { expect } from 'chai';
import express from 'express';
import sinon, { SinonSpy } from 'sinon';
import { getTypedFetchCore, TypedRequestInitWithBody } from './client';

type TestApi = {
  [path: string]: {
    [method in EndpointMethod]: EndpointHandler<any, { body: any; params: any; query: any }>;
  };
};

let fetchSpy: SinonSpy;
let params: express.Request['params'];
let query: express.Request['query'];
let requestInit: TypedRequestInitWithBody<any, any>;
let requestUrl: string;
let typedFetch: (...args: Parameters<ReturnType<typeof getTypedFetchCore<TestApi>>>) => any;

Before(() => {
  fetchSpy = undefined!;
  params = {};
  query = {};
  requestInit = { body: undefined, method: 'get' };
  requestUrl = undefined!;
  typedFetch = undefined!;
});

Given('an instance of typedFetch', () => {
  (fetchSpy = sinon.spy()), (typedFetch = getTypedFetchCore<TestApi>(fetchSpy));
});

Given(/a url "(.*)"/, (url: string) => {
  requestUrl = url;
});

Given(/a RequestInit object "(.*)"/, (name: string) => {
  requestInit.method = name;
});

Given(/a queryString parameter "(.*)" with value "(.*)"/, (name: string, value: string) => {
  query[name] = value;
});

Given(/a url parameter "(.*)" with value "(.*)"/, (name: string, value: string) => {
  params[name] = value;
});

Given(
  /a body object containing a "(.*)" property with value "(.*)"/,
  (name: string, value: string) => {
    requestInit.body = requestInit.body || {};
    requestInit.body[name] = value;
  }
);

When('calling typedFetch with the described parameters', () => {
  typedFetch({
    path: requestUrl,
    init: requestInit,
    params,
    query,
  });
});

Then('window.fetch is called', () => {
  const call = fetchSpy.getCall(0);
  expect(call).not.to.equal(null, `window.fetch was not called`);
});

Then(/gets url "(.*)" as first parameter/, (url: string) => {
  const call = fetchSpy.getCall(0);
  expect(call).not.to.equal(null, `window.fetch was not called`);

  expect(call.args[0]).to.equal(url);
});

Then(/gets RequestInit object "(.*)" as second parameter/, (name: string) => {
  const call = fetchSpy.getCall(0);
  expect(call).not.to.equal(null, `window.fetch was not called`);

  expect(call.args[1].method).to.equal(name);
});

Then(/gets '(.*)' as the body property of the second parameter/, (body: string) => {
  const call = fetchSpy.getCall(0);
  expect(call).not.to.equal(null, `window.fetch was not called`);

  expect(call.args[1].body).to.equal(body);
});

After(() => {
  sinon.restore();
});
