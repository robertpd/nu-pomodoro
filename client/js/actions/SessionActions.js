import { Actions } from 'flummox';
import uuid from 'node-uuid';

export default class SessionActions extends Actions {
  signIn(user) {
    const data = {
      user: user,
      id: uuid.v4()
    };

    window.localStorage.setItem('session-data', JSON.stringify(data));

    return data;
  }
}
