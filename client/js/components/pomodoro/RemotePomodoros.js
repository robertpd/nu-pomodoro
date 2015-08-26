import React from 'react/addons';
import Rx from 'rx';
import Immutable from 'immutable';
import { Status } from '../../constants';
import { formatTime } from '../../utils/datetime';
import { humanize } from '../../utils/string';

const { classSet } = React.addons;

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    client: React.PropTypes.object.isRequired,
    remoteClients: React.PropTypes.instanceOf(Immutable.List).isRequired
  },

  render() {
    const otherCount = this._others().size;

    return (
      <div className="remote-pomodoros">
        <div className="remote-pomodoros__info">
          <a href="#remote-pomodoros">Other users ({otherCount})</a>
        </div>

        <div className="remote-pomodoros__back">
          <a href="#top">Back to top</a>
        </div>

        <div className="remote-pomodoros__list" id="remote-pomodoros">
          {
            this._others()
              .map(c => <RemotePomodoro key={c.get('id')}
                                        remainingTime={c.get('remainingTime')}
                                        user={c.get('user')}
                                        status={c.get('status')} />)
          }
        </div>
      </div>
    );
  },

  _others() {
    return this.props.remoteClients.filter(c => c.get('status') !== Status.STOPPED && c.get('id') !== this.props.client.get('id'));
  }
});

const RemotePomodoro = React.createClass({
  getInitialState() {
    return {
      remainingTime: 0
    }
  },

  propTypes: {
    user: React.PropTypes.object,
    status: React.PropTypes.string,
    remainingTime: React.PropTypes.number
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
      this.remainingTimeSubject.onNext(this.props.remainingTime);
    }
  },

  render() {
    const classes = classSet({
      'remote-pomodoro': true,
      'remote-pomodoro--stopped': this.props.status === Status.STOPPED,
      'remote-pomodoro--on-break': this.props.status === Status.ON_BREAK,
      'remote-pomodoro--in-pomodoro': this.props.status === Status.IN_POMODORO
    })
    return (
      <div className={classes}>
        <div className="remote-pomodoro__content">
          <span className="remote-pomodoro__user">
            {this.props.user ? this.props.user.get('name') : ''}
          </span>
          <span className="remote-pomodoro__time">{formatTime(this.state.remainingTime)}</span>
        </div>
      </div>
    );
  },

  _tick(remainingTime) {
    this.setState({ remainingTime });
  }
});