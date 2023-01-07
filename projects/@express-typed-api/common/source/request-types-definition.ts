export type JsonBodyOnly<TJsonBody> = {
  jsonBody: TJsonBody;
};

export type ParamsOnly<TParams> = {
  params: TParams;
};

export type QueryOnly<TQuery> = {
  query: TQuery;
};

export type JsonBody_Params<TJsonBody, TParams> = JsonBodyOnly<TJsonBody> & ParamsOnly<TParams>;

export type JsonBody_Query<TJsonBody, TQuery> = JsonBodyOnly<TJsonBody> & QueryOnly<TQuery>;

export type Params_Query<TParams, TQuery> = ParamsOnly<TParams> & QueryOnly<TQuery>;

export type JsonBody_Params_Query<TJsonBody, TParams, TQuery> = JsonBodyOnly<TJsonBody> &
  ParamsOnly<TParams> &
  QueryOnly<TQuery>;

export type EHRequestDefinition =
  | {}
  | JsonBodyOnly<any>
  | ParamsOnly<any>
  | QueryOnly<any>
  | JsonBody_Params<any, any>
  | JsonBody_Query<any, any>
  | Params_Query<any, any>
  | JsonBody_Params_Query<any, any, any>;
