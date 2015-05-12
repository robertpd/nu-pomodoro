import { expect } from 'chai';

import ClientPool from '../ClientPool';

describe('ClientPool', () => {
  let pool;

  beforeEach(() => {
    pool = new ClientPool();
  });

  describe('add', () => {
    it('adds client', () => {
      pool.add({ id: '1234' });
      expect(pool.get('1234')).to.eql({ id: '1234' });
    });

    it('replaces existing client with same id', () => {
      pool.add({ id: '1234', x: 'something' });
      pool.add({ id: '1234', x: 'something else' });
      expect(pool.get('1234')).to.eql({ id: '1234', x: 'something else' });
      expect(pool.size).to.equal(1);
    });

    it('does not allow client without id', () => {
      pool.add({});
      expect(pool.clients.length).to.equal(0);
    });
  });

  describe('remove', () => {
    it('removes client', () => {
      pool.add({ id: '1234' });
      pool.remove('1234');

      expect(pool.size).to.equal(0);
    });

    it('returns true if client exists', () => {
      pool.add({ id: '1234' });
      expect(pool.remove('1234')).to.be.true;
    });

    it('returns true if client does not exist', () => {
      expect(pool.remove('1234')).to.be.false;
    });
  });
});