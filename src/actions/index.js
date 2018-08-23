import {
  CREATE_REDIRECT,
  REMOVE_REDIRECT,
  SIGN_UP_EMAIL_CHANGE,
  SIGN_UP_PASSWORD_CHANGE,
  SIGN_UP_AGE_CHANGE,
  SIGN_UP_ERRORS,
  SIGN_UP_VALIDATE,
  SIGN_UP_RESET,
  SIGN_IN,
  LOG_IN_FORM_CHANGE,
  LOG_IN_FORM_RESET,
  INSERT_MODAL,
  REMOVE_MODAL,
  CREATE_PIN_FORM_CHANGE,
  SET_PINS,
  REMOVE_PINS,
  SET_USERS,
  REMOVE_USERS
} from 'actions/types';

export function setUsers(users) {
  if (users) {
    return {
      type: SET_USERS,
      payload: users
    };
  } else {
    return {type: REMOVE_USERS};
  }
}

export function setPins(pins) {
  if (pins) {
    return {
      type: SET_PINS,
      payload: pins
    };
  } else {
    return {type: REMOVE_PINS};
  }
}

export function createPinFormChange(createPinForm) {
  return {
    type: CREATE_PIN_FORM_CHANGE,
    payload: createPinForm
  };
}

export function toggleModal(modal) {
  if (modal === 'Pin' || modal === 'Board') {
    return {
      type: INSERT_MODAL,
      payload: modal
    };
  } else if (!modal) {
    return {type: REMOVE_MODAL}
  }
}

export function logInFormReset() {
  return {type: LOG_IN_FORM_RESET};
}

export function logInFormChange(logInForm) {
  return {
    type: LOG_IN_FORM_CHANGE,
    payload: logInForm
  };
}

export function signIn(user) {
  return {
    type: SIGN_IN,
    payload: user
  }
}

export function signUpReset() {
  return {type: SIGN_UP_RESET};
}

export function signUpValidate() {
  return {type: SIGN_UP_VALIDATE};
}

export function signUpErrors(errors) {
  return {
    type: SIGN_UP_ERRORS,
    payload: errors
  };
}

export function signUpChange(e) {
  const input = e.currentTarget.getAttribute('placeholder');
  const inputValue = e.currentTarget.value;

  switch(input) {
    case 'Email':
      return {
        type: SIGN_UP_EMAIL_CHANGE,
        payload: inputValue
      }
    case 'Password':
    return {
      type: SIGN_UP_PASSWORD_CHANGE,
      payload: inputValue
    }
    case 'Age':
    return {
      type: SIGN_UP_AGE_CHANGE,
      payload: inputValue
    }
    default: return;
  }
}

export function createRedirect(redirectPage) {
  return {
    type: CREATE_REDIRECT,
    payload: redirectPage
  }
}

export function removeRedirect() {
  return {type: REMOVE_REDIRECT};
}
