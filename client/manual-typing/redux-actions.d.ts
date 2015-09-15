declare module 'redux-actions' {
  type PayloadCreator = (state: any, action: any)=>any;

  export function createAction(actionType: string, payloadCreator: PayloadCreator, metaCreator?: PayloadCreator): any;

  export function handleAction(actionType: string, reducer: any): any;

  export function handleActions(handlers: any, initialState: any): any;
}