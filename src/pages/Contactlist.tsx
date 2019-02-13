import * as React from "react";
import { Subscribe } from "unstated";
import ReadyIcon from "react-feather/dist/icons/check-circle";
import AskToConnectIcon from "react-feather/dist/icons/help-circle";
import NotConnectedIcon from "react-feather/dist/icons/x-circle";
import ConnectingIcon from "react-feather/dist/icons/arrow-right-circle";

import ContactlistContainer from "../container/ContactlistContainer";
import { ChannelState } from "../container/models/IChannel";

const stateMap = new Map<ChannelState, JSX.Element>([
  [ChannelState.Ready, <ReadyIcon className="float-right text-success" />],
  [ChannelState.Connecting, <ConnectingIcon className="float-right" />],
  [ChannelState.AskToConnect, <AskToConnectIcon className="float-right" />],
  [ChannelState.NotConnected, <NotConnectedIcon className="float-right" />]
]);

const State = ({
  state,
  children
}: {
  state: {
    goToNextState?: () => void;
    name: string;
  };
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={() => state.goToNextState()}
      type="button"
      className="list-group-item-action list-group-item"
    >
      {children}
      {state.name}
    </button>
  );
};

export default () => (
  <Subscribe to={[ContactlistContainer]}>
    {(container: ContactlistContainer) => (
      <div className="shadow-sm col-sm-4 col-md-4 col-lg-4 py-2">
        {container.contacts.map(({ name, state, peerId }) => (
          <State key={peerId} state={{ name }}>
            {stateMap.get(state)}
          </State>
        ))}
      </div>
    )}
  </Subscribe>
);
