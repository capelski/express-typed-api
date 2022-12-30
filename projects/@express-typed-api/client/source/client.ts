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
import express from 'express';

export type TypedResponse<T> = Omit<Response, 'json'> & {
  json: () => Promise<T>;
};

export type TypedRequestInit<TMethod> = Omit<Omit<RequestInit, 'body'>, 'method'> & {
  method: TMethod;
};

export type TypedRequestInitWithBody<
  TMethod,
  TBody = express.Request['body']
> = TypedRequestInit<TMethod> & {
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
      options: {
        params: TParams;
        query: TQuery;
      };
    }
  : TDefinition extends BodyParams<infer TBody, infer TParams>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
      options: {
        params: TParams;
      };
    }
  : TDefinition extends BodyQuery<infer TBody, infer TQuery>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
      options: {
        query: TQuery;
      };
    }
  : TDefinition extends ParamsQuery<infer TParams, infer TQuery>
  ? {
      init: TypedRequestInit<TMethod>;
      options: {
        params: TParams;
        query: TQuery;
      };
    }
  : TDefinition extends BodyOnly<infer TBody>
  ? {
      init: TypedRequestInitWithBody<TMethod, TBody>;
    }
  : TDefinition extends ParamsOnly<infer TParams>
  ? {
      init: TypedRequestInit<TMethod>;
      options: {
        params: TParams;
      };
    }
  : TDefinition extends QueryOnly<infer TQuery>
  ? {
      init: TypedRequestInit<TMethod>;
      options: {
        query: TQuery;
      };
    }
  : {
      init: TypedRequestInit<TMethod>;
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
    const options = 'options' in args ? args.options : undefined;
    const params = options && 'params' in options ? options.params : undefined;
    const query = options && 'query' in options ? options.query : undefined;

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
