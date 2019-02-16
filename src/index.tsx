import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "unstated";
import io from "socket.io-client";
import LinkedListOverlayNetwork from "./container/models/LinkedListOverlayNetwork";
import "./variables.scss";
import App from "./pages/App";
import MessageContainer from "./container/MessageContainer";
import ContactlistContainer from "./container/ContactlistContainer";
import MenuContainer from "./container/MenuContainer";

const linkedListOverlayNetwork = new LinkedListOverlayNetwork(io, 10000);
const messageContainer = new MessageContainer(linkedListOverlayNetwork);
const contactlistContainer = new ContactlistContainer(linkedListOverlayNetwork);
const menuContainer = new MenuContainer(linkedListOverlayNetwork);
ReactDOM.render(
  <Provider inject={[contactlistContainer, messageContainer, menuContainer]}>
    <App />
  </Provider>,
  document.getElementById("root")
);
