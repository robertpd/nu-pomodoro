import React from 'react';
import TitleUpdater from '../TitleUpdater';
import { expect } from 'chai';
import TestUtils from '../../../node_modules/react/lib/ReactTestUtils';

describe('TitleUpdater', () => {
  it('displays time in title when remaining time is not zero', () => {
    const component = TestUtils.renderIntoDocument(
      <TitleUpdater remainingTime={60 * 1000} />
    );

    expect(document.title).to.eql('01:00');
  });

  it('displays default title when remaining time is zero', () => {
    const component = TestUtils.renderIntoDocument(
      <TitleUpdater remainingTime={0} />
    );

    expect(document.title).to.eql('Nu-Pomodoro');
  });
});