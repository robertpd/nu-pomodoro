import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import Immutable from 'immutable';

const initialState = Immutable.List([]);

const remoteClient = (state = initialState, action = {}) => {
  const { id, user, status, remainingTime } = action;
  let clientIndex = state.findIndex(c => c.get('id') === id, state.size);

  if (clientIndex === -1) {
    clientIndex = state.size;
  }

  switch (action.type) {
    case ActionTypes.REMOTE_STATUS_CHANGED:
      return state.update(clientIndex, client => Immutable.fromJS({ id, user, status, remainingTime }));

    case ActionTypes.REMOTE_CLIENT_REMOVED:
      return state.filter(c => c.get('id') !== id);

    case ActionTypes.REMOTE_SESSION_UPDATED:
      return state.update(clientIndex, client => client.merge({ id, user }));

    default:
      return state;
  }
};

export default remoteClient;