import io from 'socket.io-client';

import config from '../config';

export default class PomodoroSocket {
  constructor(flux) {
    this.actions = flux.getActions('pomodoro');

    this.socket = io(config.socketUrl);
    this.socket.on('remoteStatusChange', this._handleRemoteStatusChange.bind(this));
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

  _handleRemoteStatusChange({ id, user, status, remainingTime}) {
    console.log('socket:status-change', id, user, status, remainingTime);

    if (!id) {
      return;
    }

    this.actions.remoteStatusChange({
      id,
      user,
      status,
      remainingTime
    });
  }
}