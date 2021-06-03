// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Agorum.sol";

/**
 * Keeps track of all the Agorum addresses in the application
 */
contract AgorumTracker {
  Agorum[] agorums;
  address public owner;

  // owner of contract is the deployer (developers)
  constructor() {
    owner = msg.sender;
  }

  /**
   * @dev Return the array of agorums on the platform
   * @return array of Agorums
   */
  function getAgorums() public view returns (Agorum[] memory) {
    return agorums;
  }

  /**
   * @dev Add a new Agorum to the tracker. Can only be called internally
   * @param agorum the agorum to add
   */
  function _createAgorum(Agorum agorum) internal {
    
    // agorums.push(agorum);
  }
}