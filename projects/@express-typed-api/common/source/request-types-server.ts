import express from 'express';
import {
  JsonBodyOnly,
  JsonBody_Params,
  JsonBody_Params_Query,
  JsonBody_Query,
  EHRequestDefinition,
  ParamsOnly,
  Params_Query,
  QueryOnly,
} from './request-types-definition';

export type EHServerRequest<TDefinition extends EHRequestDefinition = {}> = UntypedRequestHandler &
  ServerRequestMembers<TDefinition>;

export type ServerRequestMembers<TDefinition extends EHRequestDefinition = {}> =
  TDefinition extends JsonBody_Params_Query<infer TBody, infer TParams, infer TQuery>
    ? {
        body: TBody | undefined;
        params: TParams;
        query: TQuery;
      }
    : TDefinition extends JsonBody_Params<infer TBody, infer TParams>
    ? {
        body: TBody | undefined;
        params: TParams;
        query: express.Request['query'];
      }
    : TDefinition extends JsonBody_Query<infer TBody, infer TQuery>
    ? {
        body: TBody | undefined;
        params: express.Request['params'];
        query: TQuery;
      }
    : TDefinition extends Params_Query<infer TParams, infer TQuery>
    ? {
        body: express.Request['body'];
        params: TParams;
        query: TQuery;
      }
    : TDefinition extends JsonBodyOnly<infer TBody>
    ? {
        body: TBody | undefined;
        params: express.Request['params'];
        query: express.Request['query'];
      }
    : TDefinition extends ParamsOnly<infer TParams>
    ? {
        body: express.Request['body'];
        params: TParams;
        query: express.Request['query'];
      }
    : TDefinition extends QueryOnly<infer TQuery>
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

export type UntypedRequestHandler = Omit<Omit<Omit<express.Request, 'body'>, 'params'>, 'query'>;
