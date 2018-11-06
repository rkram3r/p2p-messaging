import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import * as Actions from '../../redux/actions';
import Messages from '../Messages';
import Ready from './Ready';
import Connecting from './Connecting';
import AskToConnect from './AskToConnect';
import Ping from './Ping';

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

    if (peerFrom && peerFrom.state === 'CONNECTING' && connectingData.to && id === connectingData.to) {
      finalizeConnection(contactlist, connectingData);
    } else
    if (peerTo && peerTo.state !== 'CONNECTING' && connectingData.to && id !== connectingData.to) {
      forwardPing(contactlist, connectingData);
    }
  }

  render() {
    const {
      contactlist, match: { params: { sendTo } }, id,
      connectingData,
    } = this.props;
    return (
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <div className="row">
          <div className="my-3 p-3 bg-white rounded shadow-sm col-sm-4">
            <h5>Contactlist</h5>
            <div className="list-group">
              {Array.from(contactlist).map(([to, { name, state }]) => {
                if (state === 'READY') {
                  return <Ready key={to} {...{ sendTo, to, name }} />;
                }
                if (state === 'CONNECTING') {
                  return <Connecting key={to} name={name} />;
                }
                if (id === connectingData.to && to === connectingData.from) {
                  return <AskToConnect key={to} name={name} />;
                }
                return <Ping key={to} peer={{ to, name }} />;
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
