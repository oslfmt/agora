// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AgorumTracker {
  // an Agorum object
  struct Agorum {
    string name;
    address[] agorumCreators;
    Course[] courses;
    Payroll payroll;
    Crowdfund crowdfund;
  }

  struct Crowdfund {
    uint goalAmount;
    uint deadline;
    uint amountRaised;
    // tracks supporters and their donated amounts
    mapping (address => uint) supporters;
  }

  struct Payroll {
    // uint represents contributor payment amount
    mapping (address => uint) contributors;
    // uint represents mentor payment amount
    mapping (address => uint) mentors;
    // string is (contributor; mentor; creator) and uint is % of a payment they receive
    mapping (string => uint) distributionRates;
    // the balance of the payroll
    uint balance;
  }

  // an agorum has at least 1 course
  struct Course {
    string title;
    address[] courseCreators;
  }

  // keeps track of all agorums created
  Agorum[] agorums;
  // mapping (uint => Agorum) agorums;
  // owner of contract (platform developers)
  address public owner;

  // set the contract owner to be the deployer
  constructor () {
    owner = msg.sender;
  }

  /**
   * @dev Checks for message sender is one of the Agorum creators
   * @param agorumCreators array of addresses of the creators
   */
  modifier onlyCreator(address[] memory agorumCreators) {
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
   * @dev Creates a new agorum with given name and array of creators. Pushes new Agorum to tracker array.
   * @dev Since an Agorum must be composed of at least one course, a course is also created and pushed to Agorum courses.
   * @param _name the agorum name
   * @param _creators address of the creators
   */
  function _createNewAgorum(string calldata _name, address payable[] calldata _creators) internal {
    Agorum storage a;
    a.name = _name;
    a.agorumCreators = _creators;
    // create and add the corresponding course to Agorum
    a.courses.push(addNewCourse(_name, _creators));
    // push new Agorum to tracker array
    agorums.push(a);
    emit AgorumCreated(_name, _creators);
  }

  /**
   * @dev Add a new course to an Agorum
   */
  function addNewCourse(string calldata _title, address payable[] calldata _courseCreators) internal returns (Course storage) {
    Course storage c;
    c.title = _title;
    c.courseCreators = _courseCreators;
    return c;
  }

  /**
   * @dev Return the array of agorums on the platform
   * @return array of Agorums
   */
  function getAgorums() public view returns (Agorum[] memory) {
    return agorums;
  }

  /**
   * @dev Return the entire array of courses belonging to a specific Agorum
   * @param _index the index into the Agorum tracker array
   */
  function getCourses(uint _index) public view returns (Course[] memory) {
    return agorums[_index].courses;
  }

  /**
   * @dev Merges two Agorums by adding the course of an agorum to another agorum, and then deleting the previous one
   * @param agorumMerger the agorum to merge into
   * @param agorumMergee the agorum to be merged
   */
  function mergeAgorums(Agorum calldata agorumMerger, Agorum calldata agorumMergee) public {
    // add the mergee's courses into the merger
    Course[] memory mergeeCourses = agorumMergee.getCourses();
    Course[] memory mergerCourses = agorumMerger.getCourses();

    // for (uint i = 0; i < mergeeCourses.length; i++) {
    //   mergerCourses.push(mergeeCourses[i]);
    // }

    deleteAgorum(agorumMergee);
  }

  function deleteAgorum(Agorum calldata agorum) public onlyCreator(agorum.getCreators()) {
    selfdestruct(payable(address(agorum)));
  }

  // event emitted whenever a new agorum is created
  event AgorumCreated(string name, address payable[] agorumCreators);
  event CourseAdded(string title, address[] creators, string description, string[] categoryTags);
}