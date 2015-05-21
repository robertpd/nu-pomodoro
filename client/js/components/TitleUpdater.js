import React from 'react';
import { formatTime } from '../utils/datetime';

export default React.createClass({
  render() {
    const { remainingTime } = this.props;

    if (remainingTime > 0) {
      document.title = formatTime(remainingTime);
    } else {
      document.title = 'Nu-Pomodoro';
    }

    return null;
  }
});