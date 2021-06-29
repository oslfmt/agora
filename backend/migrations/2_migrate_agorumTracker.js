let AgorumTracker = artifacts.require('AgorumTracker');

module.exports = function(deployer) {
  deployer.deploy(AgorumTracker);
}