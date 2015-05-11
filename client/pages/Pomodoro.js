import React from 'react/addons';
import io from 'socket.io-client';


import MyPomodoro from '../components/pomodoro/MyPomodoro';
import RemotePomodoros from '../components/pomodoro/RemotePomodoros';
import config from '../config';
import { Status } from '../constants';

export default React.createClass({
  getInitialState() {
    return {
      remoteClients: []
    }
  },

  componentWillMount() {
    this.socket = io(config.socketUrl);
    this.socket.on('remoteStatusChange', this._handleRemoteStatusChange);
  },

  render() {
    return (
      <div>
        <h2>Hello {this.props.client.user.name}!</h2>
        <MyPomodoro client={this.props.client} onStatusChange={this.onStatusChange} onTick={this.onTick} />
        <RemotePomodoros client={this.props.client} remoteClients={this.state.remoteClients} />
      </div>
    );
  },

  onStatusChange(data) {
    this.socket.emit('statusChange', {
      clientId: this.props.client.clientId,
      user: this.props.client.user,
      status: data.status,
      remainingTime: data.remainingTime
    });
  },

  onTick(data) {
    this.socket.emit('tick', {
      clientId: this.props.client.clientId,
      user: this.props.client.user,
      status: data.status,
      remainingTime: data.remainingTime
    });
  },

  _handleRemoteStatusChange(data) {
    if (!data.clientId) {
      return;
    }

    console.log(`Received remote status (${data.status}) for ${data.user.name}`);

    let remoteClients = _.clone(this.state.remoteClients);
    let client = _.find(remoteClients, {clientId: data.clientId});

    if (!client) {
      client = {};
      remoteClients.push(client);
    }

    _.assign(client, data);

    if (data.status === 'stopped') {
      remoteClients = remoteClients.filter(u => data.clientId !== u.clientId);
    }

    this.setState({
      remoteClients: remoteClients
    });
  }
});
