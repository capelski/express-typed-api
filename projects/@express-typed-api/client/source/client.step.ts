import { After, Before, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { getTypedFetchCore, TypedFetchArguments, TypedRequestInit } from './client';

type Dictionary<TValue, TKey extends string | symbol | number = string> = {
  [K in TKey]: TValue;
};

let fetchSpy: SinonSpy;
let queryString: Dictionary<string>;
let requestInit: TypedRequestInit<any>;
let requestUrl: string;
let typedFetch: (...args: TypedFetchArguments) => any;
let urlParams: Dictionary<string>;

Before(() => {
  fetchSpy = undefined!;
  queryString = {};
  requestInit = { method: 'get' };
  requestUrl = undefined!;
  typedFetch = undefined!;
  urlParams = {};
});

Given('an instance of typedFetch', () => {
  (fetchSpy = sinon.spy()), (typedFetch = getTypedFetchCore(fetchSpy));
});

Given(/a url "(.*)"/, (url: string) => {
  requestUrl = url;
});

Given(/a RequestInit object "(.*)"/, (name: string) => {
  requestInit.method = name;
});

Given(/a queryString parameter "(.*)" with value "(.*)"/, (name: string, value: string) => {
  queryString[name] = value;
});

Given(/a url parameter "(.*)" with value "(.*)"/, (name: string, value: string) => {
  urlParams[name] = value;
});

When('calling typedFetch with the described parameters', () => {
  typedFetch(requestUrl, requestInit, { queryString, urlParams });
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

After(() => {
  sinon.restore();
});
