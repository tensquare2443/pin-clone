import {
  INSERT_MODAL,
  REMOVE_MODAL
} from 'actions/types';

export default function(state = false, action) {
  switch(action.type) {
    case INSERT_MODAL:
      return action.payload;
    case REMOVE_MODAL:
      return false;
    default:
      return state;
  }
}
