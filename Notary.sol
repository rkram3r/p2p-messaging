pragma solidity ^0.5.0;

contract Notary {
    mapping (address => mapping (bytes32 => uint)) stamps;

    function store(bytes32 hash) public {
        stamps[msg.sender][hash] = block.number;
    }

    function verify(address recipient, bytes32 hash) public view returns (uint) {
        return stamps[recipient][hash];
    }
}
