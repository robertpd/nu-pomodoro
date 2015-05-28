import { Store } from 'flummox';

import { Status } from '../constants';

export default class TimesUpStore extends Store {
  constructor(flux) {
    super();
    const actionIds = flux.getActionIds('pomodoro');
    this.register(actionIds.changeStatus, this._update);
    this.register(actionIds.tick, this._update);
    this.state = { shouldNotify: false };
  }

  shouldNotify() {
    return this.state.shouldNotify;
  }

  _update({ status, remainingTime }) {
    const shouldNotify = !this.state.shouldNotify &&
                         status !== Status.STOPPED &&
                         remainingTime === 0 &&
                         remainingTime !== this.state.prevRemainingTime;

    this.setState({
      prevRemainingTime: remainingTime,
      shouldNotify: shouldNotify
    });
  }
}