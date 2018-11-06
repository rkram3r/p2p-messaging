import React from 'react';
import { Link } from 'react-router-dom';
import Phone from 'react-feather/dist/icons/phone';

export default ({ to, sendTo, name }) => {
  const list = sendTo ? JSON.parse(sendTo) : [];
  return (
    <Link
      to={`[${list.indexOf(to) === -1 ? [...list, to].join(',') : list.filter(x => x !== to).join(',')}]`}
      className={`list-group-item-action list-group-item ${list.indexOf(to) !== -1 && 'active'}`}
    >
      <Phone className="float-right" />
      {name}
    </Link>
  );
};
