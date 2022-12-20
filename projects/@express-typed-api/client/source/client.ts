import {
  ApiEndpoints,
  EndpointHandlerRequestBody,
  EndpointHandlerRequestParams,
  EndpointHandlerRequestQuery,
  EndpointHandlerResponse,
} from '@express-typed-api/common';
import express from 'express';

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: () => Promise<T>;
};

export type TypedRequestInit<TMethod, TBody = express.Request['body']> = Omit<
  Omit<RequestInit, 'body'>,
  'method'
> & {
  body?: TBody;
  method: TMethod;
};

export type TypedFetchArguments = Parameters<ReturnType<typeof getTypedFetchCore>>;

export const getTypedFetch = <T extends ApiEndpoints>() => {
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is not available in this context. Are you running it on a browser?');
  }
  return getTypedFetchCore<T>(fetch);
};

// Internal function for testing purposes
export const getTypedFetchCore = <T extends ApiEndpoints>(fetchDependency: Window['fetch']) => {
  return function typedFetch<TPath extends keyof T, TMethod extends keyof T[TPath]>(
    path: TPath,
    init: TypedRequestInit<TMethod, EndpointHandlerRequestBody<T, TPath, TMethod>>,
    options: {
      queryString?: EndpointHandlerRequestQuery<T, TPath, TMethod>;
      urlParams?: EndpointHandlerRequestParams<T, TPath, TMethod>;
    } = {}
  ) {
    const queryUrl =
      options.queryString && Object.keys(options.queryString).length > 0
        ? <string>path + '?' + new URLSearchParams(options.queryString).toString()
        : <string>path;

    const paramUrl = options.urlParams
      ? Object.keys(options.urlParams).reduce((reduced, paramName) => {
          const paramValue = options.urlParams![paramName];
          return reduced.replace(`:${paramName}`, paramValue);
        }, queryUrl)
      : queryUrl;

    return fetchDependency(paramUrl, {
      ...init,
      body: JSON.stringify(init.body),
      method: <string>init.method,
    }) as Promise<TypedResponse<EndpointHandlerResponse<T, TPath, TMethod>>>;
  };
};
