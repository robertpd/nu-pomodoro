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

  // TODO: clientId and user should be grouped in client object; status and remainingTime should be a pomodoro object.
  remoteStatusChange({ clientId, user, status, remainingTime }) {
    return { clientId, user, status, remainingTime };
  }
}
