import * as React from "react";
import { Subscribe } from "unstated";
import ReadyIcon from "react-feather/dist/icons/check-circle";
import AskToConnectIcon from "react-feather/dist/icons/help-circle";
import NotConnectedIcon from "react-feather/dist/icons/x-circle";
import ConnectingIcon from "react-feather/dist/icons/arrow-right-circle";

import Status from "./Status";
import AppContainer from "../container/AppContainer";
import { ContactStatus } from "../container/models/IChannel";

export default () => (
  <Subscribe to={[AppContainer]}>
    {(container: AppContainer) => (
      <div className="shadow-sm col-sm-4 col-lg-2 py-2">
        {Array.from(container.state.contactlist).map(
          ([id, { name, status }]) => {
            if (status === ContactStatus.Ready) {
              return (
                <Status key={id} status={{ name }}>
                  <ReadyIcon className="float-right text-success" />
                </Status>
              );
            }
            if (status === ContactStatus.Connecting) {
              return (
                <Status key={id} status={{ name }}>
                  <ConnectingIcon className="float-right" />
                </Status>
              );
            }
            if (status === ContactStatus.AskToConnect) {
              return (
                <Status
                  key={id}
                  status={{
                    name,
                    goToNextState: () => container.setupConnection(id)
                  }}
                >
                  <AskToConnectIcon className="float-right" />
                </Status>
              );
            }
            return (
              <Status
                key={id}
                status={{
                  name,
                  goToNextState: () => container.connectTo(id)
                }}
              >
                <NotConnectedIcon className="float-right" />
              </Status>
            );
          }
        )}
      </div>
    )}
  </Subscribe>
);
