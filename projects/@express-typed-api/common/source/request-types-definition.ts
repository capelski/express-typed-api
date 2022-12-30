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

export type EHRequestDefinition =
  | {}
  | BodyOnly<any>
  | ParamsOnly<any>
  | QueryOnly<any>
  | BodyParams<any, any>
  | BodyQuery<any, any>
  | ParamsQuery<any, any>
  | BodyParamsQuery<any, any, any>;
