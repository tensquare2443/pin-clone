import {SIGN_IN, SIGN_OUT} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SIGN_IN:
    //sign in here
      return action.payload;
    case SIGN_OUT:
    //sign out here
      return false;
    default:
      return state;
  }
}
