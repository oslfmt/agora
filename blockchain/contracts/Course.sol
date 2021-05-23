// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Course {
  // state variables
  string public title;
  address[] public creators;
  string public description;
  string[] public categoryTags;
  uint public createdAt;

  constructor (
    string memory _title, 
    address[] memory _creators, 
    string memory _description, 
    string[] memory _categoryTags, 
    uint _createdAt) {
      title = _title;
      creators = _creators;
      description = _description;
      categoryTags = _categoryTags;
      createdAt = _createdAt;
  }

  function addCourseToAgorum() public {
    
  }
}