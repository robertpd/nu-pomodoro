import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

import React, { Component } from 'react';
import { createStore, bindActionCreators, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';

import PomodoroSocket from './sockets/PomodoroSocket.js';
import * as SessionActions from './actions/session.js'
import * as RemoteClientActions from './actions/remote-clients.js'
import rootReducer from './reducers/index.js';
import PomodoroContainer from './containers/Pomodoro.js';
import ChangeUsernameContainer from './containers/ChangeUsernameForm.js';

import styles from './App.scss';

const store = createStore(rootReducer);

const App = React.createClass({
  childContextTypes: {
    pomodoroSocket: React.PropTypes.instanceOf(PomodoroSocket)
  },

  getChildContext() {
    const { dispatch } = this.props;
    const remoteActions = bindActionCreators(RemoteClientActions, dispatch);

    return {
      pomodoroSocket: new PomodoroSocket(remoteActions)
    }
  },

  componentDidMount() {
    if (!this.props.sessionId) {
      const { dispatch } = this.props;
      const sessionActions = bindActionCreators(SessionActions, dispatch);
      sessionActions.createSession();
    }
  },

  render() {
    const client = this.props.client;

    return (
      <div className={styles.this}>
        {
          client.getIn(['user', 'name'])
            ? null
            : <ChangeUsernameContainer />
        }
        <div className={React.addons.classSet({
                         [styles.hasUser]: client.getIn(['user', 'name']),
                         [styles.noUser]: !client.getIn(['user', 'name'])
                       })}>
          <PomodoroContainer />
        </div>
      </div>
    );
  }
});

const select = state => (
  {
    sessionId: state.session.get('id'),
    client: state.session.get('client')
  }
);

const ConnectedApp = connect(select)(App);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <ConnectedApp /> }
      </Provider>
    );
  }
}

React.render(<Root />, document.getElementById('app'));

export default Root;

