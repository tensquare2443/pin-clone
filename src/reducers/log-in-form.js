import {
  LOG_IN_FORM_CHANGE,
  LOG_IN_FORM_RESET
} from 'actions/types';

const defaultState = {
  email: {
    value: '',
    validity: ''
  },
  password: {
    value: '',
    validity: ''
  }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case LOG_IN_FORM_CHANGE:
      return action.payload;
    case LOG_IN_FORM_RESET:
      return defaultState;
    default:
      return state;
  }
}
