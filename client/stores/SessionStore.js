import { Store } from 'flummox';

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    const userActionIds = flux.getActionIds('session');
    this.register(userActionIds.signIn, this._onSignIn);
    this.state = {};
  }

  getUser() {
    return this.state.user;
    //return {name: "jack"};
  }

  getClientId() {
    return this.state.clientId;
    //return uuid.v4();
  }

  _onSignIn(data) {
    this.setState({
      clientId: data.clientId,
      user: data.user
    });
  }
}
