import * as React from "react";
import { Subscribe } from "unstated";

import "./Messages.scss";
import AppContainer from "../container/AppContainer";

export default () => (
  <Subscribe to={[AppContainer]}>
    {(container: AppContainer) => (
      <div className="col-sm-7 col-lg-9">
        {container.state.messages
          .sort((a, b) => a.timeStamp - b.timeStamp)
          .map(({ from, id, message }) => (
            <div
              key={id}
              className={`my-2 speech-bubble-${
                from === container.state.myId ? "me" : "other"
              }`}
            >
              <span className="speech-bubble-name">{name}</span>
              {message}
            </div>
          ))}
      </div>
    )}
  </Subscribe>
);
