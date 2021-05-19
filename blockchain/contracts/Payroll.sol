// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Payroll {
  using SafeMath for uint256;

  // uint represents contributor payment amount
  mapping (address => uint) public contributors;
  // uint represents mentor payment amount
  mapping (address => uint) public mentors;
  // string is (contributor; mentor; creator) and uint is % of a payment they receive
  mapping (string => uint) public distributionRates;
  // the balance of the payroll
  uint public balance = 0;

  /** @dev Adds a new contributor to payroll along with their reward
  * @param _contributorAddress the address of the contributor to add
  * @param _reward the reward set by community standard
   */
  function addContributor(address _contributorAddress,  uint _reward) external {
    contributors[_contributorAddress] = _reward;
  }
}