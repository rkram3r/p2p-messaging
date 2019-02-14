import * as React from "react";
import { Subscribe } from "unstated";

import ContactlistContainer from "../container/ContactlistContainer";
import Header from "./Header";
import Contactlist from "./Contactlist";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";

export default () => {
  return (
    <Subscribe to={[ContactlistContainer]}>
      {(container: ContactlistContainer) => [
        <Header key="header" />,
        <main key="main" role="main" className="container-fluid">
          <div className="row">
            {container.any && <Contactlist />}
            <Messages />
          </div>
          {container.any && <CreateMessage />}
        </main>
      ]}
    </Subscribe>
  );
};
