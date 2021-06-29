// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./PayrollManager.sol";

contract PayrollContributor is PayrollManager {

  // this should only be called based on some restrictions, such as if their proposal has enough votes or some other metric
  function addNewContributor(uint _agorumID, address payable _contributorAddress, uint _reward) public {
    payrolls[_agorumID].contributors[_contributorAddress] = _reward;

    emit NewContributor(_contributorAddress, _reward);
  }

  // pay contributor
  function payContributor(uint _agorumID, address payable _contributorAddress) public {
    uint payment = payrolls[_agorumID].contributors[_contributorAddress];
    _releaseFunds(_contributorAddress, payment);
  }

  event NewContributor(address payable contributorAddress, uint reward);
}