import { ActionTypes } from '../constants';
import { createAction } from 'redux-actions';

export const tick = createAction(
  ActionTypes.POMODORO_TICKED,
  ({ client, status, remainingTime }) => ({ status, remainingTime })
);

export const changeStatus = createAction(
  ActionTypes.POMODORO_STATUS_CHANGED,
  ({ client, status, remainingTime }) =>  ({ status, remainingTime })
);
