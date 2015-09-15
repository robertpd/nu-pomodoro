import * as SessionActions from '../session';
import { expect } from 'chai';
import sinon from 'sinon';

describe('session actions', () => {
  let _origStorage;

  beforeEach(() => {
    _origStorage = window.localStorage;
    window.localStorage = {
      getItem: sinon.stub(),
      setItem: sinon.spy()
    };
  });

  afterEach(() => {
    window.localStorage = _origStorage;
  });

  describe('createSession', () => {
    it('creates session if it does not exist', () => {
      const sessionData = SessionActions.createSession();
      expect(sessionData.id).to.be.defined;
    });

    it('does not create session if it exists', () => {
      window.localStorage.getItem.returns('{"id": 1}');
      SessionActions.createSession();
      expect(window.localStorage.setItem.called).to.be.false;
    });
  });

  describe('updateSession', () => {
    it('updates user in session', () => {
      window.localStorage.getItem.returns(JSON.stringify({
        user: { name: 'Bob' }
      }));

      const sessionData = SessionActions.updateSession({ user: { name: 'Fred' } });

      expect(sessionData.user.name).to.equal('Fred');
    });
  });
});