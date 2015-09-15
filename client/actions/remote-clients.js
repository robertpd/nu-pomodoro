import { ActionTypes } from '../constants';
import { createAction } from 'redux-actions';

export const remoteStatusChange = createAction(
  ActionTypes.REMOTE_STATUS_CHANGED,
  ({ id, user, status, remainingTime }) => ({id, user, status, remainingTime})
);

export const remoteClientRemoved = createAction(
  ActionTypes.REMOTE_CLIENT_REMOVED,
  ({ id }) => ({ id })
);

export const remoteSessionUpdated = createAction(
  ActionTypes.REMOTE_SESSION_UPDATED,
  ({ id, user }) => ({ id, user })
);