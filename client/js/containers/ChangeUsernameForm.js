import React from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SessionActions from '../actions/session.js';

const ChangeUsernameForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {};
  },

  render() {
    const { dispatch } = this.props;

    this.actions = bindActionCreators(SessionActions, dispatch);

    return (
      <form className="sign-in-form" onSubmit={this._changeUserName}>
        <div className="sign-in-form--group">
          <input className="sign-in-form--input"
                 placeholder="Enter your name"
                 name="username"
                 type="text"
                 autoFocus
                 valueLink={this.linkState('username')} />
          <button type="submit" className="sign-in-form--btn btn btn-primary">Go</button>
        </div>
      </form>
    );
  },

  _changeUserName(evt) {
    evt.preventDefault();

    this.actions.updateSession({
      user: {
        name: this.state.username
      }
    });
  }
});



const select = state => (
  {
    client: state.client
  }
);

export default connect(select)(ChangeUsernameForm);