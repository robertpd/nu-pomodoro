import { Actions } from 'flummox';
import uuid from 'node-uuid';

export default class SessionActions extends Actions {
  constructor(flux, storage=window.localStorage) {
    super();
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

  updateSessionUser(user) {
    const data = JSON.parse(this.storage.getItem('session-data'));

    data.user = user;

    this.storage.setItem('session-data', JSON.stringify(data));

    return data;
  }
}
