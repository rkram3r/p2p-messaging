import * as React from "react";
import { Subscribe } from "unstated";

import ContactlistContainer from "../container/ContactlistContainer";
import Menu from "./Menu";
import Contactlist from "./Contactlist";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";

export default () => {
  return (
    <Subscribe to={[ContactlistContainer]}>
      {(container: ContactlistContainer) => [
        <Menu key="header" />,
        container.any && (
          <main key="main" className="container-fluid py-3">
            <div className="row">
              <div className="col-sm-3">
                <Contactlist />
              </div>
              <div className="col-sm-9 container-fluid">
                <Messages />
              </div>
            </div>
            <CreateMessage />
          </main>
        )
      ]}
    </Subscribe>
  );
};
