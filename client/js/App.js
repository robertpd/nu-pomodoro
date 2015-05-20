import React from 'react/addons';

import AppFlux from './AppFlux';

import PomodoroPage from './pages/Pomodoro';
import SignInForm from './components/auth/SignInForm';

const flux = new AppFlux();

const App = React.createClass({
  getInitialState() {
    return {};
  },

  childContextTypes: {
    flux: React.PropTypes.instanceOf(AppFlux)
  },

  getChildContext() {
    return { flux };
  },

  componentWillMount() {
    this.sessionStore = flux.getStore('session');
    this.sessionStore.addListener('change', this._updateSession);
    this._updateSession();
  },

  componentDidMount() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  },

  _updateSession() {
    this.setState({
      client: this.sessionStore.getClient()
    });
  },

  render() {
    if (this.state.client.id) {
      return <PomodoroPage client={this.state.client} />;
    } else {
      return <SignInForm />;
    }
  }
});

React.render(<App />, document.getElementById('app'));

export default App;

