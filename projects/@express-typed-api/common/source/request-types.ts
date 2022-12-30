import express from 'express';
import { ApiEndpoints, EndpointHandler, EndpointHandlerWithMiddleware } from './common';

export type EndpointHandlerRequest<TDefinition extends EHRequestPartialDefinition> = Omit<
  Omit<Omit<express.Request, 'body'>, 'params'>,
  'query'
> &
  EHRequestDefinition<TDefinition>;

export type EndpointHandlerRequestBody<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = EndpointHandlerRequestMembers<TApi, TPath, TMethod>['body'];

type EndpointHandlerRequestMembers<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = TApi[TPath][TMethod] extends EndpointHandler<infer _X, infer TMembers>
  ? EHRequestDefinition<TMembers>
  : TApi[TPath][TMethod] extends EndpointHandlerWithMiddleware<infer _X, infer TMembers>
  ? EHRequestDefinition<TMembers>
  : EHRequestDefinition;

export type EndpointHandlerRequestParams<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = EndpointHandlerRequestMembers<TApi, TPath, TMethod>['params'];

export type EndpointHandlerRequestQuery<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath]
> = EndpointHandlerRequestMembers<TApi, TPath, TMethod>['query'];

/* Partial request members types */

export type BodyOnly<TBody> = {
  body: TBody;
};

export type ParamsOnly<TParams> = {
  params: TParams;
};

export type QueryOnly<TQuery> = {
  query: TQuery;
};

export type BodyParams<TBody, TParams> = BodyOnly<TBody> & ParamsOnly<TParams>;

export type BodyQuery<TBody, TQuery> = BodyOnly<TBody> & QueryOnly<TQuery>;

export type ParamsQuery<TParams, TQuery> = ParamsOnly<TParams> & QueryOnly<TQuery>;

export type BodyParamsQuery<TBody, TParams, TQuery> = BodyOnly<TBody> &
  ParamsOnly<TParams> &
  QueryOnly<TQuery>;

export type EHRequestPartialDefinition =
  | {}
  | BodyOnly<any>
  | ParamsOnly<any>
  | QueryOnly<any>
  | BodyParams<any, any>
  | BodyQuery<any, any>
  | ParamsQuery<any, any>
  | BodyParamsQuery<any, any, any>;

/* Request members type inferring */

export type EHRequestDefinition<X extends EHRequestPartialDefinition = {}> =
  X extends BodyParamsQuery<infer TBody, infer TParams, infer TQuery>
    ? {
        body: TBody | undefined;
        params: TParams;
        query: TQuery;
      }
    : X extends BodyParams<infer TBody, infer TParams>
    ? {
        body: TBody | undefined;
        params: TParams;
        query: express.Request['query'];
      }
    : X extends BodyQuery<infer TBody, infer TQuery>
    ? {
        body: TBody | undefined;
        params: express.Request['params'];
        query: TQuery;
      }
    : X extends ParamsQuery<infer TParams, infer TQuery>
    ? {
        body: express.Request['body'];
        params: TParams;
        query: TQuery;
      }
    : X extends BodyOnly<infer TBody>
    ? {
        body: TBody | undefined;
        params: express.Request['params'];
        query: express.Request['query'];
      }
    : X extends ParamsOnly<infer TParams>
    ? {
        body: express.Request['body'];
        params: TParams;
        query: express.Request['query'];
      }
    : X extends QueryOnly<infer TQuery>
    ? {
        body: express.Request['body'];
        params: express.Request['params'];
        query: TQuery;
      }
    : {
        body: express.Request['body'];
        params: any; // express.Request['params']; TODO
        query: any; // express.Request['query'];
      };
