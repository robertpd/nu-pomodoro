import { ActionTypes } from '../constants';
import uuid from 'node-uuid';
import { createAction } from 'redux-actions';

export const createSession = createAction(
  ActionTypes.SESSION_CREATED,
  () => {
    const fromLocalStorage = window.localStorage.getItem('session-data');

    let data = {};

    if (fromLocalStorage) {
      data = JSON.parse(fromLocalStorage) || {};
    } else {
      data = {id: uuid.v4()};
      window.localStorage.setItem('session-data', JSON.stringify(data))
    }

    return data
  }
);

export const updateSession = createAction(
  ActionTypes.SESSION_UPDATED,
  session => {
    let data = JSON.parse(window.localStorage.getItem('session-data')) || {};
    data = {...data, ...session};

    window.localStorage.setItem('session-data', JSON.stringify(data));

    return data;
  }
);