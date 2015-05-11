import {Flux} from 'flummox';

import SessionActions from './actions/SessionActions';
import SessionStore from './stores/SessionStore';
import PomodoroActions from './actions/PomodoroActions';
import PomodoroStore from './stores/PomodoroStore';
import RemoteClientStore from './stores/RemoteClientStore';
import PomodoroSocket from './sockets/PomodoroSocket';

export default class AppFlux extends Flux {
  constructor() {
    super();

    this.createActions('session', SessionActions, this);
    this.createStore('session', SessionStore, this);

    this.createActions('pomodoro', PomodoroActions, this);
    this.createStore('pomodoro', PomodoroStore, this);
    this.createStore('remoteClient', RemoteClientStore, this);
    this.pomodoroSocket = new PomodoroSocket(this);
  }
}

