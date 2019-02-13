import * as React from "react";
import { Subscribe } from "unstated";
import MessageContainer from "../container/MessageContainer";

export default () => (
  <Subscribe to={[MessageContainer]}>
    {(messageContainer: MessageContainer) => (
      <form
        className="form-group row shadow-sm py-3"
        onSubmit={event => event.preventDefault()}
      >
        <div className="col-sm-8 col-lg-10">
          <input
            className="form-control"
            placeholder="Message"
            value={messageContainer.state.message}
            onChange={({ target: { value } }) =>
              messageContainer.onMessageChange(value)
            }
            autoFocus={messageContainer.state.autoFocus}
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
      </form>
    )}
  </Subscribe>
);
