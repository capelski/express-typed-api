import {
  ApiEndpoints,
  BodyOnly,
  BodyParams,
  BodyParamsQuery,
  BodyQuery,
  EHRequestDefinition,
  EndpointHandler,
  EndpointHandlerResponse,
  EndpointHandlerWithMiddleware,
  ParamsOnly,
  ParamsQuery,
  QueryOnly,
} from '@express-typed-api/common';

export type Dictionary<TValue, TKey extends string | symbol | number = string> = {
  [K in TKey]: TValue;
};

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: () => Promise<T>;
};

export type TypedRequestInit<TMethod> = Omit<RequestInit, 'method'> & {
  method: TMethod;
};

export type TypedRequestInitWithBody<TMethod, TBody> = Omit<TypedRequestInit<TMethod>, 'body'> & {
  body: TBody;
};

export type EHClientArguments<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = TApi[TPath][TMethod] extends EndpointHandler<infer _TResponse, infer TDefinition>
  ? EHClientArgumentsInternal<TApi, TPath, TMethod, TDefinition>
  : TApi[TPath][TMethod] extends EndpointHandlerWithMiddleware<infer _TResponse, infer TDefinition>
  ? EHClientArgumentsInternal<TApi, TPath, TMethod, TDefinition>
  : EHClientArgumentsInternal<TApi, TPath, TMethod>;

type EHClientArgumentsInternal<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath],
  TDefinition extends EHRequestDefinition = {}
> = { path: TPath } & (TDefinition extends BodyParamsQuery<infer TBody, infer TParams, infer TQuery>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
      params: TParams;
      query: TQuery;
    }
  : TDefinition extends BodyParams<infer TBody, infer TParams>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
      params: TParams;
      query?: Dictionary<string>;
    }
  : TDefinition extends BodyQuery<infer TBody, infer TQuery>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
      params?: Dictionary<string>;
      query: TQuery;
    }
  : TDefinition extends ParamsQuery<infer TParams, infer TQuery>
  ? {
      init: TypedRequestInit<TMethod>;
      params: TParams;
      query: TQuery;
    }
  : TDefinition extends BodyOnly<infer TBody>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
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

export const getTypedFetch = <TApi extends ApiEndpoints>() => {
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is not available in this context. Are you running it on a browser?');
  }
  return getTypedFetchCore<TApi>(fetch);
};

// Internal function for testing purposes
export const getTypedFetchCore = <TApi extends ApiEndpoints>(fetchDependency: Window['fetch']) => {
  return function typedFetch<TPath extends keyof TApi, TMethod extends keyof TApi[TPath]>(
    args: EHClientArguments<TApi, TPath, TMethod>
  ) {
    const { init, path } = args;
    const body = 'body' in init ? init.body : undefined;
    const params = 'params' in args ? args.params : undefined;
    const query = 'query' in args ? args.query : undefined;

    const paramUrl = params
      ? Object.keys(params).reduce((reduced, paramName) => {
          const paramValue = params[paramName];
          return reduced.replace(`:${paramName}`, paramValue);
        }, <string>path)
      : <string>path;

    const queryUrl =
      query && Object.keys(query).length > 0
        ? paramUrl + '?' + new URLSearchParams(query).toString()
        : paramUrl;

    return fetchDependency(queryUrl, {
      ...init,
      body: body ? JSON.stringify(body) : undefined,
      method: <string>init.method,
    }) as Promise<TypedResponse<EndpointHandlerResponse<TApi, TPath, TMethod>>>;
  };
};
