// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./PayrollManager.sol";

contract PayrollContributor is PayrollManager {

  function addNewContributor(uint _agorumID, address payable _contributorAddress, uint _reward) public {
    payrolls[_agorumID].contributors[_contributorAddress] = _reward;

    emit NewContributor(_contributorAddress, _reward);
  }

  function payContributor(uint _agorumID, address payable _contributorAddress) internal {
    uint payment = payrolls[_agorumID].contributors[_contributorAddress];

    transfer(_contributorAddress, payment);
  }

  event NewContributor(address payable contributorAddress, uint reward);
}

// TODO:
// 1. Test gas cost of functions for deployment, to get an estimate
//    of the costs