import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import * as PomodoroActions from '../actions/pomodoro.js';
import * as SessionActions from '../actions/session.js';
import * as RemoteActions from '../actions/remote-clients.js';
import PomodoroSocket from '../sockets/PomodoroSocket.js';

import MyPomodoro from '../components/pomodoro/MyPomodoro';
import RemotePomodoros from '../components/pomodoro/RemotePomodoros';
import { Status } from '../constants';
import { formatTime } from '../utils/datetime';
import TimesUp from '../components/notification/TimesUp';
import TitleUpdater from '../components/TitleUpdater';

const Pomodoro = React.createClass({
  contextTypes: {
    pomodoroSocket: React.PropTypes.instanceOf(PomodoroSocket)
  },

  componentDidMount() {
    this._sendHeartbeat();
    this._heartbeat = setInterval(this._sendHeartbeat, 5000);
  },

  componentWillUnmount() {
    clearInterval(this._heartbeat);
  },

  render() {
    let {
      pomodoro,
      client,
      remoteClients,
      shouldNotify,
      dispatch
    } = this.props;

    pomodoro = pomodoro || {};
    client = client || {};

    this.actions = bindActionCreators(PomodoroActions, dispatch);
    this.remoteActions = bindActionCreators(RemoteActions, dispatch);
    this.sessionActions = bindActionCreators(SessionActions, dispatch);

    return (
      <div>
        <TitleUpdater remainingTime={pomodoro.remainingTime} />

        <TimesUp shouldNotify={shouldNotify} />

        <div className="navigation">
          <div className="navigation--item">

            <DropdownButton bsStyle="link" pullRight={true} title={this._username()}>
              <MenuItem eventKey='1' href="https://github.com/nulogy/nu-pomodoro/issues" target="_blank">
                <i className="fa fa-comment"></i> Feedback/Issues
              </MenuItem>
              <MenuItem eventKey='2' onSelect={this._signOut}>
                <i className="fa fa-user"></i> Change name
              </MenuItem>
            </DropdownButton>
          </div>
        </div>

        <MyPomodoro client={client}
                    pomodoro={pomodoro}
                    onStatusChange={this.onStatusChange}
                    onTick={this.onTick} />

        <RemotePomodoros client={client}
                         remoteClients={remoteClients} />
      </div>
    );
  },

  onStatusChange(data) {
    const payload = {
      client: this.props.client,
      status: data.status,
      remainingTime: data.remainingTime
    };
    //this.context.pomodoroSocket.changeStatus(payload);
    this.actions.changeStatus(payload);
  },

  onTick(data) {
    const payload = {
      client: this.props.client,
      status: data.status,
      remainingTime: data.remainingTime
    };
    //this.context.pomodoroSocket.tick(payload);
    this.actions.tick(payload);
  },

  _sendHeartbeat() {
    const payload = {
      client: this.props.client,
      pomodoro: this.props.pomodoro
    };
    this.context.pomodoroSocket.heartbeat(payload);
    //this.remoteActions.heartbeat(payload);
  },

  _signOut() {
    this.sessionActions.updateSession({ user: null });
  },

  _username() {
    const client = this.props.client || {};
    return client.user ? client.user.name : '';
  }
});

const select = state => {
  return {
    pomodoro: state.pomodoro,
    client: state.session.client,
    remoteClients: state.remoteClients,
    shouldNotify: state.shouldNotify
  }
};

export default connect(select)(Pomodoro);