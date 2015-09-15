import { ActionTypes, Status, DefaultTimeLengths } from '../constants.ts';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  shouldNotify: false,
  prevRemainingTime: null
});

const timesUp = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.POMODORO_TICKED:
    case ActionTypes.POMODORO_STATUS_CHANGED:
      const { status, remainingTime } = action;
      const shouldNotify = !state.get('shouldNotify ')&&
        status !== Status.STOPPED &&
        remainingTime === 0 &&
        remainingTime !== state.get('prevRemainingTime');

      return state.merge({
        prevRemainingTime: remainingTime,
        shouldNotify: shouldNotify
      });

    default:
      return state;
  }
};

export default timesUp;