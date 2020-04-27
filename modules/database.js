require('dotenv').config();

var admin = require("firebase-admin");

var serviceAccount = require('../keys/' + process.env.FIREBASE_KEYS_FILENAME);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://youthebesttracker.firebaseio.com"
});

const app = admin.app();
const db = admin.database();
const currentBestRef = db.ref('currentBest');

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

const disconnect = () => {
  // Do I really need to return a promise here? In current testing state no,
  // but if I want to do something after this at some point it might be good?
  return new Promise(async (resolve, reject) => {
    console.log('Attempting to close connection.');
    const connectionClosedSuccessfully = await app.delete();
    // Do I need error handling here? Probably should have it but not sure how
    // to implement without .then and .catch. I guess I could just use those.
    // https://firebase.google.com/docs/reference/admin/node/admin.app.App?authuser=0#delete
    resolve();
  })
}

module.exports = {
  changeCurrentBest,
  disconnect
};