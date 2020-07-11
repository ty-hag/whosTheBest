require('dotenv').config();
const database = require('../modules/database');
const handlers = require('../modules/handlers');


const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const fakeGuildId = '12345678';

describe('app', async () => {


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
    await database.setPreviousBest(previousBestSeed, fakeGuildId);
    await database.setCurrentBest(currentBestSeed, fakeGuildId);
  });

  after('disconnect from db', async () => {
    await database.wipeTestData(fakeGuildId);
    await database.disconnectFromDb();
  })


  describe('database functions', async () => {

    describe('getCurrentBest()', async () => {

      let getCurrentBestReturned = {};

      before('testing return object', async () => {
        getCurrentBestReturned = await database.getCurrentBest(fakeGuildId);
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
        getPreviousBestReturned = await database.getPreviousBest(fakeGuildId);
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

        await database.setCurrentBest(newCurrentBestDataToSet, fakeGuildId);
        returnedNewCurrentBestData = await database.getCurrentBest(fakeGuildId);

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
        return expect(database.setCurrentBest(badStringData, fakeGuildId)).to.be.rejected;
      })

      it('should reject a name argument with a string length that is less than 1', async () => {
        const badStringData = {
          name: '',
          declaredBy: 'Declared By New',
          becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
        };
        return expect(database.setCurrentBest(badStringData, fakeGuildId)).to.be.rejected;
      })

      it('should reject a declaredBy argument with a non-string value', async () => {
        const badStringData = {
          name: 'Namey',
          declaredBy: 1234,
          becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
        };
        return expect(database.setCurrentBest(badStringData, fakeGuildId)).to.be.rejected;
      })

      it('should reject a declaredBy argument with a string length that is less than 1', async () => {
        const badStringData = {
          name: 'Namey',
          declaredBy: '',
          becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
        };
        return expect(database.setCurrentBest(badStringData, fakeGuildId)).to.be.rejected;
      })

      it('should reject a becameBestAt argument with a non-number value', async () => {
        const badStringData = {
          name: 'Namey',
          declaredBy: 'Berobi',
          becameBestAt: 'Some time'
        };
        return expect(database.setCurrentBest(badStringData, fakeGuildId)).to.be.rejected;
      })

      it('should reject a becameBestAt argument with a value that is less than 0', async () => {
        const badStringData = {
          name: 'Namey',
          declaredBy: 'Berobi',
          becameBestAt: -1
        };
        return expect(database.setCurrentBest(badStringData, fakeGuildId)).to.be.rejected;
      })
    })



    describe('setPreviousBest()', async () => {

      it('should set previousBest data to values on passed parameter object', async () => {

        const newPreviousBestDataToSet = {
          name: 'New Previous Best',
          declaredBy: 'Declared By Old',
          becameBestAt: Date.parse('01 Jan 2000 00:00:00 GMT')
        };

        await database.setPreviousBest(newPreviousBestDataToSet, fakeGuildId);
        returnedNewPreviousBestData = await database.getPreviousBest(fakeGuildId);

        expect(returnedNewPreviousBestData.name).to.equal('New Previous Best')
          && expect(returnedNewPreviousBestData.declaredBy).to.equal('Declared By Old')
          && expect(returnedNewPreviousBestData.becameBestAt).to.equal(946684800000);
      })
    })
  });

  describe('handler functions', async () => {

    describe('handleDeclaration()', async () => {

      // working off of https://stackabuse.com/using-spies-for-testing-in-javascript-with-sinon/

      let messageSendSpy;

      it('on non-amibuguous declaration, message.channel.send() is called once with message confirming declaration', async () => {
        // fake discord message object
        const message = {
          author: {
            username: 'Guy Incognito'
          },
          content: 'Oh man, hawaiian pizza is the best!',
          channel: {
            send: function (msg) {
              return;
            },
            guild: {
              id: fakeGuildId
            }
          }
        }

        messageSendSpy = sinon.spy(message.channel, 'send')

        await handlers.handleDeclaration(message, null);
        expect(messageSendSpy.calledOnce);
        expect(messageSendSpy.args[0][0]).to.equal('hawaiian pizza has been declared the best! Say "I take back that best declaration!" to cancel.');
      })

      
      it('on repeat declaration, message.channel.send() is called once with message rejecting repeat delcaration', async () => {
        // fake discord message object
        const message = {
          author: {
            username: 'Guy Incognito'
          },
          content: 'Oh man, hawaiian pizza is the best!',
          channel: {
            send: function (msg) {
              return;
            },
            guild: {
              id: fakeGuildId
            }
          }
        }

        messageSendSpy = sinon.spy(message.channel, 'send')

        await handlers.handleDeclaration(message, null);
        expect(messageSendSpy.calledOnce);
        expect(messageSendSpy.args[0][0]).to.equal('hawaiian pizza is already the best!');
      })


      it('on repeat declaration, message.channel.send() is called once with message rejecting repeat delcaration', async () => {
        // fake discord message object
        const message = {
          author: {
            username: 'Guy Incognito'
          },
          content: 'Oh man, hawaiian pizza is the best!',
          channel: {
            send: function (msg) {
              return;
            },
            guild: {
              id: fakeGuildId
            }
          }
        }

        messageSendSpy = sinon.spy(message.channel, 'send')

        await handlers.handleDeclaration(message, null);
        expect(messageSendSpy.calledOnce);
        expect(messageSendSpy.args[0][0]).to.equal('hawaiian pizza is already the best!');
      })


    })
  })

})

