import * as React from "react";
import { Subscribe } from "unstated";

import AppContainer from "../container/AppContainer";
import Header from "./Header";
import Connection from "./Connection";
import Contactlist from "./Contactlist";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";

export default () => {
  return (
    <Subscribe to={[AppContainer]}>
      {(container: AppContainer) => (
        <section>
          <Header />
          <main role="main" className="container">
            <Connection />
            <div className="row">
              {container.state.contactlist.size !== 0 && <Contactlist />}
              <div className="col-sm-1 col-lg-1" />
              <Messages />
            </div>
            {container.state.contactlist.size !== 0 && <CreateMessage />}
          </main>
        </section>
      )}
    </Subscribe>
  );
};
