import * as React from "react";
import { Subscribe } from "unstated";

import ContactlistContainer from "../container/ContactlistContainer";
import Header from "./Header";
import Connection from "./Connection";
import Contactlist from "./Contactlist";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";

export default () => {
  return (
    <Subscribe to={[ContactlistContainer]}>
      {(container: ContactlistContainer) => (
        <section>
          <Header />
          <main role="main" className="container-fluid">
            <Connection />
            <div className="row">
              {container.any && <Contactlist />}
              <Messages />
            </div>
            {container.any && <CreateMessage />}
          </main>
        </section>
      )}
    </Subscribe>
  );
};
