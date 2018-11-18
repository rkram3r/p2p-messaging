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

class Contactlist extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      broadcastContactlist,
      contactlist,
      connectingData,
      id,
      finalizeConnection,
      forwardPing,
      updatePeer,
    } = this.props;

    if (prevProps.contactlist.size !== contactlist.size) {
      broadcastContactlist(contactlist);
    }
    const peerTo = contactlist.get(connectingData.to) || false;
    const peerFrom = contactlist.get(connectingData.from) || false;

    if (peerFrom && peerFrom.state === 'CONNECTING' && connectingData.to && id === connectingData.to) {
      finalizeConnection(contactlist, connectingData);
    } else if (peerFrom && peerFrom.state !== 'ASK_TO_CONNECT' && peerFrom.state !== 'READY' && id === connectingData.to) {
      updatePeer(connectingData.from, 'ASK_TO_CONNECT', connectingData);
    }
    if (peerTo && peerTo.state !== 'CONNECTING' && connectingData.to && id !== connectingData.to) {
      forwardPing(contactlist, connectingData, id);
    }
  }

  render() {
    const {
      contactlist, match: { params: { sendTo } },
    } = this.props;
    return (
      <div className="row">
        <div className="shadow-sm col-sm-4 col-lg-2 py-2">
          {Array.from(contactlist).map(([to, { name, state }]) => {
            if (state === 'READY') {
              return <Ready key={to} {...{ sendTo, to, name }} />;
            }
            if (state === 'CONNECTING') {
              return <Connecting key={to} name={name} />;
            }
            if (state === 'ASK_TO_CONNECT') {
              return <AskToConnect key={to} name={name} from={to} />;
            }
            return <NotConnected key={to} peer={{ to, name }} />;
          })}
        </div>
        <div className="col-sm-1 col-lg-1" />
        <Messages />
      </div>
    );
  }
}
export default withRouter(connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(Contactlist));
