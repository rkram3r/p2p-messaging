export const abi = [{
  constant: true,
  inputs: [{ name: 'recipient', type: 'address' },
    { name: 'hash', type: 'bytes32' }],
  name: 'verify',
  outputs: [{ name: '', type: 'uint256' }],
  payable: false,
  stateMutability: 'view',
  type: 'function',
}, {
  constant: false,
  inputs: [{ name: 'hash', type: 'bytes32' }],
  name: 'store',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function',
}];


export const address = '0xfc3db72a96c3c56ef8eb60fafb83877d25e8008b';
