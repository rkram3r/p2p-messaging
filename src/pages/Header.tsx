import * as React from "react";
import { Subscribe } from "unstated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faAngleDoubleRight
} from "@fortawesome/free-solid-svg-icons";
import { ChannelState } from "../container/models/IChannel";
import ConnectionContainer from "../container/ConnectionContainer";

export default () => (
  <Subscribe to={[ConnectionContainer]}>
    {(container: ConnectionContainer) => (
      <nav className="navbar navbar navbar-dark bg-dark justify-content-between">
        <div className="navbar-brand col-md-auto no-gutters">P2P-Messaging</div>
        {container.state.state === ChannelState.NotConnected && (
          <form
            className="form-inline col-md-9 no-gutters"
            onSubmit={event => event.preventDefault()}
          >
            <input
              autoFocus={container.state.autoFocus}
              className="form-control col no-gutters"
              onChange={({ target: { value } }) =>
                container.connectionChange(value)
              }
              placeholder="name@Address:Port"
              value={container.state.connection}
            />
            <button
              type="submit"
              className="btn btn-outline-success col-md-1 col-2"
              onClick={() => container.bootstrap()}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </form>
        )}
        {container.state.state === ChannelState.Ready && (
          <div className="col-md-auto no-gutters">
            <div className="navbar-brand">
              <span className="pr-2">{container.state.name}</span>
              <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
            </div>
          </div>
        )}
      </nav>
    )}
  </Subscribe>
);
