import { combineReducers } from 'redux';

import pomodoro from './pomodoro.js';
import session from './session.ts';
import remoteClients from './remote-clients.js';
import timesUp from './times-up.js';

const rootReducer = combineReducers({
  pomodoro,
  session,
  remoteClients,
  timesUp
});

export default rootReducer;