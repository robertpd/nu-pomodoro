import { Map } from 'immutable';
import { ActionTypes, Status, DefaultTimeLengths } from '../constants.ts';
import { handleActions, Action } from 'redux-actions';

type Model = Map<String, any>;

const initialState: Model = Map<String, any>({
  id: '',
  client: Map({ user: Map() })
});


const session = handleActions<Model>({
  [ActionTypes.SESSION_CREATED]: (state: Model, action: Action) => (
      state.merge({
        id: action.payload.id,
        client: Map({ id: action.payload.id, user: Map(action.payload.user) })
      })
  ),

  [ActionTypes.SESSION_UPDATED]: (state: Model, action: Action) => (
      state.merge({
        client: Map({id: state.get('client').get('id'), user: Map(action.payload.user) })
      })
  )
}, initialState);

export default session;
