// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "../node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeCast.sol";
import "./AGOToken.sol";
import "./Payroll.sol";
import "./Structs.sol";

/**
 * The main contract of the app
 */
contract AgorumTracker is AGOToken {
  using SafeCast for uint256;
  // contract state variables
  uint public numAgorums = 0;
  // tracker of all agorums, mapping AgorumID to Agorum struct
  mapping (uint => Agorum) agorums;
  address public owner;

  // set the contract owner to be the deployer
  constructor () {
    owner = msg.sender;
  }

  /**
   * @dev Checks for message sender is one of the Agorum creators
   * @param agorumCreators array of addresses of the creators
   */
  modifier onlyCreator(address payable[] memory agorumCreators) {
    // loop through agorum's creators until one is found
    bool creator = false;
    uint index = 0;
    while (!creator && index < agorumCreators.length) {
      if (msg.sender == agorumCreators[index]) {
        creator = true;
      }
      index++;
    }

    // if creator is found, execute the function body
    if (creator) {
      _;
    }
  }

  /**
   * PAYROLL SPECIFIC METHODS
   */
  // functions dealing with mentors
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

  /**
   * @dev Set the Agorum mentor requirements. At this time, the only supported requirement is a level of reputation.
   * @param _agorumID ID of Agorum
   * @param _reputationPoints the required level of points
   */
  function setMentorRequirements(uint _agorumID, uint _reputationPoints) public onlyCreator(agorums[_agorumID].agorumCreators) {
    agorums[_agorumID].mentorReputationLevel = _reputationPoints;
  }

  /**
   * @dev Set the Agorum mentor payment rate. The rate is x tokens per cohort.
   * @param _agorumID ID of Agorum
   * @param _mentorPaymentRate the mentor payment rate
   */
  function setMentorPaymentRate(uint _agorumID, uint _mentorPaymentRate) public {
    agorums[_agorumID].mentorPaymentRate = _mentorPaymentRate;
  }


  /**
   * @dev Calculates the final mentor payment, based on an average of cohort taker ratings.
   * 
   */
  function _calculateFinalMentorPayment(uint _agorumID, address payable _mentorAddress) internal {
    int totalRating = 0;
    // cohorts is not available in this scope
    int[] memory ratings = agorums[_agorumID].cohorts[_mentorAddress].learnerRatings;

    // ratings can only be -2, -1, 0, 1, 2
    // negative numbers decrease the mentor payment; positive increase payment bonus
    for (uint i = 0; i < ratings.length; i++) {
      totalRating += ratings[i];
    }
    // take average of ratings
    int bonus = totalRating / int256(ratings.length);

    // for now, do a simple adding of bonus to base rate. Later, will create a sliding bonus based on max and min payments possible.
    agorums[_agorumID].payroll.mentors[_mentorAddress] += uint256(bonus);
  }

  function payMentor(uint _agorumID, address payable _mentorAddress) internal {
    _calculateFinalMentorPayment(_agorumID, _mentorAddress);
    uint mentorPayment = agorums[_agorumID].payroll.mentors[_mentorAddress];

    // transfer ERC20 tokens using ERC20 transfer function
    // need to figure out how to import, probably just make contract inherit from AGOToken
    transfer(_mentorAddress, mentorPayment);
  }

  function addNewContributor(uint _agorumID, address payable _contributorAddress, uint _reward) public {
    agorums[_agorumID].payroll.contributors[_contributorAddress] = _reward;

    emit NewContributor(_contributorAddress, _reward);
  }

  /**
   * @dev sets the distribution rate of contributors, mentors, and creators
   * Might not need this function
   */
  function setDistributionRates(uint _agorumID, uint _contributorRate, uint _mentorRate, uint _creatorRate) public onlyCreator(agorums[_agorumID].agorumCreators) {
    // storage pointer to the Agorum's payroll
    Payroll storage p = agorums[_agorumID].payroll;

    // set mapping for each: {contributor: rate, mentor: rate, creator: rate}
    p.distributionRates["contributor"] = _contributorRate;
    p.distributionRates["mentor"] = _mentorRate;
    p.distributionRates["creator"] = _creatorRate;
  }

  // can we make this so it is automatically called at a certain time, say every x blocks?
  // can maybe automatically call function on some specific event occurrance
  // need to figure out payment model
  function distributeFunds(uint _agorumID) public {
    // AGOToken.mintTokensOnNewLevel();
  }

  // payable function that accepts token payments to an agorum
  function acceptPayments(uint _agorumID, uint _amount) public {
    // should increase the token balance
    agorums[_agorumID].payroll.balance += _amount;

    emit NewPayment(_agorumID, _amount);
  }

  event NewContributor(address payable contributorAddress, uint reward);
  event NewMentor(uint agoruMID, address payable mentorAddress);
  event NewPayment(uint agorumID, uint amount);

  // AGORUM SPECFIC METHODS
  /**
   * @dev Creates a new agorum with given name and array of creators. Adds new Agorum to the mapping tracker.
   * @dev Since an Agorum must be composed of at least one course, a course is also created and pushed to Agorum's courses.
   * @param _name the agorum name
   * @param _creators address of the creators
   */
  function createNewAgorum(string calldata _name, address payable[] calldata _creators) public {
    // New Agorum receives ID of corresponding number of Agorums
    uint agorumID = numAgorums++;
    // Assign agorum to mapping, assigning name and creators
    Agorum storage a = agorums[agorumID];
    a.name = _name;
    a.agorumCreators = _creators;
    // create and add the corresponding course to the Agorum
    addNewCourse(agorumID, _name, _creators);

    // INITIALIZE CROWDFUND & PAYROLL???

    emit AgorumCreated(agorumID, _name, _creators);
  }

  /**
   * @dev Add a new course to an Agorum
   * @param _title the course title
   * @param _courseCreators the course creators
   * @return the newly created course
   */
  function _createNewCourse(string calldata _title, address payable[] calldata _courseCreators) pure internal returns (Course memory) {
    Course memory c;
    c.title = _title;
    c.courseCreators = _courseCreators;
    return c;
  }

  /**
   * @dev Adds a new course to an Agorum
   */
  function addNewCourse(uint _agorumID, string calldata _name, address payable[] calldata _courseCreators) public {
    Agorum storage a = agorums[_agorumID];
    a.courses.push(_createNewCourse(_name, _courseCreators));

    emit CourseAdded(_agorumID, _name, _courseCreators);
  }

  /**
   * @dev Retrieves the metadata of an Agorum, ie, name, creators, and courses
   * @dev Does not return Crowdfund or Payroll information
   * @param _agorumID the ID of the Agorum
   * @return the Agorum name, creators, and courses
   */
  function getAgorumMetadata(uint _agorumID) public view returns (string memory, address payable[] memory, Course[] memory) {
    Agorum storage a = agorums[_agorumID];
    return (a.name, a.agorumCreators, a.courses);
  }

  // function getAgorumPayroll(uint _agorumID) internal view returns (Payroll memory) {
  //   return agorums[_agorumID].payroll;
  // }

  event AgorumCreated(uint agorumID, string name, address payable[] agorumCreators);
  event CourseAdded(uint agorumID, string title, address payable[] courseCreators);
}