import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Connection from './Connection';
import Contactlist from './Contactlist/index';
import CreateMessage from './CreateMessage';

export default connect(state => ({ ...state.p2pReducer }))(
  ({ contactlist }) => (
    <section>
      <Header />
      <main role="main" className="container">
        <Connection />
        {contactlist.size > 0 && <Contactlist />}
        {contactlist.size > 0 && <CreateMessage />}
      </main>
    </section>
  ),
);
