import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../logic/actions';
import './Messages.scss';

export default connect(
  state => ({ ...state.p2pReducer, ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({ recievedMessages, myName }) => (
  <div className="col-sm-7 col-lg-9">
    {recievedMessages.map(({
      myMessage, name, message, recieved, verify,
    }) => (
      <div key={recieved} className={`my-2 ${myMessage ? 'speech-bubble-me' : 'speech-bubble-other'}`}>
        <span className="speech-bubble-name">{name || myName}</span>
        {message}
      </div>
    ))}
  </div>
));
