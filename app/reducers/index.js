import { combineReducers } from 'redux';
import workspaceReducer from './workspace';
import treeReducer from './tree'

export default combineReducers({
  workspace: workspaceReducer,
  tree: treeReducer
})