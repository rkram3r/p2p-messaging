import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "unstated";
import io from "socket.io-client";
import LinkedListOverlayNetwork from "./container/models/LinkedListOverlayNetwork";
import "./variables.scss";
import Router from "./Router";
import AppContainer from "./container/AppContainer";

const linkexListOverlayNetwork = new LinkedListOverlayNetwork(io);
const appContainer = new AppContainer(linkexListOverlayNetwork);

ReactDOM.render(
  <Provider inject={[appContainer]}>
    <Router />
  </Provider>,
  document.getElementById("root")
);
