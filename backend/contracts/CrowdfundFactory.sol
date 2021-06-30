// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract CrowdfundFactory {

  struct Crowdfund {
    uint goalAmount;
    uint deadline;
    uint createdAt;
    uint amountRaised;
  }

  mapping (uint => Crowdfund) public crowdfunds;

  function _createCrowdfund(uint _agorumID, uint _goalAmount, uint _deadline) internal {
    crowdfunds[_agorumID].goalAmount = _goalAmount;
    crowdfunds[_agorumID].deadline = _deadline;
    crowdfunds[_agorumID].amountRaised = 0;
    crowdfunds[_agorumID].createdAt = block.timestamp;

    emit CrowdfundCreated(_agorumID, _goalAmount, _deadline);
  }

  event CrowdfundCreated(uint id, uint goalAmount, uint deadline);
}