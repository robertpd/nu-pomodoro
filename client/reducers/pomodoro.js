import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { ActionTypes, Status, DefaultTimeLengths } from '../constants.ts';

const initialState = Map({
  remainingTime: 0,
  status: Status.STOPPED
});

const pomodoro = handleActions({
  [ActionTypes.POMODORO_TICKED]: (state, action) => (
    state.merge({
      remainingTime: action.payload.remainingTime
    })
  ),

  [ActionTypes.POMODORO_STATUS_CHANGED]: (state, action) => (
    state.merge({
      status: action.payload.status,
      remainingTime: action.payload.remainingTime
    })
  )
}, initialState);

export default pomodoro;