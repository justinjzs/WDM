import {
  MESSAGE_TIPS_HIDE,
  MESSAGE_TIPS_SUCCESS,
  MESSAGE_TIPS_INFO,
  MESSAGE_TIPS_ERROR
} from '../actions'

const initialState = {
  show: false,
  text: '',
  level: 'Info'
};

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_TIPS_SUCCESS:
    case MESSAGE_TIPS_INFO:
    case MESSAGE_TIPS_ERROR:
      return Object.assign({}, state, {
        show: true,
        text: action.text,
        level: action.level
      });
    case MESSAGE_TIPS_HIDE:
      return Object.assign({}, state, {
        show: false
      });
    default:
      return state;
  }
}