// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import './Payroll.sol';
import './Course.sol';
import './Crowdfund.sol';

contract Agorum {
  using SafeMath for uint;
  // storage variables...could store in a struct?
  string public name;
  address[] public creators;
  // array of courses belonging to agorum
  Course[] public courses;
  // payroll contract
  Payroll public payroll;
  // crowdfund contract
  Crowdfund public crowdfund;

  // event emitted whenever a new agorum is created
  event AgorumCreated(address agorumCreator, string title);
  event AgorumNameChanged(address changer, string name);
  event CourseAdded(string title, address[] creators, string description, string[] categoryTags);

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

  // creates a new Agorum contract, stored on the blockchain, as well as 1 Course contract
  constructor (string memory _name, address[] memory _creators) {
    name = _name;
    creators = _creators;

    // creates a new course and pushes it to array
    // courses.push(new Course(_name, _creators, _description, _categoryTags, createdAt));
    // creates payroll with balance initialized to 0
    // payroll = new Payroll();
    // creates crowdfund contract with amountRaised initialized to 0
    // crowdfund = new Crowdfund(_goalAmount, _deadline);

    // emit AgorumCreated event
    emit AgorumCreated(msg.sender, _name);
  }

  function editName(string calldata _name) external {
    name = _name;
    emit AgorumNameChanged(msg.sender, _name);
  }

  /**
   * @dev Merges two Agorums by adding the course of an agorum to another agorum, and then deleting the previous one
   * @param agorumMerger the agorum to merge into
   * @param agorumMergee the agorum to be merged
   */
  function mergeAgorums(Agorum agorumMerger, Agorum agorumMergee) public {
    // add the mergee's courses into the merger
    Course[] memory mergeeCourses = agorumMergee.getCourses();
    Course[] memory mergerCourses = agorumMerger.getCourses();

    // for (uint i = 0; i < mergeeCourses.length; i++) {
    //   mergerCourses.push(mergeeCourses[i]);
    // }

    deleteAgorum(agorumMergee);
  }

  function deleteAgorum(Agorum agorum) public onlyCreator(agorum.getCreators()) {
    selfdestruct(payable(address(agorum)));
  }

  /**
   * @dev Returns all the creators of the agorum
   */
  function getCreators() public view returns (address[] memory) {
    return creators;
  }

  /**
   * @dev Return the entire array of courses belonging to an Agorum
   */
  function getCourses() public view returns (Course[] memory) {
    return courses;
  }

  /**
   * @dev Add a new course to an Agorum
   */
  function addCourse(string calldata _title, string calldata _description, address[] calldata _creators, string[] calldata _categoryTags) public {
    courses.push(new Course(_title, _creators, _description, _categoryTags, block.timestamp));
    emit CourseAdded(_title, _creators, _description, _categoryTags);
  }
}