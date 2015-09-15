import { Map } from 'immutable';
import { ActionTypes } from '../../constants.js';
import session from '../session';
import { expect } from 'chai';

import { seq } from '../../test-utils';

const form = (attrs) => assign({ id: seq() }, attrs);

describe('session reducers', () => {
  it('updates from session actions', () => {
    let state = session(Map({}), {
      type: ActionTypes.SESSION_CREATED,
      payload: { id: 1, user: { name: 'Bob' } }
    });
    expect(state.get('client').toJS()).to.eql({ id: 1, user: { name: 'Bob' } });

    state = session(state, {
      type: ActionTypes.SESSION_UPDATED,
      payload: { user: { name: 'Fred' } }
    });
    expect(state.get('client').toJS()).to.eql({ id: 1, user: { name: 'Fred' } });
  });
});
