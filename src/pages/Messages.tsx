import * as React from "react";
import { Subscribe } from "unstated";

import "./Messages.scss";
import MessageContainer from "../container/MessageContainer";

export default () => (
  <Subscribe to={[MessageContainer]}>
    {(messageContainer: MessageContainer) => (
      <div className="col-sm-7 col-md-7 col-lg-7">
        {messageContainer.state.messages
          .sort((a, b) => a.timeStamp - b.timeStamp)
          .map(({ from, timeStamp, message }) => (
            <div
              key={timeStamp}
              className={`my-2 speech-bubble-${
                from === undefined ? "me" : "other"
              }`}
            >
              {message}
            </div>
          ))}
      </div>
    )}
  </Subscribe>
);
