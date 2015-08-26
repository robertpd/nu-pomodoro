import * as PomodoroActions from '../../actions/pomodoro';
import timesUp from '../times-up';
import { ActionTypes } from '../../constants';
import { expect } from 'chai';
import Immutable from 'immutable'

import { seq } from '../../test-utils';

describe('Times up reducer', () => {
  it('notifies when remaining time reaches zero during pomodoro or break', () => {
    let state = Immutable.fromJS({});

    // Start stopped
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'stopped', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.false;

    // Pomodoro starts
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'in_pomodoro', remainingTime: 2 * 1000 });
    expect(state.get('shouldNotify')).to.be.false;

    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'in_pomodoro', remainingTime: 1 * 1000 });
    expect(state.get('shouldNotify')).to.be.false;

    // Pomodoro ends
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'in_pomodoro', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.true;

    // Break starts
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'on_break', remainingTime: 2 * 1000 });
    expect(state.get('shouldNotify')).to.be.false;

    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'on_break', remainingTime: 1 * 1000 });
    expect(state.get('shouldNotify')).to.be.false;

    // Break ends
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'on_break', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.true;
  });

  it('does not notify when already previously notified', () => {
    let state = Immutable.fromJS({});

    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'in_pomodoro', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.true;

    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'in_pomodoro', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.false;
  });

  it('does not notify when remaining time is already zero', () => {
    let state = Immutable.fromJS({});

    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'in_pomodoro', remainingTime: 0 });
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'stopped', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.false;

    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'on_break', remainingTime: 0 });
    state = timesUp(state, { type: ActionTypes.POMODORO_TICKED, status: 'stopped', remainingTime: 0 });
    expect(state.get('shouldNotify')).to.be.false;
  });
});
