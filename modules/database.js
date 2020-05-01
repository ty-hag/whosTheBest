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

// setting for duration output
const durationFormat = {
  seconds: 2,
  minutes: 2,
  hours: 2,
  days: 2
};

// functions

const changeCurrentBest = name => {
  // update/overwrite current best with new best, return message describing result of change or lack thereof
  return new Promise(async (resolve, reject) => {
    try {
      const currentBest = await checkCurrentBest();
      if (currentBest.name.toLowerCase() === name.toLowerCase()) {
        resolve(`${name} is already the best!`);
      } else {
        await currentBestRef.set(
          {
            name,
            becameBestAt: Date.now()
          }
        )
        resolve(`${name} has been declared the best!`);
      }
    } catch (error) {
      reject(error);
    }
  })
}

const checkCurrentBest = () => {
  // return the name of the current best and how long they've been the best for
  return new Promise(async (resolve, reject) => {
    // query db
    const currentBestDataSnapshot = await currentBestRef.once('value');

    // format data
    const bestData = {};
    bestData.name = currentBestDataSnapshot.val().name;
    bestData.becameBestAt = currentBestDataSnapshot.val().becameBestAt;

    resolve(bestData);
  })
}

const disconnect = () => {
  // Do I really need to return a promise here? In current testing state no,
  // but if I want to do something after this at some point it might be good?
  return new Promise(async (resolve, reject) => {
    console.log('Attempting to close connection.');
    await app.delete();
    // Do I need error handling here? Probably should have it but not sure how
    // to implement without .then and .catch. I guess I could just use those.
    // https://firebase.google.com/docs/reference/admin/node/admin.app.App?authuser=0#delete
    resolve();
  })
}

module.exports = {
  changeCurrentBest,
  checkCurrentBest,
  disconnect
};