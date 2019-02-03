import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "unstated";

// Polyfill set
import "core-js/es6/set";
import "babel-polyfill";
import "./variables.scss";
import Router from "./Router";

ReactDOM.render(
  <Provider>
    <Router />
  </Provider>,
  document.getElementById("root")
);
