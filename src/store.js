import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import connectionReducer from './redux/connectionReducer';
import p2pReducer from './redux/p2pReducer';

const history = createHistory();
const reduxRouterMiddleware = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ connectionReducer, p2pReducer }),
  undefined,
  composeEnhancers(applyMiddleware(thunk, reduxRouterMiddleware)),
);

export default store;
