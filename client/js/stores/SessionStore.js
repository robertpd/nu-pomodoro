import { Store } from 'flummox';

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    const userActionIds = flux.getActionIds('session');
    this.register(userActionIds.signIn, this._onSignIn);
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
}


const fetchSessionFromLocalStorage = () => {
  const data = window.localStorage.getItem('session-data');
  if (data) {
    return JSON.parse(data);
  } else {
    return {};
  }
};
