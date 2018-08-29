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
  SET_USER,
  LOG_IN_FORM_CHANGE,
  LOG_IN_FORM_RESET,
  INSERT_MODAL,
  REMOVE_MODAL,
  CREATE_PIN_FORM_CHANGE,
  ERASE_CREATE_PIN_FORM,
  SET_PINS,
  REMOVE_PINS,
  SET_USERS,
  REMOVE_USERS,
  SET_PIN,
  REMOVE_PIN,
  SET_TOPICS,
  REMOVE_TOPICS,
  SET_PREV,
  REMOVE_PREV,
  SET_BOARD,
  REMOVE_BOARD,
  OPEN_PROF_PHOTO_MODAL,
  CLOSE_PROF_PHOTO_MODAL,
  OPEN_EDIT_BOARD_MODAL,
  CLOSE_EDIT_BOARD_MODAL,
  ON_BOARD,
  OFF_BOARD,
  SET_USERS_FOLLOWING,
  REMOVE_USERS_FOLLOWING,
  LOG_OUT
} from 'actions/types';

export function setUsersFollowing(usersFollowing) {
  if (!usersFollowing) {
    return {type: REMOVE_USERS_FOLLOWING};
  } else {
    return {
      type: SET_USERS_FOLLOWING,
      payload: usersFollowing
    };
  }
}

export function toggleEditBoardModal(toggle) {
  if (toggle === 'open') {
    return {type: OPEN_EDIT_BOARD_MODAL};
  } else if (toggle === 'close') {
    return {type: CLOSE_EDIT_BOARD_MODAL};
  }
}

export function setOnBoard(onBoard) {
  if (!onBoard) {
    return {
      type: OFF_BOARD
    };
  } else {
    return {
      type: ON_BOARD
    };
  }
}

export function toggleProfilePhotoModal(toggle) {
  if (toggle === 'open') {
    return {type: OPEN_PROF_PHOTO_MODAL};
  } else if (toggle === 'close') {
    return {type: CLOSE_PROF_PHOTO_MODAL};
  }
}

export function setBoard(board) {
  if (!board) {
    return {type: REMOVE_BOARD};
  } else {
    return {
      type: SET_BOARD,
      payload: board
    };
  }
}

export function setPrev(prev) {
  if (!prev) {
    return {type: REMOVE_PREV};
  } else {
    return {
      type: SET_PREV,
      payload: prev
    };
  }
}

export function setTopics(topics) {
  if (!topics) {
    return {type: REMOVE_TOPICS};
  } else {
    return {
      type: SET_TOPICS,
      payload: topics
    };
  }
}

export function setPin(pinToSet) {
  if (!pinToSet) {
    return {type: REMOVE_PIN};
  } else {
    return {
      type: SET_PIN,
      payload: pinToSet
    };
  }
}

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
  if (!createPinForm) {
    return {type: ERASE_CREATE_PIN_FORM};
  } else {
    return {
      type: CREATE_PIN_FORM_CHANGE,
      payload: createPinForm
    };
  }
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

export function setUser(user) {
  if (!user) {
    return {type: LOG_OUT};
  } else {
    return {
      type: SET_USER,
      payload: user
    };
  }
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
