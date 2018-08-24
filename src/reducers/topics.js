import {
  SET_TOPICS,
  REMOVE_TOPICS
} from 'actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case SET_TOPICS:
      return action.payload;
    case REMOVE_TOPICS:
      return false;
    default:
      return state;
  }
}
