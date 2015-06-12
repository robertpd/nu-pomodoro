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
    this.timer = createTimer(DefaultTimeLengths.POMODORO, this._tick);

    function createTimer(defaultDuration, onTick) {
      let timerStream;
      let tickSub;

      initializeTimer(defaultDuration);

      return {
        start() {
          timerStream.resume();
        },
        resetDuration(duration) {
          this.stop();
          initializeTimer(duration);
          this.start();
        },
        stop() { tickSub.dispose() },
        pause() { timerStream.pause() }
      };

      function initializeTimer(duration) {
        timerStream = createTimeStream(duration);
        tickSub = timerStream.subscribe(onTick);
      }

      function createTimeStream(duration) {
        return Rx.Observable.timer(0, 1000)
          .map(x => duration - x * 1000)
          .filter(t => t >= 0)
          .map(t => ({ remainingTime: t }))
          .pausable();
      }
    }
  },

  componentWillUnmount() {
    this.timer.stop();
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
        this.timer.resetDuration(DefaultTimeLengths.POMODORO);

        break;

      case Status.ON_BREAK:
        this.timer.resetDuration(DefaultTimeLengths.SHORT_BREAK);

        break;

      case Status.STOPPED:
        this.timer.pause();

        break;

      default:
        throw new Error(`Invalid status: ${status}`);
    }

    // Invoke callback from owner.
    const remainingTime = parseInt(length, 10);
    this.props.onStatusChange({ status, remainingTime });
  },

  _tick({ remainingTime }) {
    console.log("tick!", remainingTime);
    // Invoke callback from owner.
    this.props.onTick({
      status: this.props.pomodoro.status,
      remainingTime: remainingTime
    });
  }
});
