import { ActionTypes } from '../constants';

export const remoteStatusChange = ({ id, user, status, remainingTime }) => {
  return { type: ActionTypes.REMOTE_STATUS_CHANGED, id, user, status, remainingTime };
};

export const remoteClientRemoved = ({ id }) => {
  return { type: ActionTypes.REMOTE_CLIENT_REMOVED, id };
};

export const remoteSessionUpdated = ({ id, user }) => {
  return { type: ActionTypes.REMOTE_SESSION_UPDATED, id, user };
};

export const heartbeat = ({ client, pomodoro }) => {
  getPomodoroSocket().heartbeat({ client, pomodoro });
};