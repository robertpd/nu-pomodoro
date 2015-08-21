import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import objectAssign from 'lodash/object/assign';

const initialState = {
  shouldNotify: false,
  prevRemainingTime: null
};

const timesUp = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.POMODORO_TICKED:
    case ActionTypes.POMODORO_STATUS_CHANGED:
      const { status, remainingTime } = action;
      const shouldNotify = !state.shouldNotify &&
        status !== Status.STOPPED &&
        remainingTime === 0 &&
        remainingTime !== state.prevRemainingTime;

      return {
        prevRemainingTime: remainingTime,
        shouldNotify: shouldNotify
      };

    default:
      return state;
  }
};

export default timesUp;