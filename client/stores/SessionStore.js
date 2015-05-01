import { Store } from 'flummox';

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    const userActionIds = flux.getActionIds('session');
    this.register(userActionIds.signIn, this._onSignIn);
  }

  getUser() {
    return this.state.user;
  }

  _onSignIn(user) {
    this.setState({
      user: user
    });
  }
}
