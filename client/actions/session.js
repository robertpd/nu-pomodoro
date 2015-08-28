import { ActionTypes } from '../constants';
import objectAssign from '../../node_modules/node-sass/node_modules/sass-graph/node_modules/lodash/object/assign';
import uuid from 'node-uuid';

export const createSession = () => {
  const fromLocalStorage = window.localStorage.getItem('session-data');

  let data = {};

  if (fromLocalStorage) {
    data = JSON.parse(fromLocalStorage) || {};
  } else {
    data = { id: uuid.v4() };
    window.localStorage.setItem('session-data', JSON.stringify(data))
  }

  return objectAssign({type: ActionTypes.SESSION_CREATED}, data);
};

export const updateSession = session => {
  const data = JSON.parse(window.localStorage.getItem('session-data')) || {};

  objectAssign(data, session);

  window.localStorage.setItem('session-data', JSON.stringify(data));

  return objectAssign({type: ActionTypes.SESSION_UPDATED}, data);
};