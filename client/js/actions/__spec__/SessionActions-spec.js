//import SessionActions from '../SessionActions';
//import { expect } from 'chai';
//import sinon from 'sinon';
//
//describe('SessionActions', () => {
//  let storage, flux;
//
//  beforeEach(() => {
//    storage = {
//      getItem: sinon.stub(),
//      setItem: sinon.spy()
//    };
//
//    flux = {
//      pomodoroSocket: {updateSession: sinon.spy()}
//    };
//  });
//
//  describe('createSession', () => {
//    it('creates session if it does not exist', () => {
//      const sessionData = SessionActions.prototype.createSession.call({ storage: storage });
//      expect(sessionData.id).to.be.defined;
//    });
//
//    it('does not create session if it exists', () => {
//      storage.getItem.returns('{"id": 1}');
//      SessionActions.prototype.createSession.call({ storage: storage });
//      expect(storage.setItem.called).to.be.false;
//    });
//  });
//
//  describe('updateSession', () => {
//    it('updates user in session', () => {
//      storage.getItem.returns(JSON.stringify({
//        user: { name: 'Bob' }
//      }));
//
//      const sessionData = SessionActions.prototype.updateSession.call({flux: flux, storage: storage}, { user: { name: 'Fred' } });
//
//      expect(sessionData.user.name).to.equal('Fred');
//    });
//  });
//});