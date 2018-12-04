import React from 'react';
import { connect } from 'react-redux';

import Web3 from 'web3';
import Header from './Header';
import Connection from './Connection';
import Contactlist from './Contactlist/index';
import CreateMessage from './CreateMessage';


const abi = [
  {
    constant: false,
    inputs: [],
    name: 'kill',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'greet',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_greeting',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
];
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
const account = web3.eth.accounts.create();
console.log(account);

const myContract = new web3.eth.Contract(abi, account.address);


export default connect(state => ({ ...state.p2pReducer }))(
  ({ contactlist }) => (
    <section>
      <Header />
      <main role="main" className="container">
        <Connection />
        {contactlist.size > 0 && <Contactlist />}
        {contactlist.size > 0 && <CreateMessage />}
      </main>
    </section>
  ),
);
