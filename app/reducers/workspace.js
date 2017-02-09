import merge from 'deepmerge'

import { 
  WORKSPACE_REQUEST_SUCCESS,
  WORKSPACE_REQUEST
 } from '../actions'


const initialState = {
  currentFiles: [],
  currentPath: '/'
}

export default function currentFilesReducer(state = initialState, action) {
  switch (action.type) {
    case WORKSPACE_REQUEST:
      return merge(state, {
        currentPath: action.path
      }, {clone: true});
    case WORKSPACE_REQUEST_SUCCESS:
      return {
        currentFiles: action.files,
        currentPath: state.currentPath
      };
    default:
      return state;
  }
}