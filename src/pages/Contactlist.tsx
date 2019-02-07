import * as React from "react";
import { Subscribe } from "unstated";
import ReadyIcon from "react-feather/dist/icons/check-circle";
import AskToConnectIcon from "react-feather/dist/icons/help-circle";
import NotConnectedIcon from "react-feather/dist/icons/x-circle";
import ConnectingIcon from "react-feather/dist/icons/arrow-right-circle";

import Status from "./States";
import ContactlistContainer from "../container/ContactlistContainer";
import { ChannelState } from "../container/models/IChannel";

export default () => (
  <Subscribe to={[ContactlistContainer]}>
    {(container: ContactlistContainer) => (
      <div className="shadow-sm col-sm-4 col-lg-3 py-2">
        {Object.keys(container.state.contactlist).map(key => {
          const { peerId, name, state } = container.state.contactlist[key];
          if (state === ChannelState.Ready) {
            return (
              <Status key={peerId} status={{ name }}>
                <ReadyIcon className="float-right text-success" />
              </Status>
            );
          }
          if (state === ChannelState.Connecting) {
            return (
              <Status key={peerId} status={{ name }}>
                <ConnectingIcon className="float-right" />
              </Status>
            );
          }
          if (state === ChannelState.AskToConnect) {
            return (
              <Status
                key={peerId}
                status={{
                  name,
                  goToNextState: () => container.setupConnection(peerId)
                }}
              >
                <AskToConnectIcon className="float-right" />
              </Status>
            );
          }
          return (
            <Status
              key={peerId}
              status={{
                name,
                goToNextState: () => container.connectTo(peerId)
              }}
            >
              <NotConnectedIcon className="float-right" />
            </Status>
          );
        })}
      </div>
    )}
  </Subscribe>
);
