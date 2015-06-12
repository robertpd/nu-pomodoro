import { Store } from 'flummox';
import _ from 'lodash';

export default class RemoteClientStore extends Store {
  constructor(flux) {
    super();
    const pomodoroActionIds = flux.getActionIds('pomodoro');
    this.register(pomodoroActionIds.remoteStatusChange, this._handleRemoteStatusChange);
    this.register(pomodoroActionIds.remoteClientRemoved, this._handleRemoteClientRemoved);
    this.register(pomodoroActionIds.remoteSessionUpdated, this._handleRemoteSessionUpdated);
    this.state = { remoteClients: [] };
  }

  getRemoteClients() {
    return this.state.remoteClients;
  }

  _handleRemoteStatusChange({ id, user, status, remainingTime }) {
    let remoteClients = _.clone(this.state.remoteClients);
    let client = _.find(remoteClients, {id: id});

    if (!client) {
      client = {};
      remoteClients.push(client);
    }

    _.assign(client, { id, user, status, remainingTime });

    this.setState({ remoteClients });
  }

  _handleRemoteClientRemoved({ id }) {
    this.setState({
      remoteClients: this.state.remoteClients.filter(c => c.id !== id)
    });
  }

  _handleRemoteSessionUpdated({ id, user }) {
    let remoteClients = _.clone(this.state.remoteClients);
    let client = _.find(remoteClients, {id: id});

    if (!client) {
      client = {};
      remoteClients.push(client);
    }

    _.assign(client, { id, user });

    this.setState({ remoteClients });
  }
}
