import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import Messages from './Messages';

export default connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({ contactlist }) => (
  <div className="my-3 p-3 bg-white rounded shadow-sm">
    <div className="row">
      <div className="my-3 p-3 bg-white rounded shadow-sm col-sm-4">
        <h5>Contactlist</h5>
        <div className="list-group">
          {Array.from(contactlist).map(([id, { name }]) => (
            <a
              key={id}
              className="list-group-item-action list-group-item"
              href={`#sendTo${name}`}
            >
              {name}
            </a>
          ))}
        </div>
      </div>
      <Messages />
    </div>
  </div>
));
