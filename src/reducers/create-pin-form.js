import {CREATE_PIN_FORM_CHANGE} from 'actions/types';

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
    default:
      return state;
  }
}
