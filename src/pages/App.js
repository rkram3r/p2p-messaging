import React from 'react';
import Header from './Header';
import Connection from './Connection';
import Contactlist from './Contactlist/index';
import CreateMessage from './CreateMessage';

export default () => (
  <section>
    <Header />
    <main role="main" className="container">
      <Connection />
      <Contactlist />
      <CreateMessage />
    </main>
  </section>
);
