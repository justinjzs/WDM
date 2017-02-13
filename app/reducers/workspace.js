import merge from 'deepmerge'

import { 
  WORKSPACE_SELECT,
  WORKSPACE_SELECT_ALL,
  WORKSPACE_REQUEST_SUCCESS,
  WORKSPACE_REQUEST
 } from '../actions'


const initialState = {
  currentFiles: [],
  currentPath: '/'
}

export default function currentFilesReducer(state = initialState, action) {
  switch (action.type) {
    case WORKSPACE_SELECT:
      let newState = merge({}, state, {clone: true});
      for (let file of newState.currentFiles) {
        if (file.key === action.key)
          file.selected = !file.selected;
      }
      return newState;
    case WORKSPACE_SELECT_ALL:
      newState = merge({}, state, {clone: true});
      for (let file of newState.currentFiles)
        file.selected = action.checked;
      return newState;     
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