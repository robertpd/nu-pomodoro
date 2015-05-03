import React from '../../../node_modules/react/addons';

import AppFlux from '../../AppFlux';

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
      <form onSubmit={this._requestSignIn}>
        <label>
          Name:
          <input name="username" type="text" autoFocus valueLink={this.linkState('username')} />
        </label>
        <button>Go</button>
      </form>
    );
  },

  _requestSignIn(evt) {
    evt.preventDefault();

    this.sessionActions.signIn({
      name: this.state.username
    });
  }
});
