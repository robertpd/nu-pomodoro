import React from '../../../node_modules/react/addons';
import Rx from 'rx';

const { classSet } = React.addons;

import { Status, DefaultTimeLengths } from '../../constants';
import { formatTime } from '../../utils/datetime';

import styles from './MyPomodoro.scss';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onStatusChange: React.PropTypes.func,
    onTick: React.PropTypes.func
  },

  render() {
    return (
      <div className={styles.this + ' my-pomodoro'}>
        <Timer className={styles.timer}
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
        setDuration(duration) {
          this.dispose();
          initializeTimer(duration);
        },
        dispose() { tickSub.dispose() },
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
    this.timer.dispose();
  },

  render() {
    const pomodoro = this.props.pomodoro;

    const classes = classSet({
      [styles.remainingTime]: true,
      [styles.inPomodoro]: pomodoro.get('status') === Status.IN_POMODORO,
      [styles.onBreak]: pomodoro.get('status') === Status.ON_BREAK,
      [styles.stopped]: pomodoro.get('status') === Status.STOPPED
    });

    return (
      <div>
        <div className={classes}>
          {formatTime(pomodoro.get('remainingTime'))}
        </div>
        <div>
          <button className={styles.button + ' start-pomodoro btn btn-lg btn-primary ' + styles.buttonStart}
                  data-status={Status.IN_POMODORO}
                  data-length={DefaultTimeLengths.POMODORO}
                  onClick={this._onStatusChange}>
            Start Pomodoro
          </button>
          <button className={styles.button + ' start-break btn btn-lg btn-warning ' + styles.buttonBreak}
                  data-status={Status.ON_BREAK}
                  data-length={DefaultTimeLengths.SHORT_BREAK}
                  onClick={this._onStatusChange}>
            Start Short Break
          </button>
          <button className={styles.button + ' start-break btn btn-lg btn-warning ' + styles.buttonBreak}
                  data-status={Status.ON_BREAK}
                  data-length={DefaultTimeLengths.LONG_BREAK}
                  onClick={this._onStatusChange}>
            Start Long Break
          </button>
          <button className={styles.button + ' stop-all btn btn-lg btn-danger ' + styles.buttonStop}
                  data-status={Status.STOPPED}
                  onClick={this._onStatusChange}>
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
        this.timer.setDuration(length);
        this.timer.start();

        break;

      case Status.ON_BREAK:
        this.timer.setDuration(length);
        this.timer.start();

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
    // Invoke callback from owner.
    this.props.onTick({
      status: this.props.pomodoro.get('status'),
      remainingTime: remainingTime
    });
  }
});