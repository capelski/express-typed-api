import express from 'express';
import {
  EHRequestDefinition,
  EHRequestPartialDefinition,
  EndpointHandlerRequest,
} from './request-types';

export type AdditionalMiddleware = (handler: express.RequestHandler) => express.RequestHandler[];

export type ApiEndpoints = {
  [path: string]: {
    [method in EndpointMethod]?:
      | EndpointHandler<any, EHRequestDefinition> // TODO EHRequestPartialDefinition?
      | EndpointHandlerWithMiddleware<any, EHRequestDefinition>;
  };
};

export type EndpointHandler<TResponse, TDefinition extends EHRequestPartialDefinition = {}> = (
  req: EndpointHandlerRequest<TDefinition>,
  res: express.Response,
  next: express.NextFunction
) => EndpointResponse<TResponse>;

export type EndpointHandlerWithMiddleware<
  TResponse,
  TDefinition extends EHRequestPartialDefinition = {}
> = {
  handler: EndpointHandler<TResponse, TDefinition>;
  middleware: AdditionalMiddleware;
};

export enum EndpointMethod {
  delete = 'delete',
  get = 'get',
  patch = 'patch',
  post = 'post',
  put = 'put',
}

export class EndpointResponse<T> {
  constructor(public payload: T, public status?: number) {}
}
