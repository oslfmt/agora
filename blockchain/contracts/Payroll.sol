// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Structs.sol";

contract PayrollManager {
  using SafeMath for uint256;

  // // I feel like this just copies the agorums mapping, and does not really persist the changes
  // function _addNewContributor(mapping(uint => Agorum) storage agorums, uint _agorumID, address payable _contributorAddress, uint _reward) internal {
  //   agorums[_agorumID].payroll.contributors[_contributorAddress] = _reward;
  //   emit NewContributor(_contributorAddress, _reward);
  // }

  // TESTING
  function code() {
    
  }
  
}