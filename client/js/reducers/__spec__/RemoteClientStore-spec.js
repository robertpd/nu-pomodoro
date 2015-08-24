//import PomodoroActions from '../../actions/PomodoroActions';
//import RemoteClientStore from '../RemoteClientStore';
//import { expect } from 'chai';
//
//import { seq, FakeFlux, simulateAction } from '../../test-utils';
//
//describe('RemoteClientStore', () => {
//  let flux, store, actionIds;
//
//  beforeEach(() => {
//    const actions = new PomodoroActions();
//    actionIds= actions.getActionIds();
//
//    flux = new FakeFlux({
//      actions: { 'pomodoro': actions }
//    });
//
//    store = new RemoteClientStore(flux);
//  });
//
//  it('removes client when remoteClientRemoved is received', () => {
//    store.state = {
//      remoteClients: [{id: 1234}]
//    };
//
//    simulateAction(store, actionIds.remoteClientRemoved, {id: 1234, remainingTime: 0 });
//
//    expect(store.getRemoteClients()).to.be.empty;
//  });
//});
