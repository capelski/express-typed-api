import { ApiEndpoints, EndpointHandler, EndpointHandlerWithMiddleware } from './common';

export type EndpointHandlerResponse<
  TApi extends ApiEndpoints,
  TPath extends keyof TApi,
  TMethod extends keyof TApi[TPath],
  TOtherwise = unknown
> = TApi[TPath][TMethod] extends EndpointHandler<infer TResponse, infer _X>
  ? TResponse
  : TApi[TPath][TMethod] extends EndpointHandlerWithMiddleware<infer TResponse, infer _X>
  ? TResponse
  : TOtherwise;
