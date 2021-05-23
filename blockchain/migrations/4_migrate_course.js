let Course = artifacts.require('Course');

module.exports = function(deployer) {
  deployer.deploy(Course);
}