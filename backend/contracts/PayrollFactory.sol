// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract PayrollFactory {

  struct Payroll {
    uint mentorReputationLevel;
    uint mentorPaymentRate;
    uint balance;
    mapping (address => uint) contributors;
    mapping (address => Cohort) mentorToCohort;
    address payable[] mentors;
  }

  struct Cohort {
    uint numStudents;
    int[] learnerRatings;
    uint createdAt;
    uint endingDate;
  }

  // payroll's ID is the same as the ID of the agorum it is associated with
  mapping (uint => Payroll) public payrolls;

  function _createPayroll(uint _agorumID, uint _reputationLevel, uint _mentorPaymentRate) internal {
    payrolls[_agorumID].mentorReputationLevel = _reputationLevel;
    payrolls[_agorumID].mentorPaymentRate = _mentorPaymentRate;
    payrolls[_agorumID].balance = 0;

    emit PayrollCreated(_agorumID, _reputationLevel, _mentorPaymentRate);
  }

  event PayrollCreated(uint id, uint reputationLevel, uint mentorPaymentRate);
}