import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import objectAssign from 'lodash/object/assign';

const initialState = {
  id: null,
  client: null
};

const session = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.SESSION_CREATED:
      return objectAssign({}, state, {
        id: action.id,
        client: { id: action.id, user: action.user }
      });

    case ActionTypes.SESSION_UPDATED:
      return objectAssign({}, state, {
        client: {id: state.client.id, user: action.user }
      });

    default:
      return state;
  }
};

export default session;