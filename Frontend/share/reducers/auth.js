import {
  NO_AUTH_REQUIRED,
  AUTH_REQUIRED,
  AUTH_SUCCESS,
  AUTH_FAILED
} from '../actions'

const initialState = {
  isAuthed: false
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case NO_AUTH_REQUIRED:
      return { isAuthed: true };
    case AUTH_REQUIRED:
      return { isAuthed: false };
    case AUTH_SUCCESS:
      return { isAuthed: true };
    case AUTH_FAILED:
      return { isAuthed: false };
    default:
      return state;
  }
}