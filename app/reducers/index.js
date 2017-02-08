import { combineReducers } from 'redux';
import currentFilesReducer from './currentfiles';

export default combineReducers({
  currentFiles: currentFilesReducer
})