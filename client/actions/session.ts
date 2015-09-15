import { ActionTypes } from '../constants.ts';
import { v4 } from 'node-uuid';
import { createAction } from 'redux-actions';


type SessionData = {
  id?: String
  client?: any
};

export const createSession = createAction<SessionData>(
  ActionTypes.SESSION_CREATED,
  () => {
    const fromLocalStorage = window.localStorage.getItem('session-data');

    let data : SessionData;

    if (fromLocalStorage) {
      data = <SessionData>JSON.parse(fromLocalStorage) || {};
    } else {
      data = {id: v4()};
      window.localStorage.setItem('session-data', JSON.stringify(data))
    }

    return data
  }
);

export const updateSession = createAction<SessionData>(
  ActionTypes.SESSION_UPDATED,
  (session: SessionData) => {
    window.localStorage.setItem('session-data', JSON.stringify(session));
    return session;
  }
);