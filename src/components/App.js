import React from 'react';
import Header from './Header';
import Connection from './Connection';
import Contactlist from './Contactlist';
import CreateMessage from './CreateMessage';

const app = () => (
  <section>
    <Header />
    <main role="main" className="container">
      <Connection />
      <Contactlist />
      <CreateMessage />
    </main>
  </section>
);


export default app;
