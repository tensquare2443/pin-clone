import {SET_USERS, REMOVE_USERS} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SET_USERS:
      return action.payload;
    case REMOVE_USERS:
      return false;
    default:
      return state;
  }
}
