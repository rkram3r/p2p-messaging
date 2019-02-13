import * as React from "react";
import { Subscribe } from "unstated";
import ConnectionContainer from "../container/ConnectionContainer";

export default () => (
  <Subscribe to={[ConnectionContainer]}>
    {(container: ConnectionContainer) => (
      <div className="form-group row shadow-sm py-3">
        <div className="col-sm-8 col-lg-10">
          <input
            className="form-control"
            onChange={({ target: { value } }) =>
              container.connectionChange(value)
            }
            placeholder="name@Address:Port"
            value={container.state.connection}
          />
        </div>
        <div className="col-sm-4 col-lg-2">
          <button
            autoFocus={container.state.autoFocus}
            type="submit"
            className="float-right btn btn-block btn-primary"
            onClick={() => container.bootstrap()}
          >
            Connect
          </button>
        </div>
      </div>
    )}
  </Subscribe>
);
