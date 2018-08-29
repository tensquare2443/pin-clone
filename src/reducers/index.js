import {combineReducers} from 'redux';
import userReducer from 'reducers/user';
import redirectReducer from 'reducers/redirect';
import signUpFormReducer from 'reducers/sign-up-form';
import logInFormReducer from 'reducers/log-in-form';
import modalReducer from 'reducers/modal';
import createPinFormReducer from 'reducers/create-pin-form';
import allPinsReducer from 'reducers/all-pins';
import usersReducer from 'reducers/users';
import pinReducer from 'reducers/pin';
import topicsReducer from 'reducers/topics';
import prevReducer from 'reducers/prev';
import boardReducer from 'reducers/board';
import profilePhotoModalReducer from 'reducers/profile-photo-modal';
import onBoardReducer from 'reducers/on-board';
import editBoardModalReducer from 'reducers/edit-board-modal';
import usersFollowingReducer from 'reducers/users-following';

export default combineReducers({
  user: userReducer,
  redirect: redirectReducer,
  signUpForm: signUpFormReducer,
  logInForm: logInFormReducer,
  createPinForm: createPinFormReducer,
  modal: modalReducer,
  allPins: allPinsReducer,
  users: usersReducer,
  pin: pinReducer,
  board: boardReducer,
  topics: topicsReducer,
  prev: prevReducer,
  profilePhotoModal: profilePhotoModalReducer,
  onBoard: onBoardReducer,
  editBoardModal: editBoardModalReducer,
  usersFollowing: usersFollowingReducer
});
