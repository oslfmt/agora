// const Agorum = artifacts.require("Agorum");

// contract("Agorum", accounts => {
//   let agorum;
//   let creator = accounts[0];
//   let learner = accounts[1];

//   before(async () => {
//     agorum = await Agorum.deployed();
//   });

//   describe('deployment', async () => {
//     it('deploys successfully', async () => {
//       const address = await agorum.address;

//       assert.notEqual(address, 0x0);
//       assert.notEqual(address, '');
//       assert.notEqual(address, null);
//       assert.notEqual(address, undefined);
//     });
//   });

//   describe('courses', async () => {
//     let result;

//     before(async () => {
//       result = await agorum.createNewCourseSkeleton('Intro Course', 'describes how the platform works', ['intro', 'test'], { from: creator });
//     });

//     it('creates a new course', async () => {
//       let agorumEvent = result.logs[0].args;
      
//       assert.equal(agorumEvent.agorumCreator, creator, 'creator address is correct');
//       assert.equal(agorumEvent.title, 'Intro Course');
//       assert.equal(agorumEvent.description, 'describes how the platform works');
//     });
//   });

// });