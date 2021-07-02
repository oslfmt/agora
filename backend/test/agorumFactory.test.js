const AgorumFactory = artifacts.require("AgorumFactory");

contract("AgorumFactory", accounts => {
  let agorumFactory;
  let creator1 = accounts[1];
  let creator2 = accounts[2];

  before(async () => {
    agorumFactory = await AgorumFactory.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await agorumFactory.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  // when a new agorum is created, a corresponding course is also created
  // this course has the same title and creators as the agorum name and creators
  describe('Creating a new agorum', async () => {
    let numAgorumsBefore;
    let txID;
    let CourseAdded, PayrollCreated, CrowdfundCreated, AgorumCreated;

    before (async () => {
      numAgorumsBefore = await agorumFactory.numAgorums();
      txID = await agorumFactory.createNewAgorum('First Agorum', [creator1, creator2], 100, 5, 200, 3600);

      [CourseAdded, PayrollCreated, CrowdfundCreated, AgorumCreated] = txID.logs;
    });

    // check that number of agorums has been increased by one
    it('increases numAgorums by one', async () => {
      let numAgorumsAfter = await agorumFactory.numAgorums();
      let difference = numAgorumsAfter - numAgorumsBefore;
      assert.equal(difference, 1, 'number of agorums has not been incremented by one');
    });

    it('initializes Course data correctly', async () => {
      let { agorumID, title, courseCreators } = CourseAdded.args;

      // check that IDs are the same, ie course has been added to the agorum that was just created
      assert.equal(agorumID.toNumber(), 0, 'agorumID is not persisted in course creation');
      // check that course title and agorum name are the same
      assert.equal(title, 'First Agorum');
      // check that agorum and course creators are the same
      assert.deepStrictEqual(courseCreators, [creator1, creator2]);
    });

    it('initializes Payroll data correctly', async () => {
      let { id, reputationLevel, mentorPaymentRate } = PayrollCreated.args;

      assert.equal(id, 0, 'Payroll ID is not same as AgorumID')
      assert.equal(reputationLevel, 100, 'reputationLevel is not set correctly')
      assert.equal(mentorPaymentRate, 5, 'mentor payment rate not set correctly')
    });

    it('initializes Crowdfund data correctly', async () => {
      let { id, goalAmount, deadline } = CrowdfundCreated.args;

      assert.equal(id, 0, 'Payroll ID is not same as AgorumID')
      assert.equal(goalAmount, 200, 'reputationLevel is not set correctly')
      assert.equal(deadline, 3600, 'mentor payment rate not set correctly')
    })

    it('initializes Agorum data correctly', async () => {
      let { agorumID, name, agorumCreators } = AgorumCreated.args;

      // check that agorumID is correct, ie, equal to 0 since this is the first agorum
      assert.equal(agorumID, 0, 'agorumID is incorrect');
      // check that agorum name is correct
      assert.equal(name, 'First Agorum', 'agorum name is wrong');
      // check that agorum creators are correct
      assert.deepStrictEqual(agorumCreators, [creator1, creator2], 'agorum creators are incorrect');
    })

    it('adds first course to the agorum courses array', async () => {
      // check that course has been properly added to Agorum courses array
      let { agorumID, name, agorumCreators } = AgorumCreated.args;
      const metadata = await agorumFactory.getAgorum(agorumID);
      const firstCourse = metadata[2][0];

      // check that first course's title is the same as agorum name
      assert.equal(firstCourse.title, name);
      // check that first course's creators are same as agorum name
      assert.deepStrictEqual(firstCourse.courseCreators, agorumCreators)
      // check that agorum only has ONE course, ie, one and only course has been added
      assert.equal(metadata[2].length, 1, 'agorum courses array length is not equal to one');
    });
  });

  describe('Double check for correct Agorum data set', async () => {
    it('retrieves correct Agorum data', async () => {
      let { name, agorumCreators, courses } = await agorumFactory.getAgorum(0);

      assert.equal(name, 'First Agorum')
      assert.deepStrictEqual(agorumCreators, [creator1, creator2])
      assert.equal(courses[0].title, name)
      assert.deepStrictEqual(courses[0].courseCreators, [creator1, creator2])
    })
  })

  // TEST: adding a new course to an Agorum increases courses array length by 1
  describe('Add a new course to an existing agorum', async () => {
    it('sets new course metadata correctly', async () => {
      let txID = await agorumFactory.addNewCourse(0, 'Second Course', [creator2]);
      let courseAdded = txID.logs[0].args;
      let { agorumID, title, courseCreators } = courseAdded;
  
      // checks that course metadata (title, creators) are as expected
      assert.equal(agorumID, 0);
      assert.equal(title, 'Second Course');
      assert.deepStrictEqual(courseCreators, [creator2]);
    });
  });

});