import {Flux} from 'flummox';

import SessionActions from './actions/SessionActions';
import SessionStore from './stores/SessionStore';

export default class AppFlux extends Flux {
  constructor() {
    super();

    this.createActions('session', SessionActions, this);
    this.createStore('session', SessionStore, this);
  }
}


