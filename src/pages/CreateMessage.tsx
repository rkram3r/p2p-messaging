import * as React from "react";
import { withRouter } from "react-router";
import { Subscribe } from "unstated";
import AppContainer from "../container/AppContainer";
import MessageContainer from "../container/MessageContainer";

export default withRouter(props => (
  <Subscribe to={[MessageContainer, AppContainer]}>
    {(messageContainer: MessageContainer, appContainer: AppContainer) => (
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
            onClick={() => {
              appContainer.send(
                messageContainer.state.message,
                props.match.params
              );
              messageContainer.cleanInput();
            }}
          >
            Send
          </button>
        </div>
      </div>
    )}
  </Subscribe>
));
