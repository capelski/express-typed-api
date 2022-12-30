import express from 'express';
import { EHRequestDefinition } from './request-types-definition';
import { EHServerRequest } from './request-types-server';

export type AdditionalMiddleware = (handler: express.RequestHandler) => express.RequestHandler[];

export type ApiEndpoints = {
  [path: string]: {
    [method in EndpointMethod]?: EndpointHandler<any> | EndpointHandlerWithMiddleware<any>;
  };
};

export type EndpointHandler<TResponse, TDefinition extends EHRequestDefinition = {}> = (
  req: EHServerRequest<TDefinition>,
  res: express.Response,
  next: express.NextFunction
) => EndpointResponse<TResponse>;

export type EndpointHandlerWithMiddleware<
  TResponse,
  TDefinition extends EHRequestDefinition = {}
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
