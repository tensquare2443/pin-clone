import {
  OPEN_EDIT_BOARD_MODAL,
  CLOSE_EDIT_BOARD_MODAL
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case OPEN_EDIT_BOARD_MODAL:
      return true;
    case CLOSE_EDIT_BOARD_MODAL:
      return false;
    default:
      return state;
  }
}
