import merge from 'deepmerge'

import {
  WORKSPACE_DELETE,
  WORKSPACE_SELECT,
  WORKSPACE_SELECT_ALL,
  WORKSPACE_REQUEST_SUCCESS,
  WORKSPACE_REQUEST
 } from '../actions'


const initialState = {
  currentFiles: [],
  currentPath: '/'
}

export default function workspaceReducer(state = initialState, action) {
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
    case WORKSPACE_DELETE:
      let newFiles = [];
      for(let file of state.currentFiles) {
        if (action.keys.indexOf(file.key) === -1)
          newFiles.push(file);
      }
      return {
        currentFiles: newFiles,
        currentPath: state.currentPath
      }
    default:
      return state;
  }
}