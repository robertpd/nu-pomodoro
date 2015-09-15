import { Map } from 'immutable';
import { ActionTypes, Status, DefaultTimeLengths } from '../constants.ts';
import { handleActions } from 'redux-actions';

const initialState = Map<String, any>({
  id: '',
  client: Map({ user: Map() })
});


const session = handleActions({
  [ActionTypes.SESSION_CREATED]: (state, action) => (
      state.merge({
        id: action.payload.id,
        client: Map({ id: action.payload.id, user: Map(action.payload.user) })
      })
  ),

  [ActionTypes.SESSION_UPDATED]: (state, action) => (
      state.merge({
        client: Map({id: state.get('client').get('id'), user: Map(action.payload.user) })
      })
  )
}, initialState);

export default session;
