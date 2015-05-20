import React from 'react/addons';
import Rx from 'rx';

import { Status } from '../../constants';
import { formatTime } from '../../utils/datetime';
import { humanize } from '../../utils/string';

export default React.createClass({
  propTypes: {
    client: React.PropTypes.object.isRequired,
    remoteClients: React.PropTypes.array.isRequired
  },

  render() {
    const otherCount = this._others().length;

    return (
      <div className="remote-pomodoros" id="remote-pomodoros">
        <div className="remote-pomodoros__info">
          <a href="#remote-pomodoros">Active pomodoros ({otherCount})</a>
        </div>
        {
          this._others()
            .map(c => <RemotePomodoro key={c.id}
                                      remainingTime={c.remainingTime}
                                      user={c.user}
                                      status={c.status} />)
        }
        <div className="remote-pomodoros__back">
          <a href="#top">Back to top</a>
        </div>
      </div>
    );
  },

  _others() {
    return this.props.remoteClients.filter(c => c.status !== Status.STOPPED && c.id !== this.props.client.id);
  }
});

const RemotePomodoro = React.createClass({
  getInitialState() {
    return {
      remainingTime: 0
    }
  },

  propTypes: {
    user: React.PropTypes.object.isRequired,
    status: React.PropTypes.string.isRequired,
    remainingTime: React.PropTypes.number.isRequired
  },

  componentWillMount() {
    this.remainingTimeSubject = new Rx.Subject();

    // Only observe the latest timer object.
    const remainingTime = this.remainingTimeSubject
      .flatMapLatest(newRemainingTime => {
        return Rx.Observable.timer(0, 1000)
          .map(x => newRemainingTime - x * 1000)
          .filter(t => t >= 0);
      });

    this.ticks = remainingTime.subscribe(this._tick);

    // Start timer.
    this.remainingTimeSubject.onNext(this.props.remainingTime);
  },

  componentWillUnmount() {
    this.ticks.dispose();
  },

  componentDidUpdate(prevProps) {
    // Only update if remaining time was changed.
    if (this.props.remainingTime !== prevProps.remainingTime) {
      console.log('updating remaining time for ' + this.props.user.name);
      this.remainingTimeSubject.onNext(this.props.remainingTime);
    }
  },

  render() {
    return (
      <div className="remote-pomodoro">
        <span className="remote-pomodoro--user">{this.props.user.name}</span>
        <span className="remote-pomodoro--time">{formatTime(this.state.remainingTime)}</span>
        <span className="remote-pomodoro--status">({humanize(this.props.status)})</span>
      </div>
    );
  },

  _tick(remainingTime) {
    this.setState({ remainingTime });
  }
});