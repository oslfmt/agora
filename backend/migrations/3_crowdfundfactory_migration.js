const CrowdfundFactory = artifacts.require('CrowdfundFactory');

module.exports = function(deployer) {
  deployer.deploy(CrowdfundFactory);
}