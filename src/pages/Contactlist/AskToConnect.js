import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AskToConnect from 'react-feather/dist/icons/help-circle';
import * as Actions from '../../logic/actions';

export default connect(
  undefined,
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  createPeerConnection, name, contactlist, from, id,
}) => (
  <button
    onClick={() => createPeerConnection(contactlist, from, id)}
    type="button"
    className="list-group-item-action list-group-item"
  >
    <AskToConnect className="float-right" />
    {name}
  </button>
));
