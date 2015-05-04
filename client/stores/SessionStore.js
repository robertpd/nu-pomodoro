import { Store } from 'flummox';

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    const userActionIds = flux.getActionIds('session');
    this.register(userActionIds.signIn, this._onSignIn);
    this.state = fetchSessionFromLocalStorage();
  }

  getClient() {
    return { user: this.state.user, clientId: this.state.clientId };
  }

  _onSignIn(data) {
    this.setState({
      clientId: data.clientId,
      user: data.user
    });
  }
}


const fetchSessionFromLocalStorage = () => {
  const data = window.localStorage.getItem('session-data');
  if (data) {
    return JSON.parse(data);
  } else {
    return {};
  }
};
