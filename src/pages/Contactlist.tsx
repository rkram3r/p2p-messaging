import * as React from "react";
import { Subscribe } from "unstated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
  faChevronCircleRight
} from "@fortawesome/free-solid-svg-icons";

import ContactlistContainer from "../container/ContactlistContainer";
import { ChannelState } from "../container/models/IChannel";

const stateMap = new Map<ChannelState, JSX.Element>([
  [
    ChannelState.Ready,
    <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
  ],
  [ChannelState.Connecting, <FontAwesomeIcon icon={faChevronCircleRight} />],
  [ChannelState.AskToConnect, <FontAwesomeIcon icon={faQuestionCircle} />],
  [
    ChannelState.NotConnected,
    <FontAwesomeIcon className="text-danger" icon={faTimesCircle} />
  ]
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
      <div className="shadow-sm py-2 col-sm-5 col-md-5 col-lg-5">
        {container.contacts.map(({ name, state, peerId }) => (
          <State key={peerId} state={{ name }}>
            <span className="px-1">{stateMap.get(state)}</span>
          </State>
        ))}
      </div>
    )}
  </Subscribe>
);
