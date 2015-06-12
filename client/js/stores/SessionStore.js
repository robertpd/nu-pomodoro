import { Store } from 'flummox';

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    const sessionActionIds = flux.getActionIds('session');
    this.register(sessionActionIds.createSession, this._updateSession);
    this.register(sessionActionIds.updateSession, this._updateUser);
    this.state = {};
  }

  getClient() {
    return { user: this.state.user, id: this.state.id };
  }

  _updateSession(data) {
    this.setState(data);
  }

  _updateUser(data) {
    this.setState({
      user: data.user
    });
  }
}
