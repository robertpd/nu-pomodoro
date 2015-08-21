import io from 'socket.io-client';

import config from '../config';

export default class PomodoroSocket {
  constructor(remoteActions) {
    this.remoteActions = remoteActions;
    this.socket = io(config.socketUrl);
    this.socket.on('remoteStatusChange', this._handleRemoteStatusChange.bind(this));
    this.socket.on('remoteClientRemoved', data => { remoteActions.remoteClientRemoved(data) });
    this.socket.on('remoteUpdateSession', data => { remoteActions.remoteSessionUpdated(data) });
  }

  heartbeat({ client, pomodoro }) {
    this.socket.emit('heartbeat', { client, pomodoro });
  }

  tick({client, status, remainingTime}) {
    this.socket.emit('tick', {
      id: client.id,
      user: client.user,
      status: status,
      remainingTime: remainingTime
    });
  }

  changeStatus({ client, status, remainingTime }) {
    this.socket.emit('statusChange', {
      id: client.id,
      user: client.user,
      status: status,
      remainingTime: remainingTime
    });
  }

  updateSession({ id, user }) {
    this.socket.emit('updateSession', {
      id: id,
      user: user
    });
  }

  _handleRemoteStatusChange({ id, user, status, remainingTime}) {
    if (!id) {
      return;
    }

    this.remoteActions.remoteStatusChange({
      id,
      user,
      status,
      remainingTime
    });
  }
}