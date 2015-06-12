import _ from 'lodash';
import { Actions } from 'flummox';
import uuid from 'node-uuid';

export default class SessionActions extends Actions {
  constructor(flux, storage=window.localStorage) {
    super();
    this.flux = flux;
    this.storage = storage;
  }

  createSession() {
    const fromLocalStorage = this.storage.getItem('session-data');

    let data;

    if (fromLocalStorage) {
      data = JSON.parse(fromLocalStorage);
    } else {
      data = { id: uuid.v4() };
      this.storage.setItem('session-data', JSON.stringify(data))
    }

    return data;
  }

  updateSession(session) {
    const data = JSON.parse(this.storage.getItem('session-data'));

    this.flux.pomodoroSocket.updateSession({ id: data.id, user: session.user });

    _.assign(data, session);

    this.storage.setItem('session-data', JSON.stringify(data));

    return data;
  }
}
