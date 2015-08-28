import React from '../../node_modules/react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SessionActions from '../actions/session.js';
import PomodoroSocket from '../sockets/PomodoroSocket.js';

import styles from './ChangeUsernameForm.scss';

const ChangeUsernameForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {};
  },

  contextTypes: {
    pomodoroSocket: React.PropTypes.instanceOf(PomodoroSocket)
  },

  render() {
    const { dispatch } = this.props;

    this.actions = bindActionCreators(SessionActions, dispatch);

    return (
      <form className={styles.this} onSubmit={this._changeUserName}>
        <div className="sign-in-form--group">
          <input className={styles.input}
                 placeholder="Enter your name"
                 name="username"
                 type="text"
                 autoFocus
                 valueLink={this.linkState('username')} />
          <button type="submit" className={styles.button + ' btn btn-primary'}>Go</button>
        </div>
      </form>
    );
  },

  _changeUserName(evt) {
    evt.preventDefault();

    const payload = {
      id: this.props.sessionId,
      user: {
        name: this.state.username
      }
    };

    this.context.pomodoroSocket.updateSession(payload);
    this.actions.updateSession(payload);
  }
});



const select = state => {
  return {
    sessionId: state.session.get('id')
  };
};

export default connect(select)(ChangeUsernameForm);