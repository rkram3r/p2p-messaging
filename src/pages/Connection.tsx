import * as React from "react";
import { Subscribe } from "unstated";
import ConnectionContainer from "../container/ConnectionContainer";

export default () => (
  <Subscribe to={[ConnectionContainer]}>
    {(container: ConnectionContainer) => (
      <form
        className="form-group row shadow-sm py-3"
        onSubmit={event => event.preventDefault()}
      >
        <div className="col-sm-8 col-lg-10">
          <input
            autoFocus={container.state.autoFocus}
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
            type="submit"
            className="float-right btn btn-block btn-primary"
            onClick={() => container.bootstrap()}
          >
            Connect
          </button>
        </div>
      </form>
    )}
  </Subscribe>
);
