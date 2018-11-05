import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WifiOff from 'react-feather/dist/icons/wifi-off';
import * as Actions from '../../redux/actions';

export default connect(
  state => ({ ...state.p2pReducer, ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  ping, peer: { to, name }, contactlist, id,
}) => {
  const message = { from: id, to, lastPeer: id };

  return (
    <button
      onClick={() => ping(contactlist, message, id)}
      type="button"
      className="list-group-item-action list-group-item"
    >
      <WifiOff className="glyphicon" />
      {console.log(name, id)}
      {name}
    </button>
  );
});
