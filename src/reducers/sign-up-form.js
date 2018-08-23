import {
  SIGN_UP_EMAIL_CHANGE,
  SIGN_UP_PASSWORD_CHANGE,
  SIGN_UP_AGE_CHANGE,
  SIGN_UP_ERRORS,
  SIGN_UP_VALIDATE,
  SIGN_UP_RESET
} from 'actions/types';

const defaultState = {
  email: {
    value: '',
    validity: ''
  },
  password: {
    value: '',
    validity: ''
  },
  age: {
    value: '',
    validity: ''
  }
};

export default function(state = defaultState, action) {
  var signUpForm = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case SIGN_UP_EMAIL_CHANGE:
      signUpForm.email.value = action.payload;
      return signUpForm;
    case SIGN_UP_PASSWORD_CHANGE:
      signUpForm.password.value = action.payload;
      return signUpForm;
    case SIGN_UP_AGE_CHANGE:
      signUpForm.age.value = action.payload;
      return signUpForm;
    case SIGN_UP_ERRORS:
      Object.keys(action.payload).forEach((field) => {
        if (action.payload[field] !== false) {
          signUpForm[field].validity = action.payload[field];
        } else {
          signUpForm[field].validity = '';
        }
      });
      return signUpForm;
    case SIGN_UP_VALIDATE:
      signUpForm.email.validity = 'valid';
      signUpForm.password.validity = 'valid';
      signUpForm.age.validity = 'valid';
      return signUpForm;
    case SIGN_UP_RESET:
      return defaultState;
    default:
      return state;
  }
}
