import {
  SET_PREV,
  REMOVE_PREV
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SET_PREV:
      return action.payload;
    case REMOVE_PREV:
      return false;
    default:
      return state;
  }
}
