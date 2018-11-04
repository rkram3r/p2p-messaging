import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { Provider } from 'react-redux';

// Polyfill set
import 'core-js/es6/set';
import 'babel-polyfill';
import 'bootstrap/dist/css/bootstrap.css';
import Router from './Router';
import store from './store';

const history = typeof window !== 'undefined'
  ? createBrowserHistory()
  : createMemoryHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} />
  </Provider>,
  document.getElementById('root'),
);
