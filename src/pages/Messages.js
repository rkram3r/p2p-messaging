import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ready from 'react-feather/dist/icons/check-circle';
import * as Actions from '../logic/actions';
import './Messages.scss';

export default connect(
  state => ({ ...state.p2pReducer, ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({ recievedMessages, myName, verify }) => (
  <div className="col-sm-7 col-lg-9">
    {recievedMessages.map(({
      myMessage, name, message, recieved, verified, peer, messageId,
    }) => {
      if (myMessage) {
        return (
          <div key={recieved} className="my-2 speech-bubble-me">
            <span className="speech-bubble-name">{name || myName}</span>
            {message}
            {verified && <Ready className="float-right text-success badge" />}
          </div>
        );
      }
      return (
        <div key={recieved} className="my-2 speech-bubble-other">
          <button type="button" onClick={() => verify(peer, message, messageId)}>
            <span className="speech-bubble-name">{name || myName}</span>
            {message}
            {verified && <Ready className="float-right text-success badge" />}
          </button>
        </div>
      );
    })}
  </div>
));
