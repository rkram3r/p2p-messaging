import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import './Messages.scss';

export default connect(
  state => ({ ...state.p2pReducer, ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({ recievedMessages, myName }) => (
  <div className="my-3 p-3 bg-white rounded shadow-sm col-sm-8">
    {recievedMessages.map(({
      myMessage, name, message, recieved,
    }) => (
      <div key={recieved} className={myMessage ? 'speech-bubble-me' : 'speech-bubble-other'}>
        {<span className="speech-bubble-name">{name || myName}</span>}
        {`${message}`}
      </div>
    ))}
  </div>
));
