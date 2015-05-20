import React from 'react';

import AppFlux from '../../AppFlux';

let isFirst = true;

export default React.createClass({
  componentDidUpdate(prevProps) {
    if (this.props.remainingTime === 0 && this.props.remainingTime !== prevProps.remainingTime) {
      if (isFirst) {
        isFirst = false;
      } else {
        new Notification("Time's up!");
      }
    }
  },

  render() {
    return null;
  }
});