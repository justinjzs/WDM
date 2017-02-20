import { combineReducers } from 'redux';
import workspaceReducer from './workspace';
import treeReducer from './tree'
import shareReducer from './share'
import userReducer from './user'

export default combineReducers({
  workspace: workspaceReducer,
  tree: treeReducer,
  share: shareReducer,
  user: userReducer
})