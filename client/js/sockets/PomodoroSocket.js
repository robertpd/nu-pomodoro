import io from 'socket.io-client';

import config from '../config';

export default class PomodoroSocket {
  constructor(flux) {
    this.actions = flux.getActions('pomodoro');

    this.socket = io(config.socketUrl);
    this.socket.on('remoteStatusChange', this._handleRemoteStatusChange.bind(this));
  }

  tick({client, status, remainingTime}) {
    this.socket.emit('tick', {
      clientId: client.clientId,
      user: client.user,
      status: status,
      remainingTime: remainingTime
    });
  }

  changeStatus({ client, status, remainingTime }) {
    this.socket.emit('statusChange', {
      clientId: client.clientId,
      user: client.user,
      status: status,
      remainingTime: remainingTime
    });
  }

  _handleRemoteStatusChange({ clientId, user, status, remainingTime}) {
    console.log('socket:status-change', clientId, user, status, remainingTime);

    if (!clientId) {
      return;
    }

    this.actions.remoteStatusChange({
      clientId,
      user,
      status,
      remainingTime
    });
  }
}