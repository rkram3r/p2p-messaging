import * as React from "react";
import { Subscribe } from "unstated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faArrowsAltV } from "@fortawesome/free-solid-svg-icons";
import ContactlistContainer from "../container/ContactlistContainer";
import MenuContainer from "../container/MenuContainer";
import { ChannelState } from "../container/models/IChannel";

export default () => (
  <Subscribe to={[ContactlistContainer, MenuContainer]}>
    {({ contacts }: ContactlistContainer, container: MenuContainer) => (
      <div className="d-flex flex-column">
        {contacts
          .sort((a, b) => a.peerId - b.peerId)
          .map(({ name, state, peerId }, index) => {
            const additionalClass =
              container.state.peerId === peerId
                ? ""
                : state === ChannelState.Ready
                ? "text-success"
                : "text-danger";
            return [
              <div key={peerId} className="card text-center">
                <FontAwesomeIcon
                  size={"3x"}
                  className={`card-img mx-auto ${additionalClass}`}
                  icon={faUserCircle}
                />
                <h5 className="card-title">
                  {name}@{peerId}
                </h5>
              </div>,
              index !== contacts.length - 1 && (
                <div className="card" key={peerId + "connector"}>
                  <FontAwesomeIcon
                    size={"3x"}
                    className="card-img-top mx-auto"
                    icon={faArrowsAltV}
                  />
                </div>
              )
            ];
          })}
      </div>
    )}
  </Subscribe>
);
