const CrowdfundFactory = artifacts.require('CrowdfundFactory')

contract('CrowdfundFactory', accounts => {
  let crowdfundFactory;

  before(async () => {
    crowdfundFactory = await CrowdfundFactory.deployed();
  });

  it('retrieves correct Crowdfund data', async () => {
    
  })
})