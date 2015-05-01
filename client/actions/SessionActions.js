import { Actions } from 'flummox';
import uuid from 'node-uuid';

export default class SessionActions extends Actions {
  signIn(user) {
    return {
      user: user,
      clientId: uuid.v4()
    };
  }
}
