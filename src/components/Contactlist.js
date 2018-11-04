import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import WifiOff from 'react-feather/dist/icons/wifi-off';
import WifiOn from 'react-feather/dist/icons/wifi';
import AskToConnect from 'react-feather/dist/icons/help-circle';

import * as Actions from '../redux/actions';
import Messages from './Messages';
import './Contactlist.scss';

class Contactlist extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      broadcastContactlist,
      contactlist,
      connectingData,
      id,
      finalizeConnection,
      forwardPing,
    } = this.props;

    if (prevProps.contactlist.size !== contactlist.size) {
      broadcastContactlist(contactlist);
    }
    const peerTo = contactlist.get(connectingData.to) || false;
    const peerFrom = contactlist.get(connectingData.from) || false;
    console.log(connectingData, id, peerFrom);
    if (peerFrom && peerFrom.state === 'CONNECTING' && connectingData.to && id === connectingData.to) {
      console.log('finalizeConnection', peerFrom, peerTo);
      finalizeConnection(contactlist, connectingData);
    } else
    if (peerTo && peerTo.state !== 'CONNECTING' && connectingData.to && id !== connectingData.to) {
      console.log('forwardPing', connectingData, peerFrom, peerTo);
      forwardPing(contactlist, connectingData);
    }
  }

  render() {
    const {
      contactlist, match: { params: { sendTo } }, id, ping,
      connectingData,
      createPeerConnection,
    } = this.props;
    return (
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <div className="row">
          <div className="my-3 p-3 bg-white rounded shadow-sm col-sm-4">
            <h5>Contactlist</h5>
            <div className="list-group">
              {Array.from(contactlist).map(([to, { name, state }]) => {
                console.log(to, name, state);
                if (state === 'READY') {
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`list-group-item-action list-group-item ${sendTo === to && 'active'}`}
                    >
                      <WifiOn className="glyphicon" />
                      {name}
                    </Link>
                  );
                }
                const message = { from: id, to, lastPeer: id };

                if (state === 'CONNECTING') {
                  return (
                    <div
                      key={to}
                      className="list-group-item-action list-group-item"
                    >
                      ...
                      {' '}
                      {name}
                    </div>
                  );
                }
                if (id === connectingData.to && to === connectingData.from) {
                  return (
                    <button
                      key={to}
                      onClick={() => createPeerConnection(contactlist, connectingData, id)}
                      type="button"
                      className="list-group-item-action list-group-item"
                    >
                      <AskToConnect className="glyphicon" />
                      {name}
                    </button>
                  );
                }


                return (
                  <button
                    key={to}
                    onClick={() => ping(contactlist, message, id)}
                    type="button"
                    className="list-group-item-action list-group-item"
                  >
                    <WifiOff className="glyphicon" />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          <Messages />
        </div>
      </div>
    );
  }
}
export default withRouter(connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(Contactlist));
