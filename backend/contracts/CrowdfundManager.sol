// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./AGOToken.sol";
import "./AgorumFactory.sol";

// REFUND is not a feature currently, but may be added later
contract CrowdfundManager is AGOToken, AgorumFactory {

  // donates tokens from user to the crowdfund
  function contributeTokens(uint _id, uint _amount) public {
    // transfer tokens from user to crowdfundmanager contract
    transfer(address(this), _amount);
    // add tokens to nominal balance
    crowdfunds[_id].amountRaised += _amount;

    // if goalAmount is reached, automatically release funds (may remove this functionality)
    if (crowdfunds[_id].amountRaised >= crowdfunds[_id].goalAmount) {
      releaseTokensToCreators(_id);
    }

    emit TokensDonated(msg.sender, _id, _amount);
  }

  // releases the tokens to the creators once deadline has passed
  function releaseTokensToCreators(uint _id) public onlyCreator(agorums[_id].agorumCreators) {
    Crowdfund storage crowdfund = crowdfunds[_id];
    // require deadline to have passed
    require(block.timestamp - crowdfund.createdAt > crowdfund.deadline, "Crowdfund deadline has not expired yet");
    
    // transfer tokens from CrowdfundManager contract to msg.sender
    transfer(address(this), crowdfund.amountRaised);

    emit TokensReleased(_id, crowdfund.amountRaised);
  }

  // get the deadline
  function getDeadline(uint _id) public view returns (uint) {
    return crowdfunds[_id].deadline;
  }

  // get the current amount raised
  function getAmountRaised(uint _id) public view returns (uint) {
    return crowdfunds[_id].amountRaised;
  }

  // get the goal amount
  function getGoalAmount(uint _id) public view returns (uint) {
    return crowdfunds[_id].goalAmount;
  }

  event TokensDonated(address supporter, uint id, uint amount);
  event TokensReleased(uint id, uint amount);
}