// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

struct Crowdfund {
  uint goalAmount;
  uint deadline;
  uint amountRaised;
  // tracks supporters and their donated amounts
  mapping (address => uint) supporters;
}

// temporary struct for a cohort
struct Cohort {
  uint mentorPayment;
  int[] learnerRatings;
}

