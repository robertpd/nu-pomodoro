import { ActionTypes } from '../constants';

export const tick = ({ client, status, remainingTime }) => {
  return { type: ActionTypes.POMODORO_TICKED, status, remainingTime };
};

export const changeStatus = ({ client, status, remainingTime }) =>  {
  return { type: ActionTypes.POMODORO_STATUS_CHANGED, status, remainingTime };
};
