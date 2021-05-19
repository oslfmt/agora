// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Crowdfund {
  uint public goalAmount;
  uint public deadline;
  uint public amountRaised = 0;
  // tracks supporters and their donated amounts
  mapping (address => uint) public supporters;

  constructor(uint _goalAmount, uint _deadline) {
    goalAmount = _goalAmount;
    deadline = _deadline;
  }
}