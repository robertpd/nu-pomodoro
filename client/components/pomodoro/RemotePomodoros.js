import React from 'react/addons';

import { Status } from 'client/constants';
import { formatTime } from 'client/utils/datetime';

export default React.createClass({
  propTypes: {
    client: React.PropTypes.object.isRequired,
    remoteClients: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>{
        this.props.remoteClients
          .filter(c => c.status !== Status.STOPPED && c.clientId !== this.props.client.clientId)
          .map(c => <RemotePomodoro key={c.clientId}
                                    remainingTime={c.remainingTime}
                                    user={c.user}
                                    status={c.status} />)
      }</div>
    );
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
    this.remainingTime = new Rx.Subject();

    // Map remainingTime events to a new timer.
    const latestTimer = this.remainingTime
      .flatMapLatest(remainingTime => {
        return Rx.Observable.timer(0, 1000)
          .map(x => remainingTime - x * 1000)
          .filter(t => t >= 0);
      });

    this.ticks = latestTimer.subscribe(this._tick);

    // Start timer with original remainingTime.
    this.remainingTime.onNext(this.props.remainingTime);
  },

  componentWillUnmount() {
    this.ticks.dispose();
  },

  componentDidUpdate(prevProps) {
    // Only update if remaining time was changed.
    if (prevProps.remainingTime !== this.props.remainingTime) {
      console.log('updating remaining time for ' + this.props.user.name);
      this.remainingTime.onNext(this.props.remainingTime);
    }
  },

  render() {
    return (
      <div>
        {this.props.user.name} - {formatTime(this.state.remainingTime)} ({this.props.status})
      </div>
    )
  },

  _tick(remainingTime) {
    this.setState({
      remainingTime: remainingTime
    })
  }
});