import { expect } from 'chai';
import Rx from 'rx';

import ClientPool from '../ClientPool';

describe('ClientPool', () => {
  let pool;

  beforeEach(() => {
    pool = new ClientPool({
      heartbeatWithin: 200
    });
  });

  describe('heartbeats', (done) => {
    it('removes clients that have not sent heartbeat within given time', (done) => {

      pool.add({ id: '1234' });
      pool.add({ id: '5678' });

      setTimeout(() => {
        pool.heartbeat('5678');
      }, 100);

      setTimeout(() => {
        pool.heartbeat('5678');
      }, 100);

      setTimeout(() => {
        expect(pool.size).to.equal(1);
        expect(pool.get('5678')).to.be.defined;

        done();
      }, 250);
    });
  });
});