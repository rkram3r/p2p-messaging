import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Subscribe, Container } from "unstated";
import App from "./pages/App";
import AppContainer from "./container/AppContainer";

export default () => (
  <Subscribe to={[AppContainer]}>
    {(appContainer: AppContainer) => (
      <BrowserRouter>
        <Switch>
          <Route exact path="/:sendTo?" component={App} />
          <Route component={App} />
        </Switch>
      </BrowserRouter>
    )}
  </Subscribe>
);
