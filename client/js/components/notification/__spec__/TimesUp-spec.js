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
});