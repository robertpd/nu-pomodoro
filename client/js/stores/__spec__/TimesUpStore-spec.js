import PomodoroActions from '../../actions/PomodoroActions';
import TimesUpStore from '../TimesUpStore';
import { expect } from 'chai';

import { seq, FakeFlux, simulateAction } from '../../test-utils';

const form = (attrs) => assign({ id: seq() }, attrs);
const dot = (prop) => (obj) => obj[prop];

describe('TimesUpStore', () => {
  let flux, store, actionIds;

  beforeEach(() => {
    const actions = new PomodoroActions();
    actionIds= actions.getActionIds();

    flux = new FakeFlux({
      actions: { 'pomodoro': actions }
    });

    store = new TimesUpStore(flux);
  });

  it('does not notify when remaining time reaches zero, but we are stopped', () => {
    simulateAction(store, actionIds.tick, {status: 'stopped', remainingTime: 0 });
    expect(store.shouldNotify()).to.be.false;
  });

  it('notifies on when remaining time reaches zero, and we are not stopped', () => {
    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
    expect(store.shouldNotify()).to.be.true;
  });

  it('does not notify on when already notified', () => {
    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
    expect(store.shouldNotify()).to.be.false;
  });

  it('does not notify on when remaining time is already zero', () => {
    simulateAction(store, actionIds.tick, {status: 'stopped', remainingTime: 0 });
    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
    expect(store.shouldNotify()).to.be.false;
  });
});
