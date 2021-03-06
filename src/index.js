import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import App from "./components/app";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
   <App/>
  </Provider>
  , document.getElementById('root'));


