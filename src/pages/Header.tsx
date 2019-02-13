import * as React from "react";
import { Subscribe } from "unstated";
import AppContainer from "../container/AppContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { ChannelState } from "../container/models/IChannel";

export default () => (
  <Subscribe to={[AppContainer]}>
    {({ state: { name, peerId, state } }: AppContainer) => (
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand">
          <span className="mb-0">P2P-Messaging</span>
        </span>
        <span className="navbar-brand text-right">
          <span>
            {state === ChannelState.Error && (
              <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
            )}
            {state === ChannelState.Ready && (
              <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
            )}{" "}
            {peerId}
          </span>
        </span>
      </nav>
    )}
  </Subscribe>
);
