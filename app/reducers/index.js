import { combineReducers } from 'redux';
import workspaceReducer from './workspace';
import treeReducer from './tree'
import searchReducer from './search'

export default combineReducers({
  workspace: workspaceReducer,
  tree: treeReducer,
  searchResult: searchReducer
})