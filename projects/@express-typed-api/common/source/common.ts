import express from 'express';

export type AdditionalMiddleware = (handler: express.RequestHandler) => express.RequestHandler[];

export type ApiEndpoints = {
  [path: string]: {
    [method in EndpointMethod]?: EndpointHandler<any> | ComposedEndpointHandler<any>;
  };
};

export type ComposedEndpointHandler<T> = {
  handler: EndpointHandler<T>;
  middleware: AdditionalMiddleware;
};

export type Dictionary<TValue, TKey extends string | symbol | number = string> = {
  [K in TKey]: TValue;
};

export type EndpointHandler<T> = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => EndpointResponse<T>;

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
