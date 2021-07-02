const CrowdfundManager = artifacts.require('CrowdfundManager');

module.exports = function(deployer) {
  deployer.deploy(CrowdfundManager);
}