import { ApiEndpoints, Dictionary, JsonEndpoint } from '@express-typed-api/common';
import { TypedRequestInit, TypedResponse } from './types';

export const getTypedFetch = <T extends ApiEndpoints>(_fetch: Window['fetch']) => {
  return function typedFetch<TPath extends keyof T, TMethod extends keyof T[TPath]>(
    path: TPath,
    init: TypedRequestInit<TMethod>,
    queryString?: Dictionary<string>
  ) {
    const url = queryString
      ? <string>path + '?' + new URLSearchParams(queryString).toString()
      : <string>path;

    return _fetch(url, init) as Promise<
      TypedResponse<
        T[TPath][TMethod] extends JsonEndpoint<any>
          ? ReturnType<T[TPath][TMethod]['handler']>['payload']
          : unknown
      >
    >;
  };
};
