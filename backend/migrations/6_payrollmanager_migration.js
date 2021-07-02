const PayrollManager = artifacts.require('PayrollManager');

module.exports = function(deployer) {
  deployer.deploy(PayrollManager);
}