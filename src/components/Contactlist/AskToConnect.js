import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AskToConnect from 'react-feather/dist/icons/help-circle';
import * as Actions from '../../redux/actions';

export default connect(
  state => ({ ...state.p2pReducer, ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  createPeerConnection, name, contactlist, connectingData, id,
}) => (
  <button
    onClick={() => createPeerConnection(contactlist, connectingData, id)}
    type="button"
    className="list-group-item-action list-group-item"
  >
    <AskToConnect className="glyphicon" />
    {name}
  </button>
));
