const AgorumTracker = artifacts.require('AgorumTracker');

contract("AgorumTracker", accounts => {
  let agorumTracker;
  let deployer = accounts[0];

  before(async () => {
    agorumTracker = await AgorumTracker.deployed();
  });

  describe('deployment', async () => {
    it('deployed successfully', async () => {
      const address = agorumTracker.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, '');
    });

    it('set the correct contract owner', async () => {
      const owner = await agorumTracker.owner();
      assert.equal(owner, deployer);
    })
  });

  describe('contract method testing', async () => {
    it('retrieves the array of agorums', async () => {
      const agorums = await agorumTracker.getAgorums();
      // console.log(agorums);
      // for now, just test to make sure it returns something
      assert.notEqual(agorums, null);
      assert.notEqual(agorums, undefined);
    });

    it('pushes a new agorum to the array', async () => {
      // test beginning length of array
      // length is undefined!!!
      const length1 = await agorumTracker.getAgorums().length;
      console.log(length1)
    });

  });
});