import React from 'react';
import { Status } from '../../constants';

import alarmSound from './alarm.wav';

export default React.createClass({
  getDefaultProps() {
    return {
      notificationClass: window.Notification
    }
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.shouldNotify !== this.props.shouldNotify;
  },

  render() {
    const Notification = this.props.notificationClass;

    if (this.props.shouldNotify) {
      new Notification("Time's up!");
      return <audio src={alarmSound} autoPlay />;
    } else {
      return null;
    }
  }
});