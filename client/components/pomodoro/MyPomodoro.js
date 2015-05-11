import React from 'react';
import Rx from 'rx';
import moment from 'moment';
import uuid from 'node-uuid';
import _ from 'lodash';

import { Status, DefaultTimeLengths, TimerTypes } from '../../constants';
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
        <Timer client={this.props.client}
               onStatusChange={this.props.onStatusChange}
               onTick={this.props.onTick} />
      </div>
    );
  }
});

const Timer = React.createClass({
  getInitialState() {
    return {
      remainingTime: DefaultTimeLengths.POMODORO
    };
  },

  componentDidMount() {
    this.pomodoroTimer = Rx.Observable.timer(0, 1000)
      .map(x => DefaultTimeLengths.POMODORO - x * 1000)
      .filter(t => t >= 0)
      .map(t => ({ timerType: TimerTypes.POMODORO, remainingTime: t }))
      .pausable();

    this.breakTimer = Rx.Observable.timer(0, 1000)
      .map(x => DefaultTimeLengths.BREAK - x * 1000)
      .filter(t => t >= 0)
      .map(t => ({ timerType: TimerTypes.BREAK, remainingTime: t }))
      .pausable();

    this.ticks = Rx.Observable.merge(this.pomodoroTimer, this.breakTimer);
    this.ticks.subscribe(this._tick);
  },

  componentWillUnmount() {
    this.ticks.dispose();
    this.statusChange.dispose();
  },

  render() {
    return (
      <div>
        <div className="my-pomodoro--remaining-time">
          {formatTime(this.state.remainingTime)}
        </div>
        <div>
          <button className="my-pomodoro--start-pomodoro"
                  data-status={Status.IN_POMODORO}
                  onClick={this._onStatusChange}>
            Start Pomodoro
          </button>
          <button className="my-pomodoro--start-break"
                  data-status={Status.ON_BREAK}
                  onClick={this._onStatusChange}>
            Start Break
          </button>
          <button className="my-pomodoro--stop-all"
                  data-status={Status.STOPPED}
                  onClick={this._onStatusChange}>
            Stop
          </button>
        </div>
      </div>
    );
  },

  _onStatusChange(evt) {
    const {target: {dataset: {status}}} = evt;
    const {client} = this.props;
    let remainingTime;

    switch (status) {
      case Status.IN_POMODORO:
        // restart if needed
        this.pomodoroTimer.pause();
        this.pomodoroTimer.resume();

        this.breakTimer.pause();

        remainingTime = DefaultTimeLengths.POMODORO;

        break;

      case Status.ON_BREAK:
        this.pomodoroTimer.pause();

        // restart if needed
        this.breakTimer.pause();
        this.breakTimer.resume();

        remainingTime = DefaultTimeLengths.BREAK;

        break;

      case Status.STOPPED:
        this.pomodoroTimer.pause();
        this.breakTimer.pause();

        this._tick({timerType: TimerTypes.POMODORO, remainingTime: DefaultTimeLengths.POMODORO });

        remainingTime = 0;

        break;

      default:
        throw new Error(`Invalid status: ${status}`);
    }

    this.setState({
      status: status
    });

    // Invoke callback from owner.
    this.props.onStatusChange({
      status: status,
      remainingTime: remainingTime
    });
  },

  _tick({timerType, remainingTime}) {
    this.setState({
      timerType: timerType,
      remainingTime: remainingTime
    });

    // Invoke callback from owner.
    this.props.onTick({
      status: this.state.status,
      remainingTime: remainingTime
    });
  }
});
