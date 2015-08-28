import Immutable from 'immutable';
import { ActionTypes, Status, DefaultTimeLengths } from '../constants';

const initialState = Immutable.fromJS({
  id: 0,
  client: { user: {} }
});

const session = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.SESSION_CREATED:
      return state.merge({
        id: action.id,
        client: { id: action.id, user: Immutable.fromJS(action.user) }
      });

    case ActionTypes.SESSION_UPDATED:
      return state.merge({
        client: {id: state.get('client').get('id'), user: Immutable.fromJS(action.user) }
      });

    default:
      return state;
  }
};

export default session;