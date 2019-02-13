import * as React from "react";
import { Subscribe } from "unstated";
import MessageContainer from "../container/MessageContainer";

export default () => (
  <Subscribe to={[MessageContainer]}>
    {(messageContainer: MessageContainer) => (
      <div className="form-group row shadow-sm py-3">
        <div className="col-sm-8 col-lg-10">
          <input
            className="form-control"
            placeholder="Message"
            value={messageContainer.state.message}
            onChange={({ target: { value } }) =>
              messageContainer.onMessageChange(value)
            }
          />
        </div>
        <div className="col-sm-4 col-lg-2">
          <button
            type="submit"
            className="float-right btn btn-block btn-primary"
            onClick={() => messageContainer.send()}
          >
            Send
          </button>
        </div>
      </div>
    )}
  </Subscribe>
);
