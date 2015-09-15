declare module 'redux-actions' {
  // FSA-compliant action.
  // See: https://github.com/acdlite/flux-standard-action
  export type Action = {
    type: string
    payload: any
    error?: boolean
    meta?: any
  };

  type Reducer<T> = (state: T, action: Action) => T;

  type ReducerMap<T> = {
    [actionType: string]: Reducer<T>
  };

  export function createAction<T>(actionType: string, payloadCreator: Reducer<T>, metaCreator?: Reducer<T>): Reducer<T>;

  export function handleAction<T>(actionType: string, reducer: Reducer<T>): T;

  export function handleActions<T>(reducerMap: ReducerMap<T>, initialState: T): T;
}