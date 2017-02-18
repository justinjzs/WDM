import { combineReducers } from 'redux';
import workspaceReducer from './workspace'
import mytreeReducer from './mytree'
import loggedinReducer from './loggedin'
import authReducer from './auth'

export default combineReducers({
  workspace: workspaceReducer,
  mytree: mytreeReducer,
  isLoggedin: loggedinReducer,
  auth: authReducer
})