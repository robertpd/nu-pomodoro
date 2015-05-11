import { Store } from 'flummox';
import _ from 'lodash';

export default class RemoteClientStore extends Store {
  constructor(flux) {
    super();
    const pomodoroActionIds = flux.getActionIds('pomodoro');
    this.register(pomodoroActionIds.remoteStatusChange, this._handleRemoteStatusChange);
    this.state = { remoteClients: [] };
  }

  getRemoteClients() {
    return this.state.remoteClients;
  }

  _handleRemoteStatusChange({ clientId, user, status, remainingTime }) {
    let remoteClients = _.clone(this.state.remoteClients);
    let client = _.find(remoteClients, {clientId: clientId});

    if (!client) {
      client = {};
      remoteClients.push(client);
    }

    _.assign(client, { clientId, user, status, remainingTime });

    this.setState({ remoteClients });
  }
}