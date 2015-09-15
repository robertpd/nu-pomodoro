declare module 'redux-actions' {
    export function handleActions<T>(handlers: any, initialState: T): T;
}