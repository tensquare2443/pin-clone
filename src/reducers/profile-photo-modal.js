import {
  OPEN_PROF_PHOTO_MODAL,
  CLOSE_PROF_PHOTO_MODAL
} from 'actions/types';

export default function(state = false, action) {
  switch(action.type) {
    case OPEN_PROF_PHOTO_MODAL:
      return true;
    case CLOSE_PROF_PHOTO_MODAL:
      return false;
    default:
      return state;
  }
}
