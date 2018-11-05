import React from 'react';
import Connecting from 'react-feather/dist/icons/phone-call';

export default ({ name }) => (
  <div
    className="list-group-item-action list-group-item"
  >
    <Connecting className="float-right" />
    {name}
  </div>
);
