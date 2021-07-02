const PayrollContributor = artifacts.require('PayrollContributor');

module.exports = function(deployer) {
  deployer.deploy(PayrollContributor);
}