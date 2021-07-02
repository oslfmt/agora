const AgorumFactory = artifacts.require('AgorumFactory');

module.exports = function(deployer) {
  deployer.deploy(AgorumFactory);
}