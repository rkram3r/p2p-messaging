import React from 'react';
import { Link } from 'react-router-dom';
import WifiOn from 'react-feather/dist/icons/wifi';

export default ({ to, sendTo, name }) => (
  <Link
    to={`${to}`}
    className={`list-group-item-action list-group-item ${`${sendTo}` === `${to}` && 'active'}`}
  >
    <WifiOn className="glyphicon" />
    {name}
  </Link>
);
