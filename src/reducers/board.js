import {
  REMOVE_BOARD,
  SET_BOARD
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case REMOVE_BOARD:
      return false;
    case SET_BOARD:
      return action.payload;
    default:
      return state;
  }
}
