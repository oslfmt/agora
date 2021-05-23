// const AGOToken = artifacts.require("AGOToken");

// contract("AGOToken", accounts => {
//   let agoToken;
//   let newUser = accounts[2];
//   let user = accounts[3];

//   before(async () => {
//     agoToken = await AGOToken.deployed();
//   });

//   describe('deployment', async () => {
//     it('deploys successfully', async () => {
//       const address = await AGOToken.address;

//       assert.notEqual(address, 0x0);
//       assert.notEqual(address, '');
//       assert.notEqual(address, null);
//       assert.notEqual(address, undefined);
//     });

//     it('has the right metadata', async () => {
//       let name = await agoToken.name();
//       let symbol = await agoToken.symbol();

//       assert.equal(name, 'AgoraToken', 'has the right name');
//       assert.equal(symbol, 'AGO', 'has the right symbol');
//     });

//     it('has initial supply of zero', async () => {
//       let supply = await agoToken.totalSupply();

//       assert.equal(supply, 0, 'supply is 0');
//     });
//   });

//   describe('minting new tokens', async () => {
//     it('mints tokens on intro course completion', async () => {
//       let beforeBalance = await agoToken.balanceOf(newUser);
//       let result = await agoToken.mintTokensOnIntroCourseCompletion({ from: newUser });
//       let afterBalance = await agoToken.balanceOf(newUser);
//       let difference = afterBalance - beforeBalance;
//       let mintEvent = result.logs[0].args;
      
//       assert(mintEvent.from, 0x0, 'from address is contract address');
//       assert(mintEvent.to, newUser, 'to address is correct');
//       assert(mintEvent.value.toNumber(), 100, 'tokens minted is correct');
//       assert(difference, 100);
//     });

//     it('mints tokens when a new level is reached', async () => {
//       let beforeBalance = await agoToken.balanceOf(user);
//       let result = await agoToken.mintTokensOnNewLevel({ from: user });
//       let afterBalance = await agoToken.balanceOf(user);
//       let difference = afterBalance - beforeBalance;
//       let mintEvent = result.logs[0].args;

//       assert(mintEvent.from, 0x0, 'from address is contract address');
//       assert(mintEvent.to, user, 'to address is correct');
//       assert(mintEvent.value.toNumber(), 10, 'tokens minted is correct');
//       assert(difference, 10);
//     });
//   });
// });