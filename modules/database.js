require('dotenv').config();

var admin = require("firebase-admin");
var moment = require('moment');
var helpers = require('./helperFunctions');

var serviceAccount = require('../keys/' + process.env.FIREBASE_KEYS_FILENAME);

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
  // update/overwrite current best with new best
  return new Promise(async (resolve, reject) => {
    try {
      await currentBestRef.set(
        {
          name,
          becameBestAt: Date.now()
        }
      )
      console.log('Update successful.');
      resolve();
    } catch (error) {
      console.log('Update failed.');
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
    const name = currentBestDataSnapshot.val().name;
    const becameBestAt = moment(currentBestDataSnapshot.val().becameBestAt);
    const noLongerBestAt = moment();
    const durationData = moment.duration(noLongerBestAt.diff(becameBestAt))._data;

    const outputSentence = helpers.getDurationSentence(name, durationData);
    resolve(outputSentence);
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