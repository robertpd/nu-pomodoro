import _ from 'lodash';
import Rx from 'rx';

export default class ClientPool {
  constructor(opts={}) {
    this._heartbeatWithin = opts.heartbeatWithin;

    this._clients = {};
    this._heartbeats = {};
  }

  update(client) {
    if (!client.id) {
      console.error('Client without ID detected!');
      return;
    }

    this._clients[client.id] = client;

    this._waitForNextHeartbeat(client.id);
  }

  get(id) {
    return this._clients[id];
  }

  remove(id) {
    if (this.get(id)) {
      delete this._clients[id];
      return true;
    } else {
      return false;
    }
  }

  heartbeat(id) {
    this._waitForNextHeartbeat(id);
  }

  get clients() {
    return _.values(this._clients);
  }

  get size() {
    return this.clients.length;
  }

  _waitForNextHeartbeat(id) {
    clearTimeout(this._heartbeats[id]);

    this._heartbeats[id] = setTimeout(() => {
      console.log('Heartbeat failed', id);
      this.remove(id);
      delete this._heartbeats[id];
    }, this._heartbeatWithin);
  }
}