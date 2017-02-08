import { CURRENTFILES_REQUEST_SUCCESS } from '../actions'

const initialState = []

export default function currentFilesReducer(state = initialState, action) {
  switch (action.type) {
    case CURRENTFILES_REQUEST_SUCCESS:
      return action.files;
    default:
      return state;
  }
}