import React from 'react';
import AppFlux from '../../AppFlux';
import { Status } from '../../constants';

export default React.createClass({
  getDefaultProps() {
    return {
      notificationClass: window.Notification
    }
  },

  render() {
    const Notification = this.props.notificationClass;

    if (this.props.remainingTime === 0 && this.props.status !== Status.STOPPED) {
      new Notification("Time's up!");
      return <audio src="/assets/alarm.wav" autoPlay />;
    } else {
      return null;
    }
  }
});