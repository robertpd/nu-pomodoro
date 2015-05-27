import { Store } from 'flummox';

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    const userActionIds = flux.getActionIds('session');
    this.register(userActionIds.signIn, this._onSignIn);
    this.register(userActionIds.signOut, this._onSignOut);
    this.state = fetchSessionFromLocalStorage();
  }

  getClient() {
    return { user: this.state.user, id: this.state.id };
  }

  _onSignIn(data) {
    this.setState({
      id: data.id,
      user: data.user
    });
  }

  _onSignOut() {
    this.setState({
      id: null,
      user: null
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
