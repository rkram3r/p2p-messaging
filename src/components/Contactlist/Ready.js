import React from 'react';
import { Link } from 'react-router-dom';
import Ready from 'react-feather/dist/icons/check-circle';

export default ({ to, sendTo, name }) => {
  const list = sendTo ? JSON.parse(sendTo) : [];
  return (
    <Link
      to={`[${list.indexOf(to) === -1 ? [...list, to].join(',') : list.filter(x => x !== to).join(',')}]`}
      className={`list-group-item-action list-group-item ${list.indexOf(to) !== -1 && 'active'}`}
    >
      <Ready className="float-right text-success" />
      {name}
    </Link>
  );
};
