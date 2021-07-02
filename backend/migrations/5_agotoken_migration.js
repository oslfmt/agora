const AGOToken = artifacts.require('AGOToken');

module.exports = function(deployer) {
  deployer.deploy(AGOToken);
}