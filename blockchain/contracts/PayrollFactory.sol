// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract PayrollFactory {
  struct Payroll {
    // list of contributors/mentors and their respective compensation amount
    mapping (address => uint) contributors;
    // uint is cohortID?
    mapping (address => uint) mentors;
    uint mentorReputationLevel;
    uint mentorPaymentRate;
    uint balance;
  }

  // payroll's ID is the same as the ID of the agorum it is associated with
  mapping (uint => Payroll) public payrolls;

  function createPayroll(uint _agorumID, uint _reputationLevel, uint _mentorPaymentRate) public {
    payrolls[_agorumID].mentorReputationLevel = _reputationLevel;
    payrolls[_agorumID].mentorPaymentRate = _mentorPaymentRate;
    payrolls[_agorumID].balance = 0;
  }
}