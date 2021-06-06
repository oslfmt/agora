// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import * as AGOToken from "./AGOToken.sol";

struct Crowdfund {
  uint goalAmount;
  uint deadline;
  uint amountRaised;
  // tracks supporters and their donated amounts
  mapping (address => uint) supporters;
}

/**
 * Global Payroll struct
 * Represents the Payroll belonging to each Agorum
 */
struct Payroll {
  // list of contributors/mentors and their respective compensation amount
  mapping (address => uint) contributors;
  mapping (address => uint) mentors;
  // string is (contributor; mentor; creator) and uint is % of a payment they receive
  mapping (string => uint) distributionRates;
  uint balance;
}

/**
 * The main contract of the app
 */
contract AgorumTracker {
  // an Agorum object
  struct Agorum {
    string name;
    address payable[] agorumCreators;
    Course[] courses;
    Payroll payroll;
    Crowdfund crowdfund;
  }

  // an agorum has at least 1 course
  struct Course {
    string title;
    address payable[] courseCreators;
  }

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
  function addNewContributor(uint _agorumID, address payable _contributorAddress, uint _reward) public {
    agorums[_agorumID].payroll.contributors[_contributorAddress] = _reward;
  }

  function addNewMentor(uint _agorumID, address payable _mentorAddress, uint _reward) public {
    agorums[_agorumID].payroll.mentors[_mentorAddress] = _reward;
  }

  function setDistributionRates(uint _agorumID, uint _contributorRate, uint _mentorRate, uint _creatorRate) public onlyCreator(agorums[_agorumID].agorumCreators) {
    // storage pointer to the Agorum's payroll
    Payroll storage p = agorums[_agorumID].payroll;
    p.distributionRates["contributor"] = _contributorRate;
    p.distributionRates["mentor"] = _mentorRate;
    p.distributionRates["creator"] = _creatorRate;
  }

  // can we make this so it is automatically called at a certain time, say every x blocks?
  // can maybe automatically call function on some specific event occurrance
  function distributeFunds(uint _agorumID) public {
    // AGOToken.mintTokensOnNewLevel();
  }

  // payable function that accepts token payments to an agorum
  function acceptPayments(uint _agorumID, uint _amount) public {
    agorums[_agorumID].payroll.balance += _amount;

    emit NewPayment(_agorumID, _amount);
  }

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