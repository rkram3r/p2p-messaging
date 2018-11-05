import React from 'react';
import { Link } from 'react-router-dom';
import Phone from 'react-feather/dist/icons/phone';

export default ({ to, sendTo, name }) => (
  <Link
    to={`${to}`}
    className={`list-group-item-action list-group-item ${`${sendTo}` === `${to}` && 'active'}`}
  >
    <Phone className="float-right" />
    {name}
  </Link>
);
