import * as React from "react";
import { Subscribe } from "unstated";
import ReadyIcon from "react-feather/dist/icons/check-circle";
import AskToConnectIcon from "react-feather/dist/icons/help-circle";
import NotConnectedIcon from "react-feather/dist/icons/x-circle";
import ConnectingIcon from "react-feather/dist/icons/arrow-right-circle";

import Status from "./States";
import ContactlistContainer from "../container/ContactlistContainer";
import { ChannelState } from "../container/models/IChannel";

const stateMap = new Map<ChannelState, JSX.Element>([
  [ChannelState.Ready, <ReadyIcon className="float-right text-success" />],
  [ChannelState.Connecting, <ConnectingIcon className="float-right" />],
  [ChannelState.AskToConnect, <AskToConnectIcon className="float-right" />],
  [ChannelState.NotConnected, <NotConnectedIcon className="float-right" />]
]);

export default () => (
  <Subscribe to={[ContactlistContainer]}>
    {(container: ContactlistContainer) => (
      <div className="shadow-sm col-sm-4 col-md-4 col-lg-4 py-2">
        {Object.keys(container.state).map(peerId => {
          const { name, state } = container.state[peerId];
          return (
            <Status key={peerId} status={{ name }}>
              {stateMap.get(state)}
            </Status>
          );
        })}
      </div>
    )}
  </Subscribe>
);
