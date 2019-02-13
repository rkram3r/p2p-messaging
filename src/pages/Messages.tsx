import * as React from "react";
import { Subscribe } from "unstated";

import "./Messages.scss";
import MessageContainer from "../container/MessageContainer";
import AppContainer from "../container/AppContainer";

export default () => (
  <Subscribe to={[MessageContainer, AppContainer]}>
    {(messageContainer: MessageContainer) => (
      <div className="col-sm-7 col-md-7 col-lg-7">
        {messageContainer.state.messages
          .sort((a, b) => a.timeStamp - b.timeStamp)
          .map(({ from, id, message }) => (
            <div
              key={id}
              className={`my-2 speech-bubble-${from ? "me" : "other"}`}
            >
              {message}
            </div>
          ))}
      </div>
    )}
  </Subscribe>
);
