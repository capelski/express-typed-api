import { ApiEndpoints, EndpointHandler, EndpointHandlerWithMiddleware } from './common';

export type EndpointHandlerResponse<
  T extends ApiEndpoints,
  TPath extends keyof T,
  TMethod extends keyof T[TPath],
  TOtherwise = unknown
> = T[TPath][TMethod] extends EndpointHandler<infer TResponse, infer _X>
  ? TResponse
  : T[TPath][TMethod] extends EndpointHandlerWithMiddleware<infer TResponse, infer _X>
  ? TResponse
  : TOtherwise;
