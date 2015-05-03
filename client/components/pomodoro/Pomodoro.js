import React from 'react';
import Rx from 'rx';
import moment from 'moment';
import io from 'socket.io-client';
import uuid from 'node-uuid';
import _ from 'lodash';

import { States, DefaultTimeLengths, TimerTypes } from '../../constants';
import config from '../../config';

export default React.createClass({
  render() {
    return (
      <div>
        Hello {this.props.user.name}
        <Timer username={this.props.user.name} clientId={this.props.clientId} />
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
      remainingTime: DefaultTimeLengths.POMODORO,
      otherUsers: []
    };
  },

  componentDidMount() {
    this.socket = io(config.socketUrl);

    this.socket.on('action', this._handleRemoteData);

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

        <OtherPomodoros users={this.state.otherUsers} />
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

        this.socket.emit('action', {action: 'pomodoro', username: this.props.username, clientId: this.props.clientId, duration: DefaultTimeLengths.POMODORO});
        break;

      case States.PAUSED:
        this.pomodoroTimer.pause();

        // restart if needed
        this.breakTimer.pause();
        this.breakTimer.resume();

        this.socket.emit('action', {action: 'break', username: this.props.username, clientId: this.props.clientId, duration: DefaultTimeLengths.BREAK});
        break;

      case States.STOPPED:
        this.pomodoroTimer.pause();
        this.breakTimer.pause();
        this._updateTimer({timerType: TimerTypes.POMODORO, remainingTime: DefaultTimeLengths.POMODORO });

        this.socket.emit('action', {action: 'stop', username: this.props.username, clientId: this.props.clientId});
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
  },

  _handleRemoteData(data) {
    let users = _.clone(this.state.otherUsers);
    let user = _.find(users, {clientId: data.clientId});

    if (!user) {
      user = {};
      users.push(user);
    }

    _.assign(user, data);

    if (data.action === 'stop') {
      users = users.filter(u => data.clientId !== u.clientId);
    }

    this.setState({
      otherUsers: users
    });
  }
});


const OtherPomodoros = React.createClass({
  render() {
    return (
      <ul>{
        this.props.users.filter(user => user.clientId).map(user => <OtherPomodoro key={user.clientId} user={user} />)
      }</ul>
    );
  }
});

const OtherPomodoro = React.createClass({
  getInitialState() {
    return {
      remainingTime: 0
    }
  },

  componentDidMount() {
    const timer = Rx.Observable.timer(0, 1000)
      .map(x => this.props.user.duration - x * 1000)
      .filter(t => t >= 0);

    this.sub = timer.subscribe(this._updateTime);
  },

  componentWillUnmount() {
    this.sub.dispose();
  },

  render() {
    const user = this.props.user;
    return (
      <li>
        {user.username} - {formatTime(this.state.remainingTime)} ({user.action})
      </li>
    )
  },

  _updateTime(remainingTime) {
    this.setState({
      remainingTime: remainingTime
    })
  }
});
