import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "unstated";
import io from "socket.io-client";
import LinkedListOverlayNetwork from "./container/models/LinkedListOverlayNetwork";
import "./variables.scss";
import Router from "./Router";
import AppContainer from "./container/AppContainer";
import MessageContainer from "./container/MessageContainer";
import ContactlistContainer from "./container/ContactlistContainer";
import ConnectionContainer from "./container/ConnectionContainer";

const linkexListOverlayNetwork = new LinkedListOverlayNetwork(io, 3000);
const appContainer = new AppContainer(linkexListOverlayNetwork);
const messageContainer = new MessageContainer(linkexListOverlayNetwork);
const contactlistContainer = new ContactlistContainer(linkexListOverlayNetwork);
const connectionContainer = new ConnectionContainer(linkexListOverlayNetwork);

ReactDOM.render(
  <Provider
    inject={[
      appContainer,
      messageContainer,
      contactlistContainer,
      connectionContainer
    ]}
  >
    <Router />
  </Provider>,
  document.getElementById("root")
);
