import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import clone from 'lodash/lang/clone';
import find from 'lodash/collection/find';
import objectAssign from 'lodash/object/assign';

const initialState = [];

const pomodoro = (state = initialState, action = {}) => {
  const { id, user, status, remainingTime } = action;
  const remoteClients = clone(state);
  let client = find(remoteClients, {id: id});

  switch (action.type) {
    case ActionTypes.REMOTE_STATUS_CHANGED:

      if (!client) {
        client = {};
        remoteClients.push(client);
      }

      objectAssign(client, { id, user, status, remainingTime });

      return remoteClients;

    case ActionTypes.REMOTE_CLIENT_REMOVED:
      return state.filter(c => c.id !== id);

    case ActionTypes.REMOTE_SESSION_UPDATED:
      if (!client) {
        client = {};
        remoteClients.push(client);
      }

      objectAssign(client, { id, user });

      return remoteClients;

    default:
      return state;
  }
};

export default pomodoro;