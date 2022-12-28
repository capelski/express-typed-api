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
      params?: EndpointHandlerRequestParams<T, TPath, TMethod>;
      query?: EndpointHandlerRequestQuery<T, TPath, TMethod>;
    } = {}
  ) {
    const paramUrl = options.params
      ? Object.keys(options.params).reduce((reduced, paramName) => {
          const paramValue = options.params![paramName];
          return reduced.replace(`:${paramName}`, paramValue);
        }, <string>path)
      : <string>path;

    const queryUrl =
      options.query && Object.keys(options.query).length > 0
        ? paramUrl + '?' + new URLSearchParams(options.query).toString()
        : paramUrl;

    return fetchDependency(queryUrl, {
      ...init,
      body: JSON.stringify(init.body),
      method: <string>init.method,
    }) as Promise<TypedResponse<EndpointHandlerResponse<T, TPath, TMethod>>>;
  };
};
