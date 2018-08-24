import {
  SET_PIN,
  REMOVE_PIN
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SET_PIN:
      return action.payload;
    case REMOVE_PIN:
      return false;
    default:
      return state;
  }
}
