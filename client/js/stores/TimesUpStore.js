import { Store } from 'flummox';

export default class TimesUpStore extends Store {
  constructor(flux) {
    super();
    const actionIds = flux.getActionIds('pomodoro');
    this.register(actionIds.tick, this._update);
    this.state = { shouldNotify: false };
  }

  shouldNotify() {
    return this.state.shouldNotify;
  }

  _update({ status, remainingTime }) {
    if (status !== 'stopped' && remainingTime === 0 && this.state.prevRemainingTime !== remainingTime) {
      this.setState({
        prevRemainingTime: remainingTime,
        shouldNotify: true
      });
    } else {
      this.setState({
        prevRemainingTime: remainingTime,
        shouldNotify: false
      });
    }
  }
}