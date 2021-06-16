// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// an Agorum object
struct Agorum {
  string name;
  address payable[] agorumCreators;
  Course[] courses;
  // mapping (address => Cohort) cohorts;
  // Payroll payroll;
  // Crowdfund crowdfund;
}

struct Payroll {
  // list of contributors/mentors and their respective compensation amount
  mapping (address => uint) contributors;
  mapping (address => Cohort) mentors;
  uint mentorReputationLevel;
  uint mentorPaymentRate;
  uint balance;
}

struct Crowdfund {
  uint goalAmount;
  uint deadline;
  uint amountRaised;
  // tracks supporters and their donated amounts
  mapping (address => uint) supporters;
}

// an agorum has at least 1 course
struct Course {
  string title;
  address payable[] courseCreators;
}

// temporary struct for a cohort
struct Cohort {
  uint mentorPayment;
  int[] learnerRatings;
}

