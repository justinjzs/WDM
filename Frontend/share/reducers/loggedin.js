import {
  LOGGED_IN,
  NOT_LOGGED_IN
} from '../actions'

const initialState = false;

export default function loggedinReducer(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return true;
    case NOT_LOGGED_IN:
      return false;
    default:
      return state;
  }
}