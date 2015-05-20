import { Store } from 'flummox';
import _ from 'lodash';

import { Status, DefaultTimeLengths } from '../constants';

export default class PomodoroStore extends Store {
  constructor(flux) {
    super();
    const pomodoroActionIds = flux.getActionIds('pomodoro');
    this.register(pomodoroActionIds.tick, this._handleTick);
    this.register(pomodoroActionIds.changeStatus, this._handleChangeStatus);

    this.state = {
      pomodoro: {
        remainingTime: 0,
        status: Status.STOPPED
      }
    };
  }

  getPomodoro() {
    return this.state.pomodoro;
  }

  _handleTick({ remainingTime }) {
    const pomodoro = this.state.pomodoro;
    pomodoro.remainingTime = remainingTime;
    this.setState({ pomodoro });
  }

  _handleChangeStatus({ status, remainingTime }) {
    const pomodoro = this.state.pomodoro;
    pomodoro.status = status;
    pomodoro.remainingTime = remainingTime;
    this.setState({ pomodoro });
  }
}
