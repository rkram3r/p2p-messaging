import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "unstated";

import "./variables.scss";
import Router from "./Router";

ReactDOM.render(
  <Provider>
    <Router />
  </Provider>,
  document.getElementById("root")
);
