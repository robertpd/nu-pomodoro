import React from 'react/addons';

import MyPomodoro from '../components/pomodoro/MyPomodoro';
import RemotePomodoros from '../components/pomodoro/RemotePomodoros';
import { Status } from '../constants';
import AppFlux from '../AppFlux';

export default React.createClass({
  contextTypes: {
    flux: React.PropTypes.instanceOf(AppFlux).isRequired
  },

  getInitialState() {
    return { pomodoro: {}, remoteClients: [] };
  },

  componentDidMount() {
    this.actions = this.context.flux.getActions('pomodoro');

    this.pomodoroStore = this.context.flux.getStore('pomodoro');
    this.remoteClientStore = this.context.flux.getStore('remoteClient');

    this.pomodoroStore.addListener('change', this._updatePomodoro);
    this.remoteClientStore.addListener('change', this._updateRemoteClients);

    this._updatePomodoro();
    this._updateRemoteClients();

    this._heartbeat = setInterval(() => {
      this.actions.heartbeat({
        client: this.props.client,
        pomodoro: this.props.pomodoro
      });
    }, 5000);
  },

  componentWillUnmount() {
    clearInterval(this._heartbeat);
  },

  render() {
    return (
      <div>
        <h2>Hello {this.props.client.user.name}!</h2>

        <MyPomodoro client={this.props.client}
                    pomodoro={this.state.pomodoro}
                    onStatusChange={this.onStatusChange}
                    onTick={this.onTick} />

        <RemotePomodoros client={this.props.client}
                         remoteClients={this.state.remoteClients} />
      </div>
    );
  },

  onStatusChange(data) {
    this.actions.changeStatus({
      client: this.props.client,
      status: data.status,
      remainingTime: data.remainingTime
    });
  },

  onTick(data) {
    this.actions.tick({
      client: this.props.client,
      status: data.status,
      remainingTime: data.remainingTime
    });
  },

  _updatePomodoro() {
    this.setState({
      pomodoro: this.pomodoroStore.getPomodoro()
    })
  },

  _updateRemoteClients() {
    this.setState({
      remoteClients: this.remoteClientStore.getRemoteClients()
    });
  }
});
