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

export default () => (
  <Subscribe to={[ContactlistContainer]}>
    {({ contacts }: ContactlistContainer) => (
      <div className="py-2 col-sm-5 col-md-5 col-lg-5">
        {contacts
          .sort((a, b) => a.peerId - b.peerId)
          .map(({ name, state, peerId }) => (
            <button
              key={peerId}
              onClick={() => state.goToNextState()}
              type="button"
              className="list-group-item-action list-group-item"
            >
              <span className="px-1">{stateMap.get(state)}</span>
              {name}@{peerId}
            </button>
          ))}
      </div>
    )}
  </Subscribe>
);
