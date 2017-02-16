import merge from 'deepmerge'

import {
  WORKSPACE_DELETE,
  WORKSPACE_SELECT,
  WORKSPACE_SELECT_ALL,
  WORKSPACE_REQUEST_SUCCESS,
  WORKSPACE_REQUEST,
  WORKSPACE_SORTBYNAME,
  WORKSPACE_SORTBYSIZE,
  WORKSPACE_SORTBYLASTTIME,
  WORKSPACE_SORTBYCREATETIME,
  SEARCH_RESULT
} from '../actions'


const initialState = {
  currentFiles: [],
  currentPath: '/',
  isSearch: false
}

export default function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case WORKSPACE_SELECT:
      let newState = merge({}, state, { clone: true });
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
    case WORKSPACE_REQUEST:
      return merge(state, {
        currentPath: action.path,
        isSearch: false
      }, { clone: true });
    case WORKSPACE_REQUEST_SUCCESS:
      newState = merge({}, state, { clone: true });
      return Object.assign(newState, {
        currentFiles: action.files,
        currentPath: state.currentPath
      });
    case WORKSPACE_DELETE:
      let newFiles = [];
      for (let file of state.currentFiles) {
        if (action.keys.indexOf(file.key) === -1)
          newFiles.push(file);
      }
      newState = merge({}, state, { clone: true });
      return Object.assign(newState, {
        currentFiles: newFiles,
        currentPath: state.currentPath
      })
    case WORKSPACE_SORTBYNAME:
      newState = merge({}, state, { clone: true });
      newState.currentFiles.sort((a, b) => a.name.localeCompare(b.name));
      action.order && newState.currentFiles.reverse();
      return newState;
    case WORKSPACE_SORTBYSIZE:
      newState = merge({}, state, { clone: true });
      newState.currentFiles.sort((a, b) => {
        if (!a.size && !b.size)
          return 0;
        else if (!a.size) 
          return 1;
        else if (!b.size)
          return -1;
        else 
          return a.size - b.size;
      });
      action.order && newState.currentFiles.reverse();
      return newState;
    case WORKSPACE_SORTBYLASTTIME:
      newState = merge({}, state, { clone: true });
      newState.currentFiles.sort((a, b) => a.lastTime.localeCompare(b.lastTime));
      action.order && newState.currentFiles.reverse();
      return newState;
    case WORKSPACE_SORTBYCREATETIME:
      newState = merge({}, state, { clone: true });
      newState.currentFiles.sort((a, b) => a.createTime.localeCompare(b.createTime));
      action.order && newState.currentFiles.reverse();
      return newState;
    case SEARCH_RESULT:
      return {
        currentFiles: action.result,
        currentPath: '/',
        isSearch: true
      }
    default:
      return state;
  }
}