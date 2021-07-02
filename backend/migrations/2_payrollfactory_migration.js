const PayrollFactory = artifacts.require('PayrollFactory');

module.exports = function(deployer) {
  deployer.deploy(PayrollFactory);
}