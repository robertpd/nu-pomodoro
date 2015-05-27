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

  it('displays notification if status is not stopped and remaining time is zero', () => {
    const component = TestUtils.renderIntoDocument(
      <TimesUp notificationClass={Notification}
               shouldNotify={true}/>
    );

    expect(Notification.calledWithNew()).to.be.true;
  });

  it('does not display notification if status is stopped', () => {
    const component = TestUtils.renderIntoDocument(
      <TimesUp notificationClass={Notification}
               shouldNotify={false} />
    );

    expect(Notification.calledWithNew()).to.be.false;
  });
});