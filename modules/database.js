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
const currentBestRef = process.env.TESTING ? db.ref('test/currentBest') : db.ref('currentBest');
const previousBestRef = process.env.TESTING ? db.ref('test/previousBest') : db.ref('previousBest');

// setting for duration output
const durationFormat = {
  seconds: 2,
  minutes: 2,
  hours: 2,
  days: 2
};

// functions

const setCurrentBest = (data) => {
  return new Promise(async (resolve, reject) => {

    // validate data
    const validName = typeof (data.name) === 'string' && data.name.length > 0 ? true : false;
    const validDeclaredBy = typeof (data.declaredBy) === 'string' && data.declaredBy.length > 0 ? true : false;
    const validBecameBestAt = typeof (data.becameBestAt) === 'number' && data.becameBestAt > -1 ? true : false;
    if (!validName || !validDeclaredBy || !validBecameBestAt) {
      reject(`setCurrentBest received invalid input. Values on argument: ${data.name}, ${data.declaredBy}, ${data.validBecameBestAt})`);
    }

    try {
      await currentBestRef.set( // for reference, this function call returns undefined when successful
        {
          name: data.name,
          declaredBy: data.declaredBy,
          becameBestAt: data.becameBestAt
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

const setPreviousBest = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await previousBestRef.set(data);
      resolve();
    } catch (error) {
      console.log('Error in setPreviousBest:')
      console.log(error);
      reject(error);
    }
  })
}

const getCurrentBest = () => {
  // return the name of the current best and how long they've been the best for
  return new Promise(async (resolve, reject) => {
    try {
      // query db
      const currentBestDataSnapshot = await currentBestRef.once('value');

      // format data
      const bestData = {};
      bestData.name = currentBestDataSnapshot.val().name;
      bestData.becameBestAt = currentBestDataSnapshot.val().becameBestAt;
      bestData.declaredBy = currentBestDataSnapshot.val().declaredBy;

      resolve(bestData);
    } catch (error) {
      console.log('Error in getCurrentBest:')
      console.log(error);
      reject(error);
    }

  })
}

const getPreviousBest = () => {
  // return the name of the current best and how long they've been the best for
  return new Promise(async (resolve, reject) => {
    try {
      // query db
      const previousBestDataSnapshot = await previousBestRef.once('value');

      // format data
      const previousBestData = {};
      previousBestData.name = previousBestDataSnapshot.val().name;
      previousBestData.becameBestAt = previousBestDataSnapshot.val().becameBestAt;
      previousBestData.declaredBy = previousBestDataSnapshot.val().declaredBy;

      resolve(previousBestData);
    } catch (error) {
      console.log('Error in getPreviousBest:')
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

const wipeTestData = () => {
  if (!process.env.TESTING) { // stop this from running in prod
    return;
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        await currentBestRef.remove();
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
  disconnectFromDb,
  wipeTestData
};