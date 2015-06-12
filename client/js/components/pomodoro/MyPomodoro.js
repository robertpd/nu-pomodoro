import React from 'react/addons';
import Rx from 'rx';
import _ from 'lodash';

const { classSet } = React.addons;

import { Status, DefaultTimeLengths } from '../../constants';
import { formatTime } from '../../utils/datetime';

export default React.createClass({
  propTypes: {
    client: React.PropTypes.object.isRequired,
    onStatusChange: React.PropTypes.func,
    onTick: React.PropTypes.func
  },

  render() {
    return (
      <div className="my-pomodoro">
        <Timer className="my-pomodoro--timer" client={this.props.client}
               pomodoro={this.props.pomodoro}
               onStatusChange={this.props.onStatusChange}
               onTick={this.props.onTick} />
      </div>
    );
  }
});

const Timer = React.createClass({
  componentDidMount() {
    this.pomodoroTimer = createTimer(DefaultTimeLengths.POMODORO);
    this.breakTimer = createTimer(DefaultTimeLengths.SHORT_BREAK);

    const ticks = Rx.Observable.merge(this.pomodoroTimer, this.breakTimer);
    this.ticksSub = ticks.subscribe(this._tick);

    function createTimer(length) {
      return Rx.Observable.timer(0, 1000)
      .map(x => length - x * 1000)
      .filter(t => t >= 0)
      .map(t => ({ remainingTime: t }))
      .pausable();
    }
  },

  componentWillUnmount() {
    this.ticksSub.dispose();
  },

  render() {
    const pomodoro = this.props.pomodoro;

    const classes = classSet({
      'my-pomodoro__remaining-time': true,
      'my-pomodoro--in-pomodoro': pomodoro.status === Status.IN_POMODORO,
      'my-pomodoro--on-break': pomodoro.status === Status.ON_BREAK,
      'my-pomodoro--stopped': pomodoro.status === Status.STOPPED
    });

    return (
      <div>
        <div className={classes}>
          {formatTime(pomodoro.remainingTime)}
        </div>
        <div>
          <button className="my-pomodoro--start-pomodoro btn btn-lg btn-primary"
                  data-status={Status.IN_POMODORO}
                  data-length={DefaultTimeLengths.POMODORO}
                  onClick={this._onStatusChange}
                  disabled={pomodoro.status === Status.IN_POMODORO}>
            Start Pomodoro
          </button>
          <button className="my-pomodoro--start-break btn btn-lg btn-warning"
                  data-status={Status.ON_BREAK}
                  data-length={DefaultTimeLengths.SHORT_BREAK}
                  onClick={this._onStatusChange}
                  disabled={pomodoro.status === Status.ON_BREAK}>
            Start Break
          </button>
          <button className="my-pomodoro--stop-all btn btn-lg btn-danger"
                  data-status={Status.STOPPED}
                  onClick={this._onStatusChange}
                  disabled={pomodoro.status === Status.STOPPED}>
            Stop
          </button>
        </div>
      </div>
    );
  },

  _onStatusChange(evt) {
    const {target: {dataset: {status, length='0'}}} = evt;

    switch (status) {
      case Status.IN_POMODORO:
        // restart if needed
        this.pomodoroTimer.pause();
        this.pomodoroTimer.resume();

        this.breakTimer.pause();

        break;

      case Status.ON_BREAK:
        this.pomodoroTimer.pause();

        // restart if needed
        this.breakTimer.pause();
        this.breakTimer.resume();

        break;

      case Status.STOPPED:
        this.pomodoroTimer.pause();
        this.breakTimer.pause();

        break;

      default:
        throw new Error(`Invalid status: ${status}`);
    }

    // Invoke callback from owner.
    const remainingTime = parseInt(length, 10);
    this.props.onStatusChange({ status, remainingTime });
  },

  _tick({ remainingTime }) {
    // Invoke callback from owner.
    this.props.onTick({
      status: this.props.pomodoro.status,
      remainingTime: remainingTime
    });
  }
});
