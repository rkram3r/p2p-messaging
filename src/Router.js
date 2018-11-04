import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';

import App from './components/App';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/:sendTo?" component={App} />
      <Route component={App} />
    </Switch>
  </BrowserRouter>
);
