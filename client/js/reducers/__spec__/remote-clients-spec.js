import * as RemoteActions from '../../actions/remote-clients';
import remoteClients from '../remote-clients';
import { expect } from 'chai';
import { ActionTypes } from '../../constants';
import Immutable from 'immutable';

describe('Remote client reducers', () => {
  it('updates remote clients when statuses change or session is updated', () => {

    let state = Immutable.List([]);

    state = remoteClients(state, { type: ActionTypes.REMOTE_STATUS_CHANGED, id: 1234, remainingTime: 0 });
    state = remoteClients(state, { type: ActionTypes.REMOTE_STATUS_CHANGED, id: 1234, remainingTime: 1 });

    expect(state.size).to.equal(1);
  });

  it('removes client when REMOTE_CLIENT_REMOVED is received', () => {
    let state = Immutable.fromJS([{id: 1234}]);

    state = remoteClients(state, { type: ActionTypes.REMOTE_CLIENT_REMOVED, id: 1234, remainingTime: 0 });

    expect(state.toJS()).to.be.empty;
  });
});
