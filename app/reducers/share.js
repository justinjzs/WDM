import merge from 'deepmerge'
import { ADDSHARE,
         ADDSHARE_RESET,
         SHARE_RECORDS } from '../actions'

const initialState = {
  addShare: {
    link: '',
    secret: null
  },
  shareList: []
}

export default function shareReducer(state = initialState, action){
  switch (action.type) {
    case ADDSHARE:
      return merge(state, {
        addShare: {
          link: action.link,
          secret: action.secret
        }
      }, { clone: true });
      case ADDSHARE_RESET:
      return merge(state, {
        addShare: {
          link: '',
          secret: null
        }
      }, {clone: true});
    case SHARE_RECORDS: 
      let newState = merge({}, state, {clone: true});
      newState.shareList = action.records;
      return newState;
    default:
      return state

  }
}