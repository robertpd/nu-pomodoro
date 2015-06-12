import { Actions } from 'flummox';

export default class PomodoroActions extends Actions {
  constructor(flux) {
    super();
    this.flux = flux;
  }

  tick({ client, status, remainingTime }) {
    this.flux.pomodoroSocket.tick({ client, status, remainingTime });
    return { status, remainingTime };
  }

  changeStatus({ client, status, remainingTime }) {
    this.flux.pomodoroSocket.changeStatus({ client, status, remainingTime });
    return { status, remainingTime };
  }

  remoteStatusChange({ id, user, status, remainingTime }) {
    return { id, user, status, remainingTime };
  }

  remoteClientRemoved({ id }) {
    return { id };
  }

  remoteSessionUpdated({ id, user }) {
    return { id, user };
  }

  heartbeat({ client, pomodoro }) {
    this.flux.pomodoroSocket.heartbeat({ client, pomodoro });
  }
}
