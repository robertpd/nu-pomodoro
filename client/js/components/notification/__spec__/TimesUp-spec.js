import React from 'react';
import TimesUp from '../TimesUp';
import { expect } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';
import sinon from 'sinon';

describe('TimesUp', () => {
  let Notification;

  beforeEach(() => {
    Notification = sinon.spy();
  });

  it('notifies if shouldNotify is true', () => {
    const component = TestUtils.renderIntoDocument(
      <TimesUp notificationClass={Notification}
               shouldNotify={true}/>
    );

    expect(Notification.calledWithNew()).to.be.true;
  });

  it('does not notify if shouldNotify is false', () => {
    const component = TestUtils.renderIntoDocument(
      <TimesUp notificationClass={Notification}
               shouldNotify={false} />
    );

    expect(Notification.calledWithNew()).to.be.false;
  });

  it('does not notify if shouldUpdate has not changed', () => {
    const Parent = React.createClass({
      getInitialState() {
        return { shouldNotify: true };
      },

      render() {
        return <TimesUp notificationClass={Notification} shouldNotify={this.state.shouldNotify}/>;
      }
    });

    const parent = TestUtils.renderIntoDocument(<Parent/>);
    parent.setState({shouldUpdate: true});

    expect(Notification.calledOnce).to.be.true;
  });
});