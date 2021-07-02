const PayrollFactory = artifacts.require('PayrollFactory')

contract('PayrollFactory', accounts => {
  let payrollFactory;

  before(async () => {
    payrollFactory = await PayrollFactory.deployed();
  });

  it('retrieves correct Payroll data', async () => {
    let payroll = await payrollFactory.payrolls(0);
    
    assert.equal(payroll.mentorReputationLevel, 5)
  })
})

// TODO
// needs to create an agorum first, before we can create a payroll