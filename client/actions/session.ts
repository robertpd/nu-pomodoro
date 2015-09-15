import { ActionTypes } from '../constants.ts';
import { v4 } from 'node-uuid';
import { createAction } from 'redux-actions';

export const createSession = createAction(
  ActionTypes.SESSION_CREATED,
  () => {
    const fromLocalStorage = window.localStorage.getItem('session-data');

    let data = {};

    if (fromLocalStorage) {
      data = JSON.parse(fromLocalStorage) || {};
    } else {
      data = {id: v4()};
      window.localStorage.setItem('session-data', JSON.stringify(data))
    }

    return data
  }
);

export const updateSession = createAction(
  ActionTypes.SESSION_UPDATED,
  session => {
    window.localStorage.setItem('session-data', JSON.stringify(session));
    return session;
  }
);