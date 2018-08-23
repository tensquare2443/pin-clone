import {SET_PINS, REMOVE_PINS} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SET_PINS:
      return action.payload;
    case REMOVE_PINS:
      return false;
    default:
      return state;
  }
}
