import React from 'react/addons';

import AppFlux from './AppFlux';

import Pomodoro from './components/Pomodoro';
import SignInForm from './components/SignInForm';

const flux = new AppFlux();

const App = React.createClass({
  getInitialState() {
    return {};
  },

  childContextTypes: {
    flux: React.PropTypes.instanceOf(AppFlux)
  },

  getChildContext() {
    return {
      flux: flux
    }
  },

  componentWillMount() {
    this.sessionStore = flux.getStore('session');
    this.sessionStore.addListener('change', this._updateSession);
    this._updateSession();
  },

  _updateSession() {
    this.setState({
      clientId: this.sessionStore.getClientId(),
      user: this.sessionStore.getUser()
    });
  },

  render() {
    if (this.state.user) {
      return <Pomodoro user={this.state.user} clientId={this.state.clientId} />;
    } else {
      return <SignInForm />;
    }
  }
});

React.render(<App />, document.getElementById('app'));

export default App;

