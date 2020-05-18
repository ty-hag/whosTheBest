require('dotenv').config();
const database = require('../modules/database');


var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;



describe('database functions', async () => {

  before('seed the database', async () => {
    const previousBestSeed = {
      name: 'Previous Best',
      declaredBy: 'Declared By Previous',
      becameBestAt: Date.parse('01 Jan 1970 00:00:00 GMT')
    };
    const currentBestSeed = {
      name: 'Current Best',
      declaredBy: 'Declared By Current',
      becameBestAt: Date.parse('04 Dec 1995 00:12:00 GMT')
    };
    await database.setPreviousBest(previousBestSeed);
    await database.setCurrentBest(currentBestSeed);
  });



  after('disconnecting from db', async () => {
    await database.wipeTestData();
    await database.disconnectFromDb();
  })



  describe('getCurrentBest()', async () => {

    let getCurrentBestReturned = {};

    before('testing return object', async () => {
      getCurrentBestReturned = await database.getCurrentBest();
    });

    it('should return an object', async () => {
      expect(getCurrentBestReturned).to.be.a('object');
    });
    it('returned object should have name property as string', async () => {
      expect(getCurrentBestReturned.name).to.be.a('string');
    })
    it('returned object should have becameBestAt property as number', async () => {
      expect(getCurrentBestReturned.becameBestAt).to.be.a('number');
    })
    it('returned object should have declaredBy property as string', async () => {
      expect(getCurrentBestReturned.declaredBy).to.be.a('string');
    })
    it(`returned object's values match seeded data`, async () => {
      expect(getCurrentBestReturned.name).to.equal('Current Best')
        && expect(getCurrentBestReturned.declaredBy).to.equal('Declared By Current')
        && expect(getCurrentBestReturned.becameBestAt).to.equal(818035920000);
    })

  })



  describe('getPreviousBest()', async () => {

    let getPreviousBestReturned = {};

    before('testing return object', async () => {
      getPreviousBestReturned = await database.getPreviousBest();
    });

    it('should return an object', async () => {
      expect(getPreviousBestReturned).to.be.a('object');
    });
    it('returned object should have name property as string', async () => {
      expect(getPreviousBestReturned.name).to.be.a('string');
    })
    it('returned object should have becameBestAt property as number', async () => {
      expect(getPreviousBestReturned.becameBestAt).to.be.a('number');
    })
    it('returned object should have declaredBy property as string', async () => {
      expect(getPreviousBestReturned.declaredBy).to.be.a('string');
    })
    it(`returned object's values match seeded data`, async () => {
      expect(getPreviousBestReturned.name).to.equal('Previous Best')
        && expect(getPreviousBestReturned.declaredBy).to.equal('Declared By Previous')
        && expect(getPreviousBestReturned.becameBestAt).to.equal(0);
    })
  })



  describe('setCurrentBest()', async () => {

    it('should set currentBest data to values on passed parameter object', async () => {

      const newCurrentBestDataToSet = {
        name: 'New Best',
        declaredBy: 'Declared By New',
        becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
      };

      await database.setCurrentBest(newCurrentBestDataToSet);
      returnedNewCurrentBestData = await database.getCurrentBest();

      expect(returnedNewCurrentBestData.name).to.equal('New Best')
      && expect(returnedNewCurrentBestData.declaredBy).to.equal('Declared By New')
      && expect(returnedNewCurrentBestData.becameBestAt).to.equal(946684800000);
    })

    // argument data validation
    it('should reject a name argument with a non-string value', async () => {
      const badStringData = {
        name: 123,
        declaredBy: 'Declared By New',
        becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
      };
      return expect(database.setCurrentBest(badStringData)).to.be.rejected;
    })

    it('should reject a name argument with a string length that is less than 1', async () => {
      const badStringData = {
        name: '',
        declaredBy: 'Declared By New',
        becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
      };
      return expect(database.setCurrentBest(badStringData)).to.be.rejected;
    })

    it('should reject a declaredBy argument with a non-string value', async () => {
      const badStringData = {
        name: 'Namey',
        declaredBy: 1234,
        becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
      };
      return expect(database.setCurrentBest(badStringData)).to.be.rejected;
    })

    it('should reject a declaredBy argument with a string length that is less than 1', async () => {
      const badStringData = {
        name: 'Namey',
        declaredBy: '',
        becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
      };
      return expect(database.setCurrentBest(badStringData)).to.be.rejected;
    })

    it('should reject a becameBestAt argument with a non-number value', async () => {
      const badStringData = {
        name: 'Namey',
        declaredBy: 'Berobi',
        becameBestAt: 'Some time'
      };
      return expect(database.setCurrentBest(badStringData)).to.be.rejected;
    })

    it('should reject a becameBestAt argument with a value that is less than 0', async () => {
      const badStringData = {
        name: 'Namey',
        declaredBy: 'Berobi',
        becameBestAt: -1
      };
      return expect(database.setCurrentBest(badStringData)).to.be.rejected;
    })
  })



  describe('setPreviousBest()', async () => {

    it('should set previousBest data to values on passed parameter object', async () => {

      const newPreviousBestDataToSet = {
        name: 'New Previous Best',
        declaredBy: 'Declared By Old',
        becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
      };

      await database.setPreviousBest(newPreviousBestDataToSet);
      returnedNewPreviousBestData = await database.getPreviousBest();

      expect(returnedNewPreviousBestData.name).to.equal('New Previous Best')
      && expect(returnedNewPreviousBestData.declaredBy).to.equal('Declared By Old')
      && expect(returnedNewPreviousBestData.becameBestAt).to.equal(946684800000);
    })
  })
});