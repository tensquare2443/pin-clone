import {
  SET_USERS_FOLLOWING,
  REMOVE_USERS_FOLLOWING
} from 'actions/types';

export default function(state = false, action) {
  switch(action.type) {
    case SET_USERS_FOLLOWING:
      return action.payload;
    case REMOVE_USERS_FOLLOWING:
      return false;
    default:
      return state;
  }
}
