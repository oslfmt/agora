// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import './Payroll.sol';
import './Course.sol';
import './Crowdfund.sol';

/**
 * Represents an Agorum object.
 */
contract Agorum {
  // storage variables
  string public name;
  string[] public creators;
  string public description;
  string[] public categoryTags;
  uint public createdAt;
  // array of courses belonging to agorum
  Course[] public courses;
  // payroll contract
  Payroll public payroll;
  // crowdfund contract
  Crowdfund public crowdfund;

  // event emitted whenever a new agorum is created
  event AgorumCreated(
    address agorumCreator,
    string title,
    string description,
    string[] categoryTags,
    uint createdAt
  );

  // creates a new Agorum contract, stored on the blockchain, as well as 1 Course contract
  constructor (
    string memory _name,
    string[] memory _creators,
    string memory _description,
    string[] memory _categoryTags,
    uint _goalAmount,
    uint _deadline
  ) {
    name = _name;
    creators = _creators;
    description = _description;
    categoryTags = _categoryTags;
    // sets date to block timestamp
    createdAt = block.timestamp;

    // creates a new course and pushes it to array
    courses.push(new Course(_name, _creators, _description, _categoryTags, createdAt));
    // creates payroll with balance initialized to 0
    payroll = new Payroll();
    // creates crowdfund contract with amountRaised initialized to 0
    crowdfund = new Crowdfund(_goalAmount, _deadline);

    // emit AgorumCreated event
    emit AgorumCreated(msg.sender, _name, _description, _categoryTags, createdAt);
  }
}