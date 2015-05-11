import { Store } from 'flummox';
import _ from 'lodash';

import { Status, DefaultTimeLengths } from '../constants';

export default class PomodoroStore extends Store {
  constructor(flux) {
    super();
    const pomodoroActionIds = flux.getActionIds('pomodoro');
    this.register(pomodoroActionIds.tick, this._handleTick);

    this.state = {
      pomodoro: {
        remainingTime: DefaultTimeLengths.POMODORO,
        status: Status.STOPPED
      }
    };
  }

  getPomodoro() {
    return this.state.pomodoro;
  }

  _handleTick({ status, remainingTime }) {
    this.setState({
      pomodoro: { status, remainingTime }
    });
  }

}
