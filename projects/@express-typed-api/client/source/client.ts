import {
  ApiEndpoints,
  JsonBodyOnly,
  JsonBody_Params,
  JsonBody_Params_Query,
  JsonBody_Query,
  EHRequestDefinition,
  EndpointHandler,
  EndpointHandlerResponse,
  EndpointHandlerWithMiddleware,
  ParamsOnly,
  Params_Query,
  QueryOnly,
} from '@express-typed-api/common';

type Dictionary<TValue, TKey extends string | symbol | number = string> = {
  [K in TKey]: TValue;
};

export type GetTypedFetchOptions = {
  prefix?: string;
};

export type TypedRequestInit<TMethod> = Omit<RequestInit, 'method'> & {
  method: TMethod;
};

export type TypedRequestInitJsonBody<TMethod> = Omit<TypedRequestInit<TMethod>, 'body'> & {
  headers: {
    'Content-Type': 'application/json';
    [key: string]: string;
  };
};

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: () => Promise<T>;
};

type TypedFetchParametersWrapper<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = TApi[TPath][TMethod] extends EndpointHandler<infer _TResponse, infer TDefinition>
  ? TypedFetchParameters<TApi, TPath, TMethod, TDefinition>
  : TApi[TPath][TMethod] extends EndpointHandlerWithMiddleware<infer _TResponse, infer TDefinition>
  ? TypedFetchParameters<TApi, TPath, TMethod, TDefinition>
  : TypedFetchParameters<TApi, TPath, TMethod>;

type TypedFetchParameters<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath],
  TDefinition extends EHRequestDefinition = {}
> = { path: TPath } & (TDefinition extends JsonBody_Params_Query<
  infer TBody,
  infer TParams,
  infer TQuery
>
  ? {
      init: TypedRequestInitJsonBody<TMethod>;
      jsonBody: TBody;
      params: TParams;
      query: TQuery;
    }
  : TDefinition extends JsonBody_Params<infer TBody, infer TParams>
  ? {
      init: TypedRequestInitJsonBody<TMethod>;
      jsonBody: TBody;
      params: TParams;
      query?: Dictionary<string>;
    }
  : TDefinition extends JsonBody_Query<infer TBody, infer TQuery>
  ? {
      init: TypedRequestInitJsonBody<TMethod>;
      jsonBody: TBody;
      params?: Dictionary<string>;
      query: TQuery;
    }
  : TDefinition extends Params_Query<infer TParams, infer TQuery>
  ? {
      init: TypedRequestInit<TMethod>;
      params: TParams;
      query: TQuery;
    }
  : TDefinition extends JsonBodyOnly<infer TBody>
  ? {
      init: TypedRequestInitJsonBody<TMethod>;
      jsonBody: TBody;
      params?: Dictionary<string>;
      query?: Dictionary<string>;
    }
  : TDefinition extends ParamsOnly<infer TParams>
  ? {
      init: TypedRequestInit<TMethod>;
      params: TParams;
      query?: Dictionary<string>;
    }
  : TDefinition extends QueryOnly<infer TQuery>
  ? {
      init: TypedRequestInit<TMethod>;
      params?: Dictionary<string>;
      query: TQuery;
    }
  : {
      init: TypedRequestInit<TMethod>;
      params?: Dictionary<string>;
      query?: Dictionary<string>;
    });

export const getTypedFetch = <TApi extends ApiEndpoints>(options: GetTypedFetchOptions = {}) => {
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is not available in this context. Are you running it on a browser?');
  }
  return getTypedFetchCore<TApi>(fetch, options);
};

// Internal function for testing purposes
export const getTypedFetchCore = <TApi extends ApiEndpoints>(
  fetchDependency: Window['fetch'],
  options: GetTypedFetchOptions = {}
) => {
  return function typedFetch<TPath extends keyof TApi, TMethod extends keyof TApi[TPath]>(
    args: TypedFetchParametersWrapper<TApi, TPath, TMethod>
  ) {
    const { init, path } = args;
    const jsonBody = 'jsonBody' in args ? args.jsonBody : undefined;
    const params = 'params' in args ? args.params : undefined;
    const query = 'query' in args ? args.query : undefined;

    const prefixedUrl = options.prefix ? options.prefix + <string>path : <string>path;

    const paramUrl = params
      ? Object.keys(params).reduce((reduced, paramName) => {
          const paramValue = params[paramName];
          return reduced.replace(`:${paramName}`, paramValue);
        }, prefixedUrl)
      : prefixedUrl;

    const queryUrl =
      query && Object.keys(query).length > 0
        ? paramUrl + '?' + new URLSearchParams(query).toString()
        : paramUrl;

    const body = jsonBody ? JSON.stringify(jsonBody) : 'body' in init ? init.body : undefined;

    return fetchDependency(queryUrl, {
      ...init,
      body,
      method: <string>init.method,
    }) as Promise<TypedResponse<EndpointHandlerResponse<TApi, TPath, TMethod>>>;
  };
};
