import { combineReducers } from 'redux';
import workspaceReducer from './workspace';
import treeReducer from './tree'
import shareReducer from './share'
export default combineReducers({
  workspace: workspaceReducer,
  tree: treeReducer,
  share: shareReducer
})