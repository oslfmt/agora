const AgorumTracker = artifacts.require('AgorumTracker');

contract("AgorumTracker", accounts => {
  let agorumTracker;
  let deployer = accounts[0];
  let creator1 = accounts[1];
  let creator2 = accounts[2];

  before(async () => {
    agorumTracker = await AgorumTracker.deployed();
  });

  describe('Deployment', async () => {
    it('set the correct contract owner in constructor', async () => {
      const owner = await agorumTracker.owner();
      assert.equal(owner, deployer);
    });
  });

  // when a new agorum is created, a corresponding course is also created
  // this course has the same title and creators as the agorum name and creators
  describe('Creating a new agorum', async () => {
    let numAgorumsBefore;
    let txID;
    let courseAdded;
    let agorumCreated;

    before (async () => {
      numAgorumsBefore = await agorumTracker.numAgorums();
      txID = await agorumTracker.createNewAgorum('First Agorum', [creator1, creator2]);
  
      courseAdded = txID.logs[0].args;
      agorumCreated = txID.logs[1].args;
    });

    // check that number of agorums has been increased by one
    it('increases numAgorums by one', async () => {
      let numAgorumsAfter = await agorumTracker.numAgorums();
      let difference = numAgorumsAfter - numAgorumsBefore;
      assert.equal(difference, 1, 'number of agorums has not been incremented by one');
    });

    it('sets the Agorum AND Course ID, name, and creators correctly', async () => {
      // these are the properties emitted from the events
      let { agorumID, name, agorumCreators } = agorumCreated;
      let { agorumID: courseID, title, courseCreators } = courseAdded;

      // check that agorumID is correct, ie, equal to 0 since this is the first agorum
      assert.equal(agorumID, 0, 'agorumID is incorrect');
      // check that agorum name is correct
      assert.equal(name, 'First Agorum', 'agorum name is wrong');
      // check that agorum creators are correct
      assert.deepStrictEqual(agorumCreators, [creator1, creator2], 'agorum creators are incorrect');

      // check that IDs are the same, ie course has been added to the agorum that was just created
      assert.equal(courseID.toNumber(), agorumID.toNumber(), 'agorumID is not persisted in course creation');
      // check that course title and agorum name are the same
      assert.equal(title, name);
      // check that agorum and course creators are the same
      assert.deepStrictEqual(courseCreators, agorumCreators);
    });

    it('adds first course to the agorum courses array', async () => {
      // check that course has been properly added to Agorum courses array
      let { agorumID, name, agorumCreators } = agorumCreated;
      const metadata = await agorumTracker.getAgorumMetadata(agorumID);
      const firstCourse = metadata[2][0];

      // check that first course's title is the same as agorum name
      assert.equal(firstCourse.title, name);
      // check that first course's creators are same as agorum name
      assert.deepStrictEqual(firstCourse.courseCreators, agorumCreators)
      // check that agorum only has ONE course, ie, one and only course has been added
      assert.equal(metadata[2].length, 1, 'agorum courses array length is not equal to one');
    });
  });

  // TEST: adding a new course to an Agorum increases courses array length by 1
  describe('Add a new course to an existing agorum', async () => {
    it('sets new course metadata correctly', async () => {
      let txID = await agorumTracker.addNewCourse(0, 'Second Course', [creator2]);
      let courseAdded = txID.logs[0].args;
      let { agorumID, title, courseCreators } = courseAdded;
  
      // checks that course metadata (title, creators) are as expected
      assert.equal(agorumID, 0);
      assert.equal(title, 'Second Course');
      assert.deepStrictEqual(courseCreators, [creator2]);
    });

    it('actually adds course to agorum courses array', async () => {
      const metadata = await agorumTracker.getAgorumMetadata(0);
      const secondCourse = metadata[2][1];

      assert.equal(secondCourse.title, 'Second Course');
      assert.deepStrictEqual(secondCourse.courseCreators, [creator2]);
      assert.equal(metadata[2].length, 2);
    });
  });

  // TEST: Correct metadata of an Agorum is retrieved
  describe('Correct metadata retrieval', async () => {

  });

});