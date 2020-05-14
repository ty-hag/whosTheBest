require('dotenv').config();
const database = require('../modules/database');
const expect = require('chai').expect;

console.log(process.env.NODE_ENV);

// describe('database functions', async () => {

//   after('disconnecting from db', async () => {
//     await database.disconnectFromDb();
//   })

//   describe('getCurrentBest()', async () => {

//     let getCurrentBestReturned = {};

//     before('testing return object', async () => {
//       getCurrentBestReturned = await database.getCurrentBest();
//     });

//     it('should return an object', async () => {
//       expect(getCurrentBestReturned).to.be.a('object');
//     });
//     it('returned object should have name property', async () => {
//       expect(getCurrentBestReturned.name).to.be.a('string');
//     })

//   });
// });

describe('database functions', async () => {

  after('disconnecting from db', async () => {
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
  })
});