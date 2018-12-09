import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ready from 'react-feather/dist/icons/check-circle';
import * as Actions from '../logic/actions';
import './Messages.scss';

export default connect(
  state => ({ ...state.p2pReducer, ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  recievedMessages, myName, verify, id,
}) => (
  <div className="col-sm-7 col-lg-9">
    {recievedMessages.map(({
      myMessage, name, message, recieved, verified, peer, messageId,
      verifiedFrom,
    }, index) => {
      if (myMessage) {
        return (
          <div key={recieved} className="my-2 speech-bubble-me">
            <span className="speech-bubble-name">{myName}</span>
            {message}
            {verified && <span className="verified">{verifiedFrom.join(',')}</span>}
            {verified && <Ready className="float-right text-success badge" />}
          </div>
        );
      }
      if (verified) {
        return (
          <div key={recieved} className="my-2 speech-bubble-other">
            <span className="speech-bubble-name">{name}</span>
            {message}
            <Ready className="float-right text-success badge" />
          </div>
        );
      }
      return (
        <div
          key={recieved}
          role="button"
          tabIndex={index}
          className="my-2 speech-bubble-other"
          onClick={() => verify(peer, message, messageId, id)}
          onKeyPress={() => verify(peer, message, messageId, id)}
        >
          <span className="verify">Verify!</span>
          <span className="speech-bubble-name">{name}</span>
          {message}
        </div>
      );
    })}
  </div>
));
