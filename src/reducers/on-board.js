import {
  ON_BOARD,
  OFF_BOARD
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case ON_BOARD:
      return true;
    case OFF_BOARD:
      return false;
    default:
      return state;
  }
}
