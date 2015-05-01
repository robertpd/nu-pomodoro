import React from 'react';

export default React.createClass({
  render() {
    return <div>Hello {this.props.user.name}</div>;
  }
});
