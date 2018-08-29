import {
  SIGN_IN,
  LOG_OUT,
  SET_USER
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SIGN_IN:
    //sign in here
      return action.payload;
    case SET_USER:
      //set user here
        return action.payload;
    case LOG_OUT:
    //sign out here
      return false;
    default:
      return state;
  }
}
