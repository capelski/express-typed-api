import {
  ApiEndpoints,
  ComposedEndpointHandler,
  Dictionary,
  EndpointHandler,
} from '@express-typed-api/common';

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: () => Promise<T>;
};

export type TypedRequestInit<T> = RequestInit & {
  method: T;
};

export const getTypedFetch = <T extends ApiEndpoints>() => {
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is not available in this context. Are you running it on a browser?');
  }

  return function typedFetch<TPath extends keyof T, TMethod extends keyof T[TPath]>(
    path: TPath,
    init: TypedRequestInit<TMethod>,
    options: { queryString?: Dictionary<string>; urlParams?: Dictionary<string> } = {}
  ) {
    const queryUrl = options.queryString
      ? <string>path + '?' + new URLSearchParams(options.queryString).toString()
      : <string>path;

    const paramUrl = options.urlParams
      ? Object.keys(options.urlParams).reduce((reduced, paramName) => {
          const paramValue = options.urlParams![paramName];
          return reduced.replace(`:${paramName}`, paramValue);
        }, queryUrl)
      : queryUrl;

    return fetch(paramUrl, init) as Promise<
      TypedResponse<
        T[TPath][TMethod] extends EndpointHandler<infer U>
          ? U
          : T[TPath][TMethod] extends ComposedEndpointHandler<infer U>
          ? U
          : unknown
      >
    >;
  };
};
