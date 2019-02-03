import * as React from "react";
import { Subscribe } from "unstated";
import AppContainer from "../container/AppContainer";
import { ConnectionContainer } from "../container/ConnectionContainer";

export default () => (
  <Subscribe to={[ConnectionContainer, AppContainer]}>
    {(connectionContainer: ConnectionContainer, appContainer: AppContainer) => (
      <div className="form-group row shadow-sm py-3">
        <div className="col-sm-8 col-lg-10">
          <input
            className="form-control"
            onChange={({ target: { value } }) =>
              connectionContainer.connectionChange(value)
            }
            placeholder="name@Address:Port"
            value={connectionContainer.state.connection}
          />
        </div>
        <div className="col-sm-4 col-lg-2">
          <button
            type="submit"
            className="float-right btn btn-block btn-primary"
            onClick={() =>
              appContainer.bootstrap(
                connectionContainer.state.address,
                connectionContainer.state.myName
              )
            }
          >
            Connect
          </button>
        </div>
      </div>
    )}
  </Subscribe>
);
