import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import connectionReducer from './logic/connectionReducer';
import p2pReducer from './logic/p2pReducer';
import p2pMiddleware from './logic/p2pMiddleware';

const history = createHistory();
const reduxRouterMiddleware = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ connectionReducer, p2pReducer }),
  undefined,
  composeEnhancers(applyMiddleware(thunk, reduxRouterMiddleware, p2pMiddleware)),
);

export default store;
