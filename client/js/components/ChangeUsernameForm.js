import React from '../../../node_modules/react/addons';

import AppFlux from '../AppFlux';

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  contextTypes: {
    flux: React.PropTypes.instanceOf(AppFlux).isRequired
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    this.sessionActions = this.context.flux.getActions('session');
  },

  render() {
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

    this.sessionActions.updateSession({
      user: {
        name: this.state.username
      }
    });
  }
});
