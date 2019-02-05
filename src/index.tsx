import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "unstated";
import io from "socket.io-client";
import LinkedListOverlayNetwork from "./container/models/LinkedListOverlayNetwork";
import "./variables.scss";
import Router from "./Router";
import AppContainer, { AppState } from "./container/AppContainer";
import { ChannelType } from "./container/models/IChannel";
import IChannelPlugin from "./container/channelPlugins/IChannelPlugin";
import {
  ContactListPlugin,
  MessagePlugin
} from "./container/channelPlugins/ContactListPlugin";

const linkexListOverlayNetwork = new LinkedListOverlayNetwork(io);
const pluginMap = new Map<ChannelType, IChannelPlugin<AppState>>();

pluginMap.set(ChannelType.Contactlist, new ContactListPlugin());
pluginMap.set(ChannelType.SendMessages, new MessagePlugin());

const appContainer = new AppContainer(linkexListOverlayNetwork, pluginMap);

ReactDOM.render(
  <Provider inject={[appContainer]}>
    <Router />
  </Provider>,
  document.getElementById("root")
);
