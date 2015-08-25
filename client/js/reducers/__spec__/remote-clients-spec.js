import * as RemoteActions from '../../actions/remote-clients';
import remoteClients from '../remote-clients';
import { expect } from 'chai';
import { ActionTypes } from '../../constants';
import Immutable from 'immutable';

describe('Remote client reducers', () => {
  it('removes client when remoteClientRemoved is received', () => {
    let state = Immutable.fromJS([{id: 1234}]);

    state = remoteClients(state, { type: ActionTypes.REMOTE_CLIENT_REMOVED, id: 1234, remainingTime: 0 });

    expect(state.toJS()).to.be.empty;
  });
});
