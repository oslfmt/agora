// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AGOToken.sol";
import "./AgorumFactory.sol";
import "./PayrollFactory.sol";

/**
  * Mentors are responsible for guiding cohorts. For compensation, they are paid x tokens from the Agorum fund. This fund
  * is supplied by tokens of course takers. In order for a mentor to be added as an official mentor of the Agorum, they
  * must meet the requirements set by the agorum. For now, this simply means that they have a certain level of repuation.
  * Once added to the mentor list, this makes them eligible to be assigned to cohorts and be paid tokens. A simple
  * average is calculated from learners scores of the mentor. This aggregate rating is used to determine an added bonus
  * to the mentor's compensation. The mentor is immediately paid x(base) + y(bonus) = total tokens.
  * In summary:

  * 1. Mentors register to be an Agorum mentor. They must met Agorum mentor reputation requirements. If met, then they
  *    are added to the official mentor list and eligible for compensation.
  * 2. Mentors are assigned to a cohort. After the cohort finishes, mentors get paid.
  */
contract PayrollManager is AgorumFactory, AGOToken {
  using SafeMath for uint256;

  // checks to see if the mentor has a reputation greater than the agorum requirement
  // is there a way we can query off-chain data to retrieve the reputation from user account (stored in IDX)??
  modifier mentorRequirements(address payable _mentorAddress, uint _agorumID) {
    // if (_mentorAddress.reputation > agorums[_agorumID].mentorReputationLevel) {
      _;
    // }
  }

  /**
   * @dev Set the Agorum mentor requirements. At this time, the only supported requirement is a level of reputation.
   * @param _agorumID ID of Agorum
   * @param _reputationPoints the required level of points
   */
  function changeMentorRequirements(uint _agorumID, uint _reputationPoints) external onlyCreator(agorums[_agorumID].agorumCreators) {
    payrolls[_agorumID].mentorReputationLevel = _reputationPoints;
  }

  /**
   * @dev Set the Agorum mentor payment rate. The rate is x tokens per cohort.
   * @param _agorumID ID of Agorum
   * @param _mentorPaymentRate the mentor payment rate
   */
  function changeMentorPaymentRate(uint _agorumID, uint _mentorPaymentRate) external onlyCreator(agorums[_agorumID].agorumCreators) {
    payrolls[_agorumID].mentorPaymentRate = _mentorPaymentRate;
  }

  // adds a new mentor to the mentors array of the payroll
  function addMentor(uint _agorumID, address payable _mentorAddress) public mentorRequirements(_mentorAddress, _agorumID) {
    payrolls[_agorumID].mentors.push(_mentorAddress);
    emit NewMentor(_agorumID, _mentorAddress);
  }

  // assigns the given mentor in the mentors array to a newly created cohort, with ratings of length _numStudents,
  // but all spots initialized to null
  function assignCohort(uint _agorumID, address payable _mentorAddress, uint _numStudents, uint endingDate) public {
    int[] memory ratings = new int[](_numStudents);
    payrolls[_agorumID].mentorToCohort[_mentorAddress] = Cohort(_numStudents, ratings, block.timestamp, endingDate);

    emit CohortAssigned(_agorumID, _mentorAddress, _numStudents);
  }

  // release funds to the mentor
  // the reason for this proxy function is because when calling _payMentor, the msg.sender should be the PayrollManager
  // contract, not the EOA account; hopefully it works in the context executed, not the originator
  function payMentor(uint _agorumID, address payable _mentorAddress) external {
    uint createdAt = payrolls[_agorumID].mentorToCohort[_mentorAddress].createdAt;
    uint endingDate = payrolls[_agorumID].mentorToCohort[_mentorAddress].endingDate;
    
    require(block.timestamp - createdAt > endingDate, "Cohort has not finished yet");
    uint totalPayment = _calculateFinalMentorPayment(_agorumID, _mentorAddress);

    _releaseFunds(_mentorAddress, totalPayment);
  }

  function _releaseFunds(address payable _recipient, uint _totalPayment) internal {
    // transfer ERC20 tokens from PayrollManager to mentor
    // problem is that mentor has to pay ether (gas) to receive their tokens
    // but the gas can just be considered a % transaction fee, like most platforms have anyways!
    transfer(_recipient, _totalPayment);
  }

  /**
   * @dev Calculates the final mentor payment, based on an average of cohort taker ratings.
   * @dev Need to do a bunch of math checks (overflow, conversions, prevent negative compensatino amounts)
   */
  function _calculateFinalMentorPayment(uint _agorumID, address payable _mentorAddress) view internal returns (uint256) {
    int totalRating = 0;
    uint basePayment = payrolls[_agorumID].mentorPaymentRate;
    int[] memory ratings = payrolls[_agorumID].mentorToCohort[_mentorAddress].learnerRatings;

    // ratings can only be -2, -1, 0, 1, 2
    // negative numbers decrease the mentor payment; positive increase payment bonus
    for (uint i = 0; i < ratings.length; i++) {
      totalRating += ratings[i];
    }
    // take average of ratings
    int bonus = totalRating / int256(ratings.length);

        // for now, do a simple adding of bonus to base rate. Later, will create a sliding bonus based on max and min payments possible.
    return (basePayment + uint256(bonus));
  }

  // PAYMENT FUNCTION
  // payable function that accepts token payments to an agorum
  function acceptPayments(uint _agorumID, uint _amount) external {
    // should increase the token balance - this isn't really balance of token, just a number
    // the real balance is managed by ERC20 contract
    payrolls[_agorumID].balance += _amount;

    // the problem with this, is that it transfers to PAYROLLMANAGER contract, not the specific payroll struct
    // however, the PAYROLLMANAGER can HOLD all tokens, while the struct balances keep track of the specific amount
    // that the PAYROLLMANAGER owes them
    // in this scheme, the PAYROLLMANAGER is like a centralized bank, and the structs are customers
    // however, no entity controls the payrollmanager, it strictly adheres to the payroll struct balances

    // transfer tokens from msg.sender to PayrollManager
    transfer(address(this), _amount);

    emit NewPayment(_agorumID, _amount);
  }
  
  event NewMentor(uint agorumID, address payable mentorAddress);
  event NewPayment(uint agorumID, uint amount);
  event CohortAssigned(uint agorumID, address payable mentorAddress, uint numStudents);
}

// TODO
// 2. Make sure transfer method pays from the Payroll balance
// 3. Subtract mentorPayment from the cohort struct
// 4. Work on contributor methods