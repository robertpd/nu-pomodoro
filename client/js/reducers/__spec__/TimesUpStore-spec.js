//import PomodoroActions from '../../actions/PomodoroActions';
//import TimesUpStore from '../TimesUpStore';
//import { expect } from 'chai';
//
//import { seq, FakeFlux, simulateAction } from '../../test-utils';
//
//const form = (attrs) => assign({ id: seq() }, attrs);
//const dot = (prop) => (obj) => obj[prop];
//
//describe('TimesUpStore', () => {
//  let flux, store, actionIds;
//
//  beforeEach(() => {
//    const actions = new PomodoroActions();
//    actionIds= actions.getActionIds();
//
//    flux = new FakeFlux({
//      actions: { 'pomodoro': actions }
//    });
//
//    store = new TimesUpStore(flux);
//  });
//
//  it('notifies when remaining time reaches zero during pomodoro or break', () => {
//    // Start stopped
//    simulateAction(store, actionIds.tick, {status: 'stopped', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.false;
//
//    // Pomodoro starts
//    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 2 * 1000 });
//    expect(store.shouldNotify()).to.be.false;
//
//    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 1 * 1000 });
//    expect(store.shouldNotify()).to.be.false;
//
//    // Pomodoro ends
//    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.true;
//
//    // Break starts
//    simulateAction(store, actionIds.tick, {status: 'on_break', remainingTime: 2 * 1000 });
//    expect(store.shouldNotify()).to.be.false;
//
//    simulateAction(store, actionIds.tick, {status: 'on_break', remainingTime: 1 * 1000 });
//    expect(store.shouldNotify()).to.be.false;
//
//    // Break ends
//    simulateAction(store, actionIds.tick, {status: 'on_break', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.true;
//  });
//
//  it('does not notify when already previously notified', () => {
//    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.true;
//
//    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.false;
//  });
//
//  it('does not notify when remaining time is already zero', () => {
//    simulateAction(store, actionIds.tick, {status: 'in_pomodoro', remainingTime: 0 });
//    simulateAction(store, actionIds.tick, {status: 'stopped', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.false;
//
//    simulateAction(store, actionIds.tick, {status: 'on_break', remainingTime: 0 });
//    simulateAction(store, actionIds.tick, {status: 'stopped', remainingTime: 0 });
//    expect(store.shouldNotify()).to.be.false;
//  });
//});
