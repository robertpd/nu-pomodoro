import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import { List, Map } from 'immutable';
import { handleActions } from 'redux-actions';

const initialState = List([]);

// Gets index of client in state or returns index to insert at.
const getClientUpsertIndex = (state, clientId) => {
  let clientIndex = state.findIndex(c => c.get('id') === clientId, state.size);

  if (clientIndex === -1) {
    clientIndex = state.size;
  }

  return clientIndex;
};


const remoteClient = handleActions({
  [ActionTypes.REMOTE_STATUS_CHANGED]: (state, action) => {
    const { id,  user, status, remainingTime } = action.payload;
    const clientIndex = getClientUpsertIndex(state, id);

    return state.update(clientIndex, client => {
      if (!client) {
        client = Map();
      }
      return client.merge({ id, user, status, remainingTime })
    });
  },

  [ActionTypes.REMOTE_CLIENT_REMOVED]: (state, action) => state.filter(c => c.get('id') !== action.payload.id),

  [ActionTypes.REMOTE_SESSION_UPDATED]: (state, action) => {
    const { id,  user } = action.payload;
    const clientIndex = getClientUpsertIndex(state, id);
    return state.update(clientIndex, client => client.merge({ id, user }));
  }
}, initialState);

export default remoteClient;