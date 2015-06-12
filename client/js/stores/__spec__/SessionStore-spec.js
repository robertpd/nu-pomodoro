import SessionActions from '../../actions/SessionActions';
import SessionStore from '../SessionStore';
import { expect } from 'chai';

import { seq, FakeFlux, simulateAction } from '../../test-utils';

const form = (attrs) => assign({ id: seq() }, attrs);
const dot = (prop) => (obj) => obj[prop];

describe('SessionStore', () => {
  let flux, store, actionIds;

  beforeEach(() => {
    const actions = new SessionActions();
    actionIds= actions.getActionIds();

    flux = new FakeFlux({
      actions: { 'session': actions }
    });

    store = new SessionStore(flux);
  });

  it('updates from session actions', () => {
    simulateAction(store, actionIds.createSession, { id: 1, user: { name: 'Bob' } });
    expect(store.getClient()).to.eql({ id: 1, user: { name: 'Bob' } });

    simulateAction(store, actionIds.updateSession, { user: { name: 'Fred' } });
    expect(store.getClient()).to.eql({ id: 1, user: { name: 'Fred' } });
  });
});
