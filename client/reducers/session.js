import { Map } from 'immutable';
import { ActionTypes, Status, DefaultTimeLengths } from '../constants';
import { handleActions } from 'redux-actions';

const initialState = Map({
  id: 0,
  client: Map({ user: Map() })
});


const session = handleActions({
  [ActionTypes.SESSION_CREATED]: (state, action) => (
    state.merge({
      id: action.payload.id,
      client: { id: action.payload.id, user: Map(action.payload.user) }
    })
  ),

  [ActionTypes.SESSION_UPDATED]: (state, action) => (
    state.merge({
      client: {id: state.get('client').get('id'), user: Map(action.payload.user) }
    })
  )
}, initialState);

export default session;