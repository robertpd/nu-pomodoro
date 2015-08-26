import Immutable from 'immutable';
import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import objectAssign from 'lodash/object/assign';

const initialState = Immutable.fromJS({
  remainingTime: 0,
  status: Status.STOPPED
});

const pomodoro = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.POMODORO_TICKED:
      return state.merge({
        remainingTime: action.remainingTime
      });

    case ActionTypes.POMODORO_STATUS_CHANGED:
      return state.merge({
        status: action.status,
        remainingTime: action.remainingTime
      });

    default:
      return state;
  }
};

export default pomodoro;