import merge from 'deepmerge'
import { WORKSPACE_REQUEST_SUCCESS,
         WORKSPACE_REQUEST,
         WORKSPACE_MAP,
         WORKSPACE_SELECT,
         WORKSPACE_SELECT_ALL } from '../actions'

const initialState = {
  currentFiles: [],
  currentPath: '/',
  map: {}
}

export default function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case WORKSPACE_REQUEST:
    return merge(state, { currentPath: action.path }, { clone: true });

    case WORKSPACE_REQUEST_SUCCESS:
      let newState = merge({}, state, { clone: true });
      return Object.assign(newState, {
        currentFiles: action.files,
        currentPath: state.currentPath
      });
    case WORKSPACE_MAP:
      let map = {};
      for (let folder of action.folders)
        map[folder.key] = folder.name;
      return merge(state, { map }, { clone: true });
    case WORKSPACE_SELECT:
      newState = merge({}, state, { clone: true });
      for (let file of newState.currentFiles) {
        if (file.key === action.key)
          file.selected = !file.selected;
      }
      return newState;
    case WORKSPACE_SELECT_ALL:
      newState = merge({}, state, { clone: true });
      for (let file of newState.currentFiles)
        file.selected = action.checked;
      return newState;
    default:
      return state;
  }
}