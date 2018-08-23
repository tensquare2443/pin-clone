import {CREATE_REDIRECT, REMOVE_REDIRECT} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case CREATE_REDIRECT:
      /*if (action.payload === 'home') {
        return '/';
      } else*/ return action.payload;
    case REMOVE_REDIRECT:
      return false;
    default:
      return state;
  }
}
