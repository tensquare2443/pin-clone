import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reduxPromise from 'redux-promise';
import reducers from 'reducers';
import {BrowserRouter} from 'react-router-dom';

export default ({children, initialState = {}}) => {
  const store = createStore(reducers, initialState, applyMiddleware(reduxPromise));
  return (
    <BrowserRouter>
      <Provider store={store}>{children}</Provider>
    </BrowserRouter>
  );
};
