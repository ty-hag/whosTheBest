require('dotenv').config();

const admin = require("firebase-admin");
const moment = require('moment');
const helpers = require('./helperFunctions');

const serviceAccount = require('../keys/' + process.env.FIREBASE_KEYS_FILENAME);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://youthebesttracker.firebaseio.com"
});

const app = admin.app();
const db = admin.database();
const currentBestRefBaseString = process.env.TESTING ? 'test/currentBest' : 'currentBest';
const previousBestRefBaseString = process.env.TESTING ? 'test/previousBest' : 'previousBest';

// setting for duration output
const durationFormat = {
  seconds: 2,
  minutes: 2,
  hours: 2,
  days: 2
};

// functions

const setCurrentBest = (data, guildId) => {
  return new Promise(async (resolve, reject) => {

    // validate data
    const validName = typeof (data.name) === 'string' && data.name.length > 0 ? true : false;
    const validDeclaredBy = typeof (data.declaredBy) === 'string' && data.declaredBy.length > 0 ? true : false;
    const validBecameBestAt = typeof (data.becameBestAt) === 'number' && data.becameBestAt > -1 ? true : false;
    const validGuildId = typeof (guildId) === 'string' && guildId.length > 0 ? true : false;
    if (!validName || !validDeclaredBy || !validBecameBestAt || !validGuildId) {
      reject(`setCurrentBest received invalid input. Values on argument: ${data.name}, ${data.declaredBy}, ${data.becameBestAt}), ${data.guildId}`);
      return; // Instead of returning here should I just put the rest of the function in an else block? https://stackoverflow.com/questions/32536049/do-i-need-to-return-after-early-resolve-reject
    }

    try {
      // REFACTOR?
      const currentBestRef = db.ref(currentBestRefBaseString);
      // update() will write new data if non exists at guildId specified
      await currentBestRef.update( // for reference, this function call returns undefined when successful
        {
          [guildId]: {
            name: data.name,
            declaredBy: data.declaredBy,
            becameBestAt: data.becameBestAt,
          }
        }
      )
      resolve();
    } catch (error) {
      console.log('Error in setCurrentBest:')
      console.log(error);
      reject(error);
    }
  })
}

const setPreviousBest = (data, guildId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = db.ref(previousBestRefBaseString)
      await ref.update(
        {
          [guildId]: {
            name: data.name,
            declaredBy: data.declaredBy,
            becameBestAt: data.becameBestAt,
          }
        }
      );
      resolve();
    } catch (error) {
      console.log('Error in setPreviousBest:')
      console.log(error);
      reject(error);
    }
  })
}

const getCurrentBest = (guildId) => {
  // return the name of the current best and how long they've been the best for
  return new Promise(async (resolve, reject) => {
    try {
      // query db
      const ref = db.ref(`${currentBestRefBaseString}/${guildId}`);
      const snapshot = await ref.once('value');
      const data = snapshot.val();

      resolve(data);

    } catch (error) {
      console.log('Error in getCurrentBest:')
      console.log(error);
      reject(error);
    }

  })
}

const getPreviousBest = (guildId) => {
  // return the name of the current best and how long they've been the best for
  return new Promise(async (resolve, reject) => {
    try {
      // query db
      const ref = db.ref(`${previousBestRefBaseString}/${guildId}`)
      const snapshot = await ref.once('value');
      const data = snapshot.val();

      resolve(data);

    } catch (error) {
      console.log('Error in getPreviousBest:')
      console.log(error);
      reject(error);
    }

  })
}

const deleteCurrentBest = (guildId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = db.ref(`${currentBestRefBaseString}/${guildId}`);
      await ref.remove();
      resolve();
    } catch (error) {
      console.log('Error in deleteCurrentBest');
      console.log(error);
      reject(error);
    }
  })
}

const getTopTen = () => {
  return new Promise(async (resolve, reject) => {
    try {

    } catch (error) {
      console.log('Error in getTopTen:')
      console.log(error);
      reject(error);
    }
  })
}


// Used for testing
const disconnectFromDb = () => {
  return new Promise(async (resolve, reject) => {
    console.log('Attempting to close db connection.');
    await app.delete();
    // https://firebase.google.com/docs/reference/admin/node/admin.app.App?authuser=0#delete
    resolve();
  })
}

const wipeTestData = (guildId) => {
  if (!process.env.TESTING) { // stop this from running in prod
    return;
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const currentBestRef = db.ref(`${currentBestRefBaseString}/${guildId}`)
        await currentBestRef.remove();
        const previousBestRef = db.ref(`${previousBestRefBaseString}/${guildId}`)
        await previousBestRef.remove();
        resolve();
      } catch (error) {
        console.log('Error in wipeData:')
        console.log(error);
        reject(error);
      }
    }
    )
  }
}

module.exports = {
  setCurrentBest,
  setPreviousBest,
  getCurrentBest,
  getPreviousBest,
  deleteCurrentBest,
  disconnectFromDb,
  wipeTestData
};