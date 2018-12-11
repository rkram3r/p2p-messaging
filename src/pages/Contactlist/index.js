import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as Actions from '../../logic/actions';
import Messages from '../Messages';
import Ready from './Ready';
import Connecting from './Connecting';
import AskToConnect from './AskToConnect';
import NotConnected from './NotConnected';

export default withRouter(connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  contactlist, match: { params: { sendTo } },
  id,
}) => (
  <div className="row">
    <div className="shadow-sm col-sm-4 col-lg-2 py-2">
      {Array.from(contactlist).map(([to, { name, state }]) => {
        if (state === 'PEER_READY') {
          return <Ready key={to} {...{ sendTo, to, name }} />;
        }
        if (state === 'CONNECTING_PEER') {
          return <Connecting key={to} name={name} />;
        }
        if (state === 'ASK_TO_CONNECT') {
          return <AskToConnect key={to} name={name} from={to} id={id} contactlist={contactlist} />;
        }
        return <NotConnected key={to} peer={{ to, name }} />;
      })}
    </div>
    <div className="col-sm-1 col-lg-1" />
    <Messages />
  </div>
)));
