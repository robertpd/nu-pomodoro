import React from 'react';
import Rx from 'rx';
import moment from 'moment';
import io from 'socket.io-client';

import { States, DefaultTimeLengths, TimerTypes } from '../constants';

export default React.createClass({
  render() {
    return (
      <div>
        Hello {this.props.user.name}
        <Timer />
      </div>
    );
  }
});

const pad = t => t < 10 ? `0${t}` : `${t}`;

const formatTime = t => {
  const m = moment.duration(t);
  return `${pad(m.minutes())}:${pad(m.seconds())}`;
}

const Timer = React.createClass({
  getInitialState() {
    return {
      remainingTime: DefaultTimeLengths.POMODORO
    };
  },

  componentDidMount() {
    var socket = io('http://localhost:8000');
    socket.on('news', (data) => {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    })

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

    Rx.Observable.merge(this.pomodoroTimer, this.breakTimer).subscribe(data => {
      this._updateTimer(data);
    });

    const stateChanges = this._getPomodoroStateChangeObservable();
    stateChanges.subscribe(this._handlePomodoroStateChange);
  },

  render() {
    return (
      <div>
        <div>
          <span>{formatTime(this.state.remainingTime)}</span>
        </div>
        <div>
          <button className="pomodoro--start-pomodoro">Start Pomodoro</button>
          <button className="pomodoro--start-break">Start Break</button>
          <button className="pomodoro--stop-all">Stop</button>
        </div>
      </div>
    );
  },

  _getPomodoroStateChangeObservable() {
    const element = this.getDOMNode();

    const startPomodoroBtn = element.querySelector('.pomodoro--start-pomodoro');
    const startBreakBtn = element.querySelector('.pomodoro--start-break');
    const stopAllBtn = element.querySelector('.pomodoro--stop-all');

    const startPomodoro = Rx.Observable.fromEvent(startPomodoroBtn, 'click')
      .map(() => States.STARTED);
    const startBreak = Rx.Observable.fromEvent(startBreakBtn, 'click')
      .map(() => States.PAUSED);
    const stopAll = Rx.Observable.fromEvent(stopAllBtn, 'click')
      .map(() => States.STOPPED);

    return Rx.Observable.merge(Rx.Observable.just(States.STOPPED), startPomodoro, startBreak, stopAll);
  },

  _handlePomodoroStateChange(state) {
    switch (state) {
      case States.STARTED:
        // restart if needed
        this.pomodoroTimer.pause();
        this.pomodoroTimer.resume();

        this.breakTimer.pause();
        break;

      case States.PAUSED:
        this.pomodoroTimer.pause();

        // restart if needed
        this.breakTimer.pause();
        this.breakTimer.resume();
        break;

      case States.STOPPED:
        this.pomodoroTimer.pause();
        this.breakTimer.pause();
        this._updateTimer({timerType: TimerTypes.POMODORO, remainingTime: DefaultTimeLengths.POMODORO });
        break;

      default:
        throw new Error(`Invalid state: ${state}`);
    }
  },

  _updateTimer({timerType, remainingTime}) {
    this.setState({
      timerType: timerType,
      remainingTime: remainingTime
    });
  }
});
