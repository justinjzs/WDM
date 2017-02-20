import { USER_NAME } from '../actions'
import merge from 'deepmerge'

const initialState = {
  name: ''
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_NAME:
      let newState = merge({}, state, { clone: true });
      return Object.assign(newState, { name: action.name });
    default:
      return state;
  }
}