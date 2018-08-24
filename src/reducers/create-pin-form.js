import {
  CREATE_PIN_FORM_CHANGE,
  ERASE_CREATE_PIN_FORM
} from 'actions/types';

const defaultState = {
  url: {
    value: '',
    validity: ''
  },
  description: {
    value: '',
    validity: ''
  },
  image: {
    value: '',
    validity: ''
  }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case CREATE_PIN_FORM_CHANGE:
      return action.payload;
    case ERASE_CREATE_PIN_FORM:
      return defaultState;
    default:
      return state;
  }
}
