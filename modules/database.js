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
const currentBestRef = db.ref('currentBest');
const previousBestRef = db.ref('previousBest');

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
    try {
      const setResult = await currentBestRef.set(
        {
          name: data.name,
          declaredBy: data.declaredBy,
          becameBestAt: data.becameBestAt
        }
      )
      console.log(setResult);
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
  return new Promise (async (resolve, reject) => {
    try{

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

module.exports = {
  setCurrentBest,
  setPreviousBest,
  getCurrentBest,
  getPreviousBest,
  disconnectFromDb
};