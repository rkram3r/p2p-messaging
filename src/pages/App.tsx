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
          <main role="main" className="container">
            <Connection />
            <div className="row">
              {Object.keys(container.state.contactlist).length !== 0 && (
                <Contactlist />
              )}
              <div className="col-sm-1 col-lg-1" />
              <Messages />
            </div>
            {Object.keys(container.state.contactlist).length !== 0 && (
              <CreateMessage />
            )}
          </main>
        </section>
      )}
    </Subscribe>
  );
};
