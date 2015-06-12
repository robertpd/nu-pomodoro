import React from 'react/addons';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import MyPomodoro from '../components/pomodoro/MyPomodoro';
import RemotePomodoros from '../components/pomodoro/RemotePomodoros';
import { Status } from '../constants';
import AppFlux from '../AppFlux';
import { formatTime } from '../utils/datetime';
import TimesUp from '../components/notification/TimesUp';
import TitleUpdater from '../components/TitleUpdater';

export default React.createClass({
  contextTypes: {
    flux: React.PropTypes.instanceOf(AppFlux).isRequired
  },

  getInitialState() {
    return { pomodoro: {}, remoteClients: [] };
  },

  componentDidMount() {
    this.actions = this.context.flux.getActions('pomodoro');
    this.sessionActions = this.context.flux.getActions('session');

    this.pomodoroStore = this.context.flux.getStore('pomodoro');
    this.remoteClientStore = this.context.flux.getStore('remoteClient');

    this.timesUpStore = this.context.flux.getStore('timesUp');

    this.pomodoroStore.addListener('change', this._updatePomodoro);
    this.remoteClientStore.addListener('change', this._updateRemoteClients);

    this.timesUpStore.addListener('change', this._updateTimesUp);

    this._updatePomodoro();
    this._updateRemoteClients();

    this._sendHeartbeat();
    this._heartbeat = setInterval(this._sendHeartbeat, 5000);
  },

  componentWillUnmount() {
    clearInterval(this._heartbeat);
    this.pomodoroStore.removeListener('change', this._updatePomodoro);
    this.remoteClientStore.removeListener('change', this._updateRemoteClients);
    this.timesUpStore.removeListener('change', this._updateTimesUp);
  },


render() {
    return (
      <div>
        <TitleUpdater remainingTime={this.state.pomodoro.remainingTime} />

        <TimesUp shouldNotify={this.state.shouldNotify} />

        <div className="navigation">
          <div className="navigation--item">

            <DropdownButton bsStyle="link" pullRight={true} title={this.props.client.user.name}>
              <MenuItem eventKey='1' href="https://github.com/nulogy/nu-pomodoro/issues" target="_blank">
                <i className="fa fa-comment"></i> Feedback/Issues
              </MenuItem>
              <MenuItem eventKey='2' onSelect={this._signOut}>
                <i className="fa fa-user"></i> Change name
              </MenuItem>
            </DropdownButton>
          </div>
        </div>

        <MyPomodoro client={this.props.client}
                    pomodoro={this.state.pomodoro}
                    onStatusChange={this.onStatusChange}
                    onTick={this.onTick} />

        <RemotePomodoros client={this.props.client}
                         remoteClients={this.state.remoteClients} />
      </div>
    );
  },

  onStatusChange(data) {
    this.actions.changeStatus({
      client: this.props.client,
      status: data.status,
      remainingTime: data.remainingTime
    });
  },

  onTick(data) {
    this.actions.tick({
      client: this.props.client,
      status: data.status,
      remainingTime: data.remainingTime
    });
  },

  _updatePomodoro() {
    const pomodoro = this.pomodoroStore.getPomodoro();

    this.setState({
      pomodoro: pomodoro
    })
  },

  _updateRemoteClients() {
    this.setState({
      remoteClients: this.remoteClientStore.getRemoteClients()
    });
  },

  _updateTimesUp() {
    this.setState({
      shouldNotify: this.timesUpStore.shouldNotify()
    });
  },

  _sendHeartbeat() {
    this.actions.heartbeat({
      client: this.props.client,
      pomodoro: this.state.pomodoro
    });
  },

  _signOut() {
    this.sessionActions.updateSession({ user: null });
  }
});
