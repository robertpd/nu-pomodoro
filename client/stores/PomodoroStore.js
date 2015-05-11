import { Store } from 'flummox';
import _ from 'lodash';

export default class PomodoroStore extends Store {
  constructor(flux) {
    super();
    const pomodoroActionIds = flux.getActionIds('pomodoro');
    this.register(pomodoroActionIds.tick, this._handleTick);
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
