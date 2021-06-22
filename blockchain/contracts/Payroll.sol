// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Structs.sol";
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
contract PayrollManager is AGOToken, AgorumFactory, PayrollFactory {
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
  function setMentorRequirements(uint _agorumID, uint _reputationPoints) external onlyCreator(agorums[_agorumID].agorumCreators) {
    payrolls[_agorumID].mentorReputationLevel = _reputationPoints;
  }

  /**
   * @dev Set the Agorum mentor payment rate. The rate is x tokens per cohort.
   * @param _agorumID ID of Agorum
   * @param _mentorPaymentRate the mentor payment rate
   */
  function setMentorPaymentRate(uint _agorumID, uint _mentorPaymentRate) external onlyCreator(agorums[_agorumID].agorumCreators) {
    payrolls[_agorumID].mentorPaymentRate = _mentorPaymentRate;
  }

  /**
   * @dev Adds a new mentor to an Agorum mentor list if they meet the Agorum mentor requirements
   * @param _agorumID the ID of the Agorum mentor wishes to join
   * @param _mentorAddress the mentor's address
   */
  function addNewMentor(uint _agorumID, address payable _mentorAddress) public mentorRequirements(_mentorAddress, _agorumID) {
    // add mentor to payroll mentors tracker and preliminarily set the payment to base payment
    payrolls[_agorumID].mentors[_mentorAddress].mentorPayment = payrolls[_agorumID].mentorPaymentRate;

    emit NewMentor(_agorumID, _mentorAddress);
  }

  /**
   * @dev Calculates the final mentor payment, based on an average of cohort taker ratings.
   */
  function _calculateFinalMentorPayment(uint _agorumID, address payable _mentorAddress) internal {
    int totalRating = 0;
    // cohorts is not available in this scope
    int[] memory ratings = payrolls[_agorumID].mentors[_mentorAddress].learnerRatings;

    // ratings can only be -2, -1, 0, 1, 2
    // negative numbers decrease the mentor payment; positive increase payment bonus
    for (uint i = 0; i < ratings.length; i++) {
      totalRating += ratings[i];
    }
    // take average of ratings
    int bonus = totalRating / int256(ratings.length);

    // for now, dox a simple adding of bonus to base rate. Later, will create a sliding bonus based on max and min payments possible.
    payrolls[_agorumID].mentors[_mentorAddress].mentorPayment += uint256(bonus);
  }

  function payMentor(uint _agorumID, address payable _mentorAddress) internal {
    _calculateFinalMentorPayment(_agorumID, _mentorAddress);
    uint mentorPayment = payrolls[_agorumID].mentors[_mentorAddress].mentorPayment;

    // transfer ERC20 tokens using ERC20 transfer function
    transfer(_mentorAddress, mentorPayment);
  }

  // PAYMENT FUNCTION
  // payable function that accepts token payments to an agorum
  function acceptPayments(uint _agorumID, uint _amount) public {
    // should increase the token balance
    payrolls[_agorumID].balance += _amount;

    emit NewPayment(_agorumID, _amount);
  }

  // CONTRIBUTOR METHODS
  function addNewContributor(uint _agorumID, address payable _contributorAddress, uint _reward) public {
    payrolls[_agorumID].contributors[_contributorAddress] = _reward;

    emit NewContributor(_contributorAddress, _reward);
  }

  function payContributor(uint _agorumID, address payable _contributorAddress) internal {
    uint payment = payrolls[_agorumID].contributors[_contributorAddress];

    transfer(_contributorAddress, payment);
  }

  event NewContributor(address payable contributorAddress, uint reward);
  event NewMentor(uint agoruMID, address payable mentorAddress);
  event NewPayment(uint agorumID, uint amount);
}

// TODO
// 1. Make setter functions onlyCreator
// 2. Make sure transfer method pays from the Payroll balance
// 3. Subtract mentorPayment from the cohort struct
// 4. Work on contributor methods