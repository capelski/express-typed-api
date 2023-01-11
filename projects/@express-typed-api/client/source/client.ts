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
  baseUrl?: string;
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

type TypedFetchArguments<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath],
  TDefinition extends EHRequestDefinition = {}
> = TDefinition extends JsonBody_Params_Query<infer TBody, infer TParams, infer TQuery>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInitJsonBody<TMethod>,
      {
        jsonBody: TBody;
        params: TParams;
        query: TQuery;
      }
    >
  : TDefinition extends JsonBody_Params<infer TBody, infer TParams>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInitJsonBody<TMethod>,
      {
        jsonBody: TBody;
        params: TParams;
        query?: Dictionary<string>;
      }
    >
  : TDefinition extends JsonBody_Query<infer TBody, infer TQuery>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInitJsonBody<TMethod>,
      {
        jsonBody: TBody;
        params?: Dictionary<string>;
        query?: Dictionary<string>;
      }
    >
  : TDefinition extends Params_Query<infer TParams, infer TQuery>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInit<TMethod>,
      {
        params: TParams;
        query: TQuery;
      }
    >
  : TDefinition extends JsonBodyOnly<infer TBody>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInitJsonBody<TMethod>,
      {
        jsonBody: TBody;
        params?: Dictionary<string>;
        query?: Dictionary<string>;
      }
    >
  : TDefinition extends ParamsOnly<infer TParams>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInit<TMethod>,
      {
        params: TParams;
        query?: Dictionary<string>;
      }
    >
  : TDefinition extends QueryOnly<infer TQuery>
  ? TypedFetchArgumentsNamed<
      TPath,
      TypedRequestInit<TMethod>,
      {
        params?: Dictionary<string>;
        query: TQuery;
      }
    >
  : [
      path: TPath,
      init: TypedRequestInit<TMethod>,
      payload?: {
        params?: Dictionary<string>;
        query?: Dictionary<string>;
      }
    ];

type TypedFetchArgumentsNamed<TPath, TInit, TOptions> = [
  path: TPath,
  init: TInit,
  payload: TOptions
];

type TypedFetchArgumentsWrapper<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = TApi[TPath][TMethod] extends EndpointHandler<infer _TResponse, infer TDefinition>
  ? TypedFetchArguments<TApi, TPath, TMethod, TDefinition>
  : TApi[TPath][TMethod] extends EndpointHandlerWithMiddleware<infer _TResponse, infer TDefinition>
  ? TypedFetchArguments<TApi, TPath, TMethod, TDefinition>
  : TypedFetchArguments<TApi, TPath, TMethod>;

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
    ...args: TypedFetchArgumentsWrapper<TApi, TPath, TMethod>
  ) {
    const [path, init, payload] = args;
    const jsonBody = payload && 'jsonBody' in payload ? payload.jsonBody : undefined;
    const params = payload && 'params' in payload ? payload.params : undefined;
    const query = payload && 'query' in payload ? payload.query : undefined;

    const prefixedUrl = options.baseUrl ? options.baseUrl + <string>path : <string>path;

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
