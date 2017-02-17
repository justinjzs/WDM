import merge from 'deepmerge'
import {
  ADDSHARE,
  ADDSHARE_RESET,
  SHARE_RECORDS,
  SHARE_RECORDS_SELECT,
  SHARE_RECORDS_SELECT_ALL,
  SHARE_RECORDS_SORTBYNAME,
  SHARE_RECORDS_SORTBYTIME
} from '../actions'

const initialState = {
  addShare: {
    link: '',
    secret: null
  },
  list: []
}

export default function shareReducer(state = initialState, action) {
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
      }, { clone: true });
    case SHARE_RECORDS:
      let newState = merge({}, state, { clone: true });
      newState.list = action.records;
      return newState;
    case SHARE_RECORDS_SELECT:
      newState = merge({}, state, { clone: true });
      for (let item of newState.list) {
        if (item.addr === action.addr)
          item.selected = !item.selected
      }
      return newState;
    case SHARE_RECORDS_SELECT_ALL:
      newState = merge({}, state, { clone: true });
      for (let item of newState.list)
        item.selected = !item.selected;
      return newState;
    case SHARE_RECORDS_SORTBYNAME:
      newState = merge({}, state, { clone: true });
      newState.list.sort((a, b) => a.name.localeCompare(b.name));
      action.order && newState.list.reverse();
      return newState
    case SHARE_RECORDS_SORTBYTIME:
      newState = merge({}, state, { clone: true });
      newState.list.sort((a, b) => a.time.localeCompare(b.time));
      action.order && newState.list.reverse();
      return newState
    default:
      return state

  }
}