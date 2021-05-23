// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AGOToken is ERC20 {
  constructor() ERC20("AgoraToken", "AGO") {}

  /** @dev Mints tokens when user has complete the introductory course
   */
  function mintTokensOnIntroCourseCompletion() external {
    _mint(msg.sender, 100);
  }

  /** @dev Mints tokens when user has reached a new level
   */
  function mintTokensOnNewLevel() external {
    _mint(msg.sender, 10);
  }

  /**
   * @dev Sets the decimals to 2 such that token balances are displayed as (balance / 10 ** 2)
   */
  function decimals() public pure override returns (uint8) {
    return 2;
  }
}