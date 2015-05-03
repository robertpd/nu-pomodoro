import React from 'react/addons';

import AppFlux from 'client/AppFlux';

import Pomodoro from 'client/components/pomodoro/Pomodoro';
import SignInForm from 'client/components/auth/SignInForm';

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
      clientInfo: this.sessionStore.getClientInfo()
    });
  },

  render() {
    if (this.state.clientInfo.clientId) {
      return <Pomodoro clientInfo={this.state.clientInfo}  />;
    } else {
      return <SignInForm />;
    }
  }
});

React.render(<App />, document.getElementById('app'));

export default App;

