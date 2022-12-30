import express from 'express';
import {
  BodyOnly,
  BodyParams,
  BodyParamsQuery,
  BodyQuery,
  EHRequestDefinition,
  ParamsOnly,
  ParamsQuery,
  QueryOnly,
} from './request-types-definition';

export type EHServerRequest<TDefinition extends EHRequestDefinition = {}> = UntypedRequestHandler &
  ServerRequestMembers<TDefinition>;

export type ServerRequestMembers<TDefinition extends EHRequestDefinition = {}> =
  TDefinition extends BodyParamsQuery<infer TBody, infer TParams, infer TQuery>
    ? {
        body: TBody | undefined;
        params: TParams;
        query: TQuery;
      }
    : TDefinition extends BodyParams<infer TBody, infer TParams>
    ? {
        body: TBody | undefined;
        params: TParams;
        query: express.Request['query'];
      }
    : TDefinition extends BodyQuery<infer TBody, infer TQuery>
    ? {
        body: TBody | undefined;
        params: express.Request['params'];
        query: TQuery;
      }
    : TDefinition extends ParamsQuery<infer TParams, infer TQuery>
    ? {
        body: express.Request['body'];
        params: TParams;
        query: TQuery;
      }
    : TDefinition extends BodyOnly<infer TBody>
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

type a = ServerRequestMembers<{ query: { cityName: string } }>;

export type UntypedRequestHandler = Omit<Omit<Omit<express.Request, 'body'>, 'params'>, 'query'>;
