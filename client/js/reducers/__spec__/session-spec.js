import { ActionTypes } from '../../constants.js';
import session from '../session';
import { expect } from 'chai';

import { seq } from '../../test-utils';

const form = (attrs) => assign({ id: seq() }, attrs);

describe('session reducers', () => {
  it('updates from session actions', () => {
    let state = session({}, { type: ActionTypes.SESSION_CREATED, id: 1, user: { name: 'Bob' } });
    expect(state.client).to.eql({ id: 1, user: { name: 'Bob' } });

    state = session({ client: { id: 1 } }, { type: ActionTypes.SESSION_UPDATED, user: { name: 'Fred' } });
    expect(state.client).to.eql({ id: 1, user: { name: 'Fred' } });
  });
});
